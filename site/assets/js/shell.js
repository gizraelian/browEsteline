class SiteHeader extends HTMLElement {
  connectedCallback() {
    const path = location.pathname;
    const current = target => path === target || (target !== '/' && path.startsWith(target));
    this.innerHTML = `
      <a class="skip-link" href="#main">Skip to main content</a>
      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="/" aria-label="Brow Esteline home"><img src="/assets/images/logo.svg" width="154" height="59" alt="Brow Esteline"></a>
          <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-button>☰</button>
          <nav class="nav-links" aria-label="Primary navigation" data-nav>
            <a href="/" ${current('/') ? 'aria-current="page"' : ''}>Home</a>
            <details class="nav-group">
              <summary>Services</summary>
              <div class="nav-menu">
                <a href="/services/">All services</a>
                <a href="/services/tattoo-removal/">Tattoo removal</a>
                <a href="/services/permanent-makeup/">Permanent makeup</a>
                <a href="/services/laser-hair-removal/men/">Hair removal for men</a>
                <a href="/services/laser-hair-removal/women/">Hair removal for women</a>
              </div>
            </details>
            <a href="/about/" ${current('/about/') ? 'aria-current="page"' : ''}>About</a>
            <a href="/contact/" ${current('/contact/') ? 'aria-current="page"' : ''}>Contact</a>
            <a class="nav-cta" href="tel:+14167861101" data-track="Contact" data-track-action="phone_header">Call</a>
          </nav>
        </div>
      </header>`;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="section contact-band" aria-labelledby="contact-cta-title">
        <div class="container">
          <div><p class="eyebrow">North York, Toronto</p><h2 id="contact-cta-title">Ready to ask about a service?</h2><p>Call or message Brow Esteline to discuss availability and next steps.</p></div>
          <div class="actions"><a class="button button--light" href="tel:+14167861101" data-track="Contact" data-track-action="phone_footer">416-786-1101</a><a class="button button--ghost" style="color:white" href="https://wa.me/14167861101" data-track="Contact" data-track-action="whatsapp_footer">WhatsApp</a></div>
        </div>
      </section>
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div><img src="/assets/images/logo.svg" width="150" height="58" alt="Brow Esteline"><p>Permanent makeup, tattoo removal and laser hair removal in North York, Toronto.</p></div>
            <div><h2>Visit</h2><p>4646 Dufferin St., Unit 3<br>Toronto, ON M3H 5S4<br><small>Parking and entrance at the back.</small></p><p><a href="mailto:BrowEsteline@gmail.com" data-track="Contact" data-track-action="email_footer">BrowEsteline@gmail.com</a><br><a href="/contact/">Map and hours</a></p></div>
            <div><h2>Explore</h2><nav class="footer-links" aria-label="Footer navigation"><a href="/services/">Services</a><a href="/about/">About Katherine</a><a href="/booking-policy/">Booking policy</a><a href="/privacy/">Privacy &amp; tracking</a></nav></div>
          </div>
          <div class="footer-bottom"><span>© <span data-year></span> Esteline. All rights reserved.</span></div>
        </div>
      </footer>
      <aside class="consent" data-consent role="dialog" aria-label="Marketing cookie choice">
        <h2>Privacy choice</h2><p>With your permission, Brow Esteline may use optional marketing analytics. The site works normally without them.</p>
        <div class="actions"><button class="button" type="button" data-consent-accept>Allow</button><button class="button button--ghost" type="button" data-consent-reject>Decline</button><a href="/privacy/">Learn more</a></div>
      </aside>`;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
