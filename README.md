# Brow Esteline

Brow Esteline is a small beauty and laser-services business in North York, Toronto. This workspace preserves the previous AngularJS production source; the repository contains its modern static replacement and migration documentation.

## Architecture

The new website is in `site/` and uses semantic HTML, modern CSS and small vanilla JavaScript files. It has no frontend framework, package manager, runtime dependency or required build step.

AngularJS was removed because the site is content-led and does not need a client application. Static pages give every service a real URL, server-delivered content, unique metadata and better performance while remaining easy to edit.

## Sitemap

- `/` — home
- `/services/` — services hub
- `/services/tattoo-removal/`
- `/services/permanent-makeup/`
- `/services/permanent-makeup/brows/`
- `/services/permanent-makeup/lips/`
- `/services/permanent-makeup/eyeliner/`
- `/services/permanent-makeup/areola-reconstruction/`
- `/services/permanent-makeup/scar-camouflage/`
- `/services/laser-hair-removal/men/`
- `/services/laser-hair-removal/women/`
- `/about/`
- `/contact/`
- `/booking-policy/`
- `/privacy/`

The complete old-to-new mapping is in [CURRENT-SITE-AUDIT.md](CURRENT-SITE-AUDIT.md).

## Folder structure

```text
site/
  assets/
    css/site.css             shared design system and layouts
    images/                  optimized production images and SVG logo
    js/shell.js              shared header/footer web components
    js/site.js               menu, consent and event handling
    js/tracking-config.js    single tracking configuration location
  about/index.html
  booking-policy/index.html
  contact/index.html
  privacy/index.html
  services/.../index.html    crawlable service pages
  .htaccess                  Apache security, compression and cache rules
  robots.txt
  sitemap.xml
  index.html
angularJS/browEsteline/      preserved local authoritative legacy source (Git-ignored)
angularJS/backups/           preserved local historical backups (Git-ignored)
```

## Local preview

Run any static server from `site/`. With Python already installed:

```powershell
cd site
python -m http.server 8080
```

Open `http://localhost:8080/`. Do not open the HTML files directly because root-relative links expect a web server.

## Editing content

- Page copy and metadata live in each route’s `index.html`.
- Shared navigation/footer markup lives in `site/assets/js/shell.js`.
- Contact information appears in `shell.js`, `contact/index.html`, homepage JSON-LD and possibly `KATHERINE-INPUTS.md`; update these together after verification.
- The incomplete `Info@Esteline` is intentionally not an active `mailto:` link.

## Replacing or adding photos

1. Preserve the original outside `site/assets/images/` or in the historical media tree.
2. Create a web-sized copy, normally no wider than 1100–1600 px.
3. Prefer JPEG for opaque photos and SVG/PNG only where transparency is needed.
4. Put the optimized copy in `site/assets/images/`.
5. Use meaningful `alt` text when the image conveys content; use empty `alt` only for decoration.
6. Add `loading="lazy"` below the fold and explicit dimensions where practical.
7. Record the asset in `MEDIA-INVENTORY.md`.

Do not replace Katherine’s real work with stock or AI-generated beauty imagery.

## Adding a service

1. Create `site/services/<slug>/index.html` using an existing service page as the structural reference.
2. Add a unique title, meta description, canonical URL, Open Graph metadata and one H1.
3. Link the page from `/services/` and, if primary, `site/assets/js/shell.js`.
4. Add the canonical URL to `site/sitemap.xml`.
5. Use only verified service wording and real Brow Esteline media.
6. Test the page at desktop and mobile widths.

## Navigation

The shared header and footer are vanilla custom elements defined in `shell.js`. This keeps repeated navigation in one maintainable location without a framework. Core page content remains in server-delivered HTML. The mobile menu uses a semantic button, keyboard-accessible links and `aria-expanded` state.

## CSS design system

The visual system is in `site/assets/css/site.css`.

Important variables:

- `--plum: #704f61` — original primary colour
- `--mauve: #bca9a4` — original secondary colour
- `--lavender: #e3d3f1` — original PMU/about background family
- `--cream`, `--blush`, `--ink` — refined neutrals
- `--content`, `--radius`, `--shadow` — layout primitives

Breakpoints are 900 px and 600 px. Layouts use CSS Grid and fluid `clamp()` sizing. Reduced-motion preferences disable smooth scrolling and transitions.

## Gallery behaviour

Galleries are static CSS grids. This intentionally replaces the old timed AngularJS slideshows: all selected images are keyboard- and scroll-accessible, no timer runs, content shift is reduced, and JavaScript is unnecessary.

