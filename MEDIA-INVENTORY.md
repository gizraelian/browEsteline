# Brow Esteline Media Inventory

Scan date: 2026-09-26

## Scope and duplicate findings

The entire `C:\Coding\browEsteline` tree was scanned, excluding `node_modules`.

- 530 media files across PNG, JPG/JPEG, SVG, ICO, MP4, WebP and AVIF extensions
- 254 unique content hashes
- 118 duplicate hash groups
- 102 canonical files in the authoritative production `dist/assets/` directory
- 30 lightweight production assets generated in `site/assets/images/`

Most duplicates are identical copies across `media/`, `angularJS/browEsteline/assets/`, `angularJS/browEsteline/dist/assets/`, `angularJS/SEO/dist/assets/`, `angularJS/New folder/dist/assets/`, and numbered backup folders. The canonical migration source is `angularJS/browEsteline/dist/assets/`. Originals remain untouched.

## Production assets used in the rebuild

| New filename | Canonical original | Original dimensions | Original size | New use | Optimization |
|---|---|---:|---:|---|---|
| `logo.svg` | `logo.svg` | vector | 10 KB | Header/footer | Preserved SVG |
| `hero.jpg` | `hero-image.png` | 2173×1179 | 4,806 KB | Home hero | 1600 px JPEG, 176 KB |
| `hero-960.jpg` | `hero-image.png` | 2173×1179 | 4,806 KB | Mobile home hero | 960 px JPEG, 69 KB |
| `service-tattoo.jpg` | `main-1C.png` | 799×701 | 779 KB | Tattoo service card | JPEG, 53 KB |
| `service-pmu.jpg` | `main-2B.png` | 800×800 | 1,036 KB | PMU service card/hero | JPEG, 85 KB |
| `service-hair.jpg` | `main-3B.png` | 799×800 | 739 KB | Hair-removal card | JPEG, 58 KB |
| `katherine.jpg` | `pmu-about.png` | 1796×2296 | 5,027 KB | About/home portrait | 1100 px JPEG, 166 KB |
| `tattoo-eyeliner.jpg` | `tattoo-removal-1.png` | 1953×1964 | 3,020 KB | Removal gallery | 1100 px JPEG, 128 KB |
| `tattoo-brows.jpg` | `tattoo-removal-2.png` | 2012×1964 | 4,678 KB | Removal gallery | 1100 px JPEG, 117 KB |
| `tattoo-body.jpg` | `tattoo-removal-4.png` | 2931×1964 | 6,862 KB | Removal hero/gallery | 1100 px JPEG, 83 KB |
| `tattoo-lips.jpg` | `tattoo-removal-5.png` | 1665×1964 | 3,351 KB | Removal gallery | 1100 px JPEG, 105 KB |
| `pmu-brows.jpg` | `pmu-eyebrows.png` | 1351×1719 | 2,557 KB | PMU card/contact hero | 1100 px JPEG, 231 KB |
| `pmu-lips.jpg` | `pmu-lips.png` | 1421×1423 | 2,650 KB | PMU card | 1100 px JPEG, 118 KB |
| `pmu-eyeliner.jpg` | `pmu-eyeliner.png` | 1438×1440 | 1,659 KB | PMU card | 1100 px JPEG, 139 KB |
| `pmu-areola.jpg` | `pmu-areola.png` | 1438×1440 | 2,861 KB | PMU card/hero | 1100 px JPEG, 121 KB |
| `pmu-scar.jpg` | `pmu-scar-coverup.png` | 1439×1440 | 3,026 KB | PMU card | 1100 px JPEG, 143 KB |
| `brows-ombre.jpg` | `pmu-eyebrows-1-1-ombre.png` | 1505×1501 | 3,259 KB | Brows hero/gallery | 1100 px JPEG, 147 KB |
| `brows-nano.jpg` | `pmu-eyebrows-1-2-hair-strokes.png` | 1514×1501 | 2,236 KB | Brows gallery | 1100 px JPEG, 161 KB |
| `brows-combo.jpg` | `pmu-eyebrows-1-3-combo.png` | 1327×1350 | 1,690 KB | Brows gallery | 1100 px JPEG, 95 KB |
| `brows-lamination.jpg` | `pmu-eyebrows-1-4-lamination-tint.png` | 2079×1501 | 3,657 KB | Brows gallery | 1100 px JPEG, 95 KB |
| `lip-blush.jpg` | `pmu-lips-1-1.png` | 817×924 | 847 KB | Lip blush page/gallery | JPEG, 82 KB |
| `lip-neutralization.jpg` | `pmu-lips-2-1.png` | 921×924 | 1,343 KB | Lip page | JPEG, 117 KB |
| `eyeliner-result.jpg` | `pmu-eyeliner-1.png` | 819×924 | 1,058 KB | Eyeliner page/gallery | JPEG, 73 KB |
| `areola-result.jpg` | `pmu-areola-1.png` | 1371×924 | 1,277 KB | Reserved future gallery | 1100 px JPEG, 49 KB |
| `scar-result.jpg` | `pmu-scar-1B.png` | 890×924 | 1,360 KB | Scar hero | JPEG, 118 KB |
| `hair-men-portrait.jpg` | `hair-removal-men-1.png` | 1920×2885 | 5,827 KB | Men’s service content | 1100 px JPEG, 170 KB |
| `hair-men-treatment.jpg` | `hair-removal-men-4.png` | 1911×1440 | 2,735 KB | Men’s service hero | 1100 px JPEG, 85 KB |
| `hair-men-result.jpg` | `hair-removal-men-5.png` | 1930×1440 | 3,237 KB | Reserved men’s gallery | 1100 px JPEG, 85 KB |
| `hair-women-treatment.jpg` | `hair-removal-women-1.png` | 1686×941 | 856 KB | Women’s service hero | 1100 px JPEG, 60 KB |
| `hair-women-detail.jpg` | `hair-removal-women-section2-background.png` | 4269×2400 | 10,894 KB | Women’s service content | 1100 px JPEG, 116 KB |

