import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const configCode = readFileSync('site/assets/js/tracking-config.js', 'utf8');
const siteCode = readFileSync('site/assets/js/site.js', 'utf8');

function createRuntime(initialConsent) {
  const values = new Map();
  if (initialConsent) values.set('esteline-marketing-consent', initialConsent);

  const listeners = {};
  const accept = { addEventListener: (_type, handler) => { listeners.accept = handler; } };
  const reject = { addEventListener: (_type, handler) => { listeners.reject = handler; } };
  const banner = { dataset: {} };
  const appendedScripts = [];

  const document = {
    head: { append: script => appendedScripts.push(script) },
    createElement: tag => ({ tagName: tag.toUpperCase(), async: false, src: '' }),
    querySelector(selector) {
      if (selector === '[data-consent]') return banner;
      if (selector === '[data-consent-accept]') return accept;
      if (selector === '[data-consent-reject]') return reject;
      return null;
    },
    querySelectorAll: () => [],
    addEventListener(type, handler) { listeners[type] = handler; }
  };

  const localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
  const window = {};
  const context = vm.createContext({ document, localStorage, window });
  vm.runInContext(configCode, context, { filename: 'tracking-config.js' });
  vm.runInContext(siteCode, context, { filename: 'site.js' });

  return { appendedScripts, banner, listeners, values, window };
}

function fbqCalls(runtime) {
  if (!runtime.window.fbq) return [];
  return JSON.parse(JSON.stringify(runtime.window.fbq.queue.map(args => Array.from(args))));
}

{
  const runtime = createRuntime();
  assert.equal(runtime.banner.dataset.visible, 'true');
  assert.equal(runtime.appendedScripts.length, 0);
  assert.equal(runtime.window.fbq, undefined);

  runtime.listeners.reject();
  assert.equal(runtime.values.get('esteline-marketing-consent'), 'rejected');
  assert.equal(runtime.banner.dataset.visible, 'false');
  assert.equal(runtime.appendedScripts.length, 0);
}

{
  const runtime = createRuntime();
  runtime.listeners.accept();
  assert.equal(runtime.values.get('esteline-marketing-consent'), 'accepted');
  assert.equal(runtime.banner.dataset.visible, 'false');
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(runtime.appendedScripts[0].async, true);
  assert.equal(runtime.appendedScripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
  assert.deepEqual(fbqCalls(runtime).map(call => call.slice(0, 2)), [
    ['init', '2588326998328560'],
    ['track', 'PageView']
  ]);

  runtime.listeners.accept();
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(fbqCalls(runtime).length, 2);
}

{
  const runtime = createRuntime('accepted');
  assert.equal(runtime.appendedScripts.length, 1);
  runtime.listeners.click({
    target: {
      closest: selector => selector === '[data-track]'
        ? { dataset: { track: 'Contact', trackAction: 'whatsapp_contact' } }
        : null
    }
  });
  assert.deepEqual(fbqCalls(runtime)[2], ['track', 'Contact', { action: 'whatsapp_contact' }]);
}

{
  const runtime = createRuntime('rejected');
  assert.equal(runtime.appendedScripts.length, 0);
  assert.equal(runtime.window.fbq, undefined);
  assert.equal(runtime.banner.dataset.visible, undefined);
}

console.log('PASS tracking runtime: consent gating, one Meta init/PageView, async loader and Contact event');