## Analytics and tracking

The single configuration location is:

`site/assets/js/tracking-config.js`

Defaults:

```js
enabled: false
metaPixelId: ""
googleMeasurementId: ""
```

To enable a platform later, enter its public ID and set `enabled: true`. Do not add secrets or account credentials. Direct Meta Pixel and direct Google Analytics loading are already supported. GTM is not adopted because it adds another management layer; it becomes worthwhile only if Katherine expects several frequently changing marketing tags.

Tracking never controls normal site functionality. Prepared generic events include `PageView` when a provider loads and `Contact` for phone/WhatsApp actions. Add booking-link tracking only after a real URL exists. A booking-link click must not be recorded as `Schedule`; that event requires an actual reliable completion signal.

Never transmit treatment details, form content, health information or appointment details.

## Consent and privacy

When tracking is disabled or no public provider ID exists, no marketing script loads and no banner appears. When tracking is configured and consent is required, the banner appears before any provider is loaded. The choice is stored in local storage under `esteline-marketing-consent`.

Visitors who decline retain all site functionality. The draft wording in `/privacy/` requires business-owner/legal approval before tracking is enabled.

## SEO

Every route has server-delivered content, a unique title, description, canonical URL and logical heading structure. Important routes include Open Graph/social metadata. The home page has `BeautySalon` JSON-LD using verified phone, address, hours and postal code. The postal code came from the Google Maps embed already used on the production contact page.

`robots.txt` points to `sitemap.xml`. When a route is added or removed, update both internal links and `sitemap.xml`.

The root page contains a small hash migration map for the old AngularJS bookmarks. Apache cannot redirect `#!/...` because fragments are not sent to the server.

## GoDaddy deployment assessment

Read-only inspection confirmed:

- GoDaddy Economy Web Hosting
- active cPanel and SSL
- document root `/home/ovrexbhl3fmg/public_html`
- File Manager, FTP, backups, Git Version Control and SSH Access are available

Recommended first deployment:

1. Obtain Katherine’s required confirmations.
2. Create/download a fresh cPanel backup.
3. Inspect and save the existing hidden `.htaccess` if present.
4. Upload `site/` to a staging directory through SFTP or File Manager.
5. Test routes, headers, SSL and old hash URLs.
6. Only after explicit deployment approval, swap the public files.

cPanel Git can support later automation. It should use a dedicated deployment branch or repository and a controlled deploy hook that publishes only `site/`. Do not connect the old GitHub snapshot until the new authoritative repository is established. GitHub Actions over SFTP is possible but adds credentials and moving parts; cPanel Git or simple SFTP is more appropriate here.

## Rollback

Follow [PRESERVATION.md](PRESERVATION.md). The essential rule is to create a fresh pre-launch archive of the actual hosted `public_html`, not rely on the older GitHub snapshot.

## Security rules

- Never commit or deploy `generated-private-key.txt`, `*.key`, `*.pem`, `*.p12` or `*.pfx`.
- Never store GoDaddy, Meta, Google, FTP or SSH credentials in this repository.
- Public tracking IDs belong only in `tracking-config.js` after deliberate approval.
- Keep directory listing disabled.
- Review `.htaccess` against the live server before replacing any existing rules.
- Do not change DNS, SSL, hosting settings or the live public root without explicit approval.

## AI Maintainer Notes

This is intentionally a simple static site. Preserve that constraint.

- `site/` is the new deployable web root.
- `angularJS/browEsteline/` is historical evidence and the authoritative legacy source; do not “clean it up” casually.
- Maintain the current-site lineage: warm plum/mauve/lavender palette, image-led services, Services/Contact/About navigation and real Brow Esteline media.
- Do not introduce React, Vue, Angular, a CSS framework or a build pipeline for ordinary content changes.
- Keep each service crawlable at its own static URL.
- Keep tracking disabled until real IDs and privacy wording are approved.
- Never infer an email domain, booking URL, social handle, certification, award, medical claim or price.
- Preserve unique originals and generate optimized copies rather than overwriting them.
- Keep old hash migration support in the root page.
- Update canonicals, metadata, JSON-LD, internal links, sitemap and media inventory together when relevant.
- Do not refactor shared CSS or the small shell component into a dependency-heavy abstraction.
- Production deployment and external account changes always require explicit user approval.

## Related documentation

- [Current audit and route map](CURRENT-SITE-AUDIT.md)
- [Media inventory](MEDIA-INVENTORY.md)
- [Katherine’s outstanding inputs](KATHERINE-INPUTS.md)
- [Preservation and rollback](PRESERVATION.md)
