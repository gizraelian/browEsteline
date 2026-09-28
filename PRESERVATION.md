# Production Preservation and Rollback

## Preserved sources

- Primary local production source: `angularJS/browEsteline/`
- Built production copy: `angularJS/browEsteline/dist/`
- Existing local backup archives: `angularJS/backups/`
- Legacy cPanel backup artifacts were observed during the original audit; do not rely on them for rollback.

The rebuild is isolated in `site/`. No original source, backup, remote repository, hosted file, DNS record or SSL setting was modified.

## Before production deployment

1. Create and download a fresh full cPanel backup or at minimum a compressed copy of `public_html`.
2. Record the existing `.htaccess`, including hidden files.
3. Store the backup outside `public_html` and verify it opens.
4. Upload the new site to a non-public staging directory and test it there.
5. Replace the public root only after Katherine approves content and the user explicitly approves deployment.

## Rollback

Restore the fresh pre-launch `public_html` archive through cPanel File Manager or Backup Wizard. Do not rely only on the old GitHub repository because it predates the current production source.