All below-the-fold images use native lazy loading. The hero has 960 px and 1600 px responsive variants. Unique originals were not overwritten.

## Canonical production library: used and retained

The following 102 files are the complete authoritative `angularJS/browEsteline/dist/assets/` inventory. “Retained” means the source remains available for future page/gallery work even when not selected for the lean first release.

### Brand and home

| Filename | Dimensions | Existing use | Proposed status |
|---|---:|---|---|
| `logo.svg` | vector | Header logo | Used, preferred original |
| `logo.png` | 1577×606 | Header logo | Duplicate presentation; retain |
| `logo-purple.png` | 3015×1171 | Men’s page logo | Alternate; retain |
| `hamburger.png` | 128×128 | Mobile menu | Replaced by text/CSS control |
| `favicon.ico` | icon | Site favicon | Used from project root copy |
| `hero-image.png` | 2173×1179 | Home hero | Used, optimized |
| `hero_image.png` | 1032×266 | Earlier hero variant | Retain |
| `main-1.png` | 1201×800 | Earlier tattoo tile | Retain |
| `main-1B.png` | 799×800 | Tattoo tile variant | Retain |
| `main-1C.png` | 799×701 | Current tattoo tile | Used, optimized |
| `main-2.png` | 1200×800 | Earlier PMU tile | Retain |
| `main-2B.png` | 800×800 | Current PMU tile | Used, optimized |
| `main-3.png` | 1199×800 | Earlier hair tile | Retain |
| `main-3B.png` | 799×800 | Current hair tile | Used, optimized |
| `main-3C.png` | 734×564 | Women’s tile/background | Retain |
| `img-tatt-low.png` | 339×214 | Early thumbnail | Retain |
| `img-permanent-makeup-low.png` | 340×215 | Early thumbnail | Retain |
| `img-hair-rem-low.png` | 339×215 | Early thumbnail | Retain |
| `about.png` | 450×799 | About slideshow | Retain |
| `pmu-about.png` | 1796×2296 | About/PMU imagery | Used, optimized |
| `pmu-brow-esteline.png` | 1440×1439 | PMU hub | Retain |
| `pmu-contact-us.png` | 1885×1318 | Contact art | Retain |
| `pmu-background.png` | 3415×1920 | PMU background | Retain; too large for first release |

### Tattoo removal

| Filename | Dimensions | Existing use | Proposed status |
|---|---:|---|---|
| `tattoo-removal-1.png` | 1953×1964 | Eyeliner removal | Used, optimized |
| `tattoo-removal-2.png` | 2012×1964 | Brow removal | Used, optimized |
| `tattoo-removal-3A.png` | 1758×3485 | Additional removal sequence | Retain |
| `tattoo-removal-3B.png` | 1512×3032 | Additional removal sequence | Retain |
| `tattoo-removal-4.png` | 2931×1964 | Tattoo removal | Used, optimized |
| `tattoo-removal-5.png` | 1665×1964 | Lip removal | Used, optimized |

### PMU category and detailed results

