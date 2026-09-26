# Brow Esteline Current-Site Audit

Audit date: 2026-09-26

## Authoritative production source

The authoritative local source is `angularJS/browEsteline`, specifically its `dist/` output. It is newer and more complete than `angularJS/SEO`, the old GitHub snapshot, and the nearby experimental Angular projects.

Read-only cPanel inspection confirmed that the deployed document root is `/home/ovrexbhl3fmg/public_html`. Its structure and modification dates match the local April 6, 2024 production build:

- `assets/`
- `partials/`
- `views/`
- `app.js` (6.31 KB)
- `index.html` (478 bytes)
- `styles.css` (15.67 KB)
- `node_modules/`
- `dist.zip` (209.14 MB)

No hosted files were changed or downloaded.

## Current technology

- AngularJS 1.8.2 and `ngRoute`
- Hashbang routes (`#!/...`)
- Gulp/Babel/minification pipeline
- One root HTML shell with client-rendered partials
- Large PNG-heavy media delivery
- Google Maps iframe on the contact route

## Current sitemap

| Existing route | Page/content |
|---|---|
| `#!/` | Home |
| `#!/service-tattoo-removal` | Tattoo and PMU removal |
| `#!/service-pmu` | Permanent makeup hub |
| `#!/service-pmu-areola` | Areola reconstruction |
| `#!/service-pmu-brows` | Brows |
| `#!/service-pmu-eyeliner` | Eyeliner |
| `#!/service-pmu-lips` | Lips |
| `#!/service-pmu-scar` | Scar camouflage |
| `#!/service-hair-removal-men` | Laser hair removal for men |
| `#!/service-hair-removal-women` | Laser hair removal for women |
| `#!/about` | About Katherine |
| `#!/contact` | Contact, hours, address and map |
| `#!/booking` | Booking and cancellation policy (not linked in main navigation) |

## Content and integration findings

- The visible navigation philosophy is Services, Contact and About, with service sub-navigation.
- Home is image-led and groups services into tattoo removal, permanent makeup and hair removal.
- PMU branches into five real service pages: brows, lips, eyeliner, areola reconstruction and scar camouflage.
- Phone and address are plain text on the old site; the rebuild adds proper phone and WhatsApp links.
- The embedded map is valid and identifies postal code `M3H 5S4`. This is the authoritative map source used for structured data.
- The previous live site displayed the incomplete `Info@Esteline`; Katherine has since confirmed `BrowEsteline@gmail.com` for the rebuilt site.
- No verified booking platform, Instagram URL, Facebook URL, contact form endpoint or Google Business Profile URL exists in the production source.
- No existing marketing pixel or analytics integration was found.

## Main issues found

- Hash fragments are not server-visible and cannot be redirected by `.htaccess` in the normal way.
- Every route shares the generic title `Esteline`; descriptions, canonicals, Open Graph tags and structured data are absent.
- Page content depends on JavaScript and AngularJS templates.
- Several source PNG files are 3–12 MB each; some pages ship many of them.
- The responsive CSS scales desktop dimensions rather than using a mobile-first layout.
- Image alt text is missing or inaccurate on multiple pages.
- The booking page contains typographical errors and currently unverified policy amounts.
- Price, longevity, credential and safety statements need owner confirmation because the live content has not been updated since 2024.

## Old → new URL map

| Existing hash route | New static URL |
|---|---|
| `#!/` | `/` |
| `#!/service-tattoo-removal` | `/services/tattoo-removal/` |
| `#!/service-pmu` | `/services/permanent-makeup/` |
| `#!/service-pmu-areola` | `/services/permanent-makeup/areola-reconstruction/` |
| `#!/service-pmu-brows` | `/services/permanent-makeup/brows/` |
| `#!/service-pmu-eyeliner` | `/services/permanent-makeup/eyeliner/` |
| `#!/service-pmu-lips` | `/services/permanent-makeup/lips/` |
| `#!/service-pmu-scar` | `/services/permanent-makeup/scar-camouflage/` |
| `#!/service-hair-removal-men` | `/services/laser-hair-removal/men/` |
| `#!/service-hair-removal-women` | `/services/laser-hair-removal/women/` |
| `#!/about` | `/about/` |
| `#!/contact` | `/contact/` |
| `#!/booking` | `/booking-policy/` |

The new root page maps these fragments in the browser with `location.replace()`. This is the practical migration mechanism because URL fragments never reach Apache. Normal server redirects cannot inspect them.

## Hosting assessment

- GoDaddy Web Hosting, Economy plan, active.
- cPanel 134.0.60; primary domain `esteline.ca`.
- Document root: `/home/ovrexbhl3fmg/public_html`.
- Home directory: `/home/ovrexbhl3fmg`.
- SSL status: active.
- File Manager, FTP Accounts, Backup/Backup Wizard, Git Version Control and SSH Access are available.
- Public root currently contains no visible `.htaccess`; File Manager was not configured to reveal dotfiles, so this is not proof that none exists.
- cPanel Git makes Git-based deployment technically possible. For this small static site, the safest first launch is still a versioned archive plus staged File Manager/SFTP replacement. Git automation can follow after a tested cPanel repository and deploy hook are configured.

## Sensitive certificate files

`angularJS/generated-private-key.txt` is present locally and excluded by `.gitignore`. Its contents were not displayed, copied or uploaded. `generated-csr.txt` is nearby. File presence alone cannot prove that this key backs the currently active GoDaddy SSL certificate. Securing or rotating it should be handled as a separate explicit task.
