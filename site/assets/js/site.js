(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.dataset.open !== 'true';
      nav.dataset.open = String(open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        nav.dataset.open = 'false';
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

  const config = window.EstelineTrackingConfig || {};
  const consentKey = 'esteline-marketing-consent';
  const hasProvider = Boolean(config.metaPixelId || config.googleMeasurementId);
  const consent = localStorage.getItem(consentKey);
  const banner = document.querySelector('[data-consent]');

  const loadTracking = () => {
    if (!config.enabled || !hasProvider || window.__estelineTrackingLoaded) return;
    window.__estelineTrackingLoaded = true;

    if (config.metaPixelId) {
      window.fbq = window.fbq || function(){ (window.fbq.q = window.fbq.q || []).push(arguments); };
      window.fbq('init', config.metaPixelId);
      window.fbq('track', 'PageView');
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.append(script);
    }

    if (config.googleMeasurementId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', config.googleMeasurementId, { anonymize_ip: true });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.googleMeasurementId)}`;
      document.head.append(script);
    }
  };

  window.estelineTrack = (eventName, properties = {}) => {
    if (!window.__estelineTrackingLoaded) return;
    const safeProperties = { action: String(properties.action || 'website').slice(0, 40) };
    if (window.fbq) window.fbq('trackCustom', eventName, safeProperties);
    if (window.gtag) window.gtag('event', eventName, safeProperties);
  };

  if (config.enabled && hasProvider) {
    if (!config.consentRequired || consent === 'accepted') loadTracking();
    else if (!consent && banner) banner.dataset.visible = 'true';
  }

  document.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'accepted');
    if (banner) banner.dataset.visible = 'false';
    loadTracking();
  });
  document.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'rejected');
    if (banner) banner.dataset.visible = 'false';
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-track]');
    if (link) window.estelineTrack(link.dataset.track, { action: link.dataset.trackAction || 'click' });
  });
})();