| Filename/range | Dimensions | Existing use | Proposed status |
|---|---:|---|---|
| `pmu-eyebrows.png` | 1351×1719 | Brows category | Used, optimized |
| `pmu-lips.png` | 1421×1423 | Lips category | Used, optimized |
| `pmu-eyeliner.png` | 1438×1440 | Eyeliner category | Used, optimized |
| `pmu-areola.png` | 1438×1440 | Areola category | Used, optimized |
| `pmu-scar-coverup.png` | 1439×1440 | Scar category | Used, optimized |
| `pmu-eyebrows-1-1-ombre.png` | 1505×1501 | Brows collection | Used, optimized |
| `pmu-eyebrows-1-2-hair-strokes.png` | 1514×1501 | Brows collection | Used, optimized |
| `pmu-eyebrows-1-3-combo.png` | 1327×1350 | Brows collection | Used, optimized |
| `pmu-eyebrows-1-4-lamination-tint.png` | 2079×1501 | Brows collection | Used, optimized |
| `pmu-eyebrows-2-1.png` … `2-6.png` | 819–1450×924 | Ombre slideshow | Retain for expanded gallery |
| `pmu-eyebrows-3-1.png` … `3-6.png` | 367–1513×367–1501 | Nano slideshow | Retain for expanded gallery |
| `pmu-eyebrows-4-1.png` … `4-6.png` | 671–965×583–924 | Combo slideshow | Retain for expanded gallery |
| `pmu-eyebrows-5-1.png` … `5-6.png` | 1369–1391×924 | Lamination slideshow | Retain for expanded gallery |
| `pmu-lips-1-1.png` … `1-4.png` | 817–923×924 | Lip blush slideshow | First used; all retained |
| `pmu-lips-2-1.png` … `2-4.png` | 377–923×372–924 | Neutralization slideshow | First used; all retained |
| `pmu-eyeliner-1.png` … `4.png` | 819–925×924 | Eyeliner slideshow | First used; all retained |
| `pmu-areola-1.png` … `4.png` | 626–1371×591–924 | Areola slideshow | First optimized; all retained |
| `pmu-scar-1.png`, `1B.png`, `2.png`, `3.png`, `4.png` | 727–1372×635–924 | Scar slideshow | `1B` used; all retained |

### Laser hair removal

| Filename/range | Dimensions | Existing use | Proposed status |
|---|---:|---|---|
| `hair-removal-men-1.png` | 1920×2885 | Men’s intro | Used, optimized |
| `hair-removal-men-2.png` | 1780×1440 | Men’s intro | Retain |
| `hair-removal-men-3.png` | 1818×1440 | Men’s intro | Retain |
| `hair-removal-men-4.png` | 1911×1440 | Men’s privacy section | Used, optimized |
| `hair-removal-men-5.png` | 1930×1440 | Men’s benefits | Optimized, reserved |
| `hair-removal-men-6.png` | 2135×1440 | Men’s benefits | Retain |
| `hair-removal-men-7.png` | 1903×1440 | Men’s benefits | Retain |
| `hair-removal-men-8.png` | 1440×1591 | Men’s benefits | Retain |
| `hair-removal-men-package-1.png` … `3.png` | 1438–1439×1440 | Men’s package graphics | Retain; replaced by accessible HTML text |
| `hair-removal-men-section4-background.png` | 3415×1152 | Men’s price background | Retain |
| `hair-removal-women-1.mp4` | video | Women’s hero | Retain; omitted for performance |
| `hair-removal-women-1.png` | 1686×941 | Women’s explainer | Used, optimized |
| `hair-removal-women-package-1.png` … `3.png` | 1439–1440×1440 | Women’s package graphics | Retain; replaced by accessible HTML text |
| `hair-removal-women-section2-background.png` | 4269×2400 | Treatment explainer | Used, optimized |
| `hair-removal-women-section3-background.png` | 4269×2400 | Price background | Retain |
| `hair-removal-women-section4-background.png` | 4269×2400 | Package background | Retain |

## Useful local media not on the current live pages

- `media/Canva downloads/` contains `main.png`, `Contact.png` and `Contact1.png`; useful as historical design references.
- `media/stock images/` contains three Pexels images. They are not used because the rebuild prioritizes Katherine’s real media.
- `media/Facebook Insta.png`, `1.png`, `2.png`, `3.png`, `photo1693414711*.jpeg` and `badd5b66dd.mp4` are retained for owner review but not published without context and consent confirmation.
- `media/tattoo-removal-x.svg` and `media/logo 2.svg` are alternate vector assets retained for comparison.
- `media/Landing Page.png` and `Landing Page.zip` are historical layout exports and are not production assets.

## Duplicate/original policy

Identical copies are not deleted during this rebuild. The production `dist/assets/` copy is treated as canonical for migration, while the top-level `media/` tree and backup copies remain historical preservation sources. A future cleanup may deduplicate them only after a verified archive and explicit approval.
