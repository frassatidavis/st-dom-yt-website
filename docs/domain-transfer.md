# saintdominic.org Domain Transfer Checklist

Prepared for the migration from eCatholic to the GitHub Pages-hosted St. Dominic site.

## Current State

- Registrar account: GKG.net.
- Current authoritative nameservers: `mario.ns.cloudflare.com` and `nataly.ns.cloudflare.com`.
- Current web target: `saintdominic.org` and `www.saintdominic.org` are CNAME records pointing to `cf.sites.ecatholic.com`.
- Email is Google Workspace and must be preserved.
- eCatholic will keep the current site/DNS active until the cancellation form is submitted.
- eCatholic Payments is bundled with the eCatholic hosting plan and is not part of this transfer.
- The new site links online giving through Flocknote. Before cancelling eCatholic,
  verify the public Flocknote giving URL works in a private browser and is set in
  `VITE_FLOCKNOTE_GIVING_URL`.

## Records To Preserve

Keep these records exactly unless Google Workspace gives new values:

| Type | Host | Priority | Value |
| --- | --- | --- | --- |
| MX | `@` | 1 | `aspmx.l.google.com.` |
| MX | `@` | 5 | `alt1.aspmx.l.google.com.` |
| MX | `@` | 5 | `alt2.aspmx.l.google.com.` |
| MX | `@` | 10 | `alt3.aspmx.l.google.com.` |
| MX | `@` | 10 | `alt4.aspmx.l.google.com.` |
| TXT | `@` | | `"v=spf1 include:_spf.google.com ~all"` |

## Records To Change At Launch

These replace the eCatholic web records.

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `jmmarquez2025.github.io.` |

Remove the old eCatholic web records:

- `saintdominic.org CNAME cf.sites.ecatholic.com.`
- `www.saintdominic.org CNAME cf.sites.ecatholic.com.`
- `_acme-challenge.saintdominic.org CNAME saintdominic.org.b990d23246b0988a.dcv.cloudflare.com.`

## GitHub Pages Launch Steps

One repository variable decides where the site is built for: `VITE_SITE_URL`
(Settings → Secrets and variables → Actions → Variables). It sets the Vite
`base` path, canonical/Open Graph/JSON-LD URLs, the sitemap and robots.txt.
While it is unset, `deploy.yml` builds for
`https://jmmarquez2025.github.io/st-dom-yt-website` (base `/st-dom-yt-website/`).

Each build only works at one address, and the Pages custom domain applies
independently of deploys. This order never shows visitors a blank page or
GitHub's "Site not found" page:

1. Before merging the launch build, check the variable is absent or still the
   github.io URL: `gh variable list -R jmmarquez2025/st-dom-yt-website`.
2. Merge to `main` and wait for "Deploy to GitHub Pages" to finish green.
   github.io should now serve the new build (`sw.js` says `st-dominic-v6`).
3. Prepare the new DNS zone (records in the tables above) without switching
   nameservers yet:
   - If staying on GKG DNS, enable GKG DNS Zone Hosting and recreate the preserved mail records plus the new GitHub Pages web records.
   - If using another DNS provider, create the same records there.
4. While saintdominic.org still points at eCatholic, do these together:
   - set the repository variable `VITE_SITE_URL` to `https://saintdominic.org`;
   - in Pages settings, set the custom domain to `saintdominic.org`;
   - run "Deploy to GitHub Pages" (Actions → Run workflow) and wait for green.
   github.io visitors are now redirected to saintdominic.org, which still shows
   eCatholic, so nobody sees a mismatched build. Confirm with
   `curl -I https://jmmarquez2025.github.io/st-dom-yt-website/` (301 to saintdominic.org).
5. Switch DNS: point GKG's nameservers at the prepared zone
   (`NS3.GKG.NET` / `NS4.GKG.NET` for GKG DNS). Do this at a low-traffic time,
   not just before the Saturday vigil Mass.
6. Wait for DNS to resolve:
   - `dig saintdominic.org A`
   - `dig www.saintdominic.org CNAME`
   - `dig saintdominic.org MX`
   Send a test email to and from office@saintdominic.org.
7. In Pages settings, wait for the TLS certificate to issue, then enforce
   HTTPS. Until it issues, https://saintdominic.org shows a certificate warning.
8. Verify `https://saintdominic.org/`, `https://www.saintdominic.org/`,
   `/mass-times`, an old eCatholic URL such as `/about-us` (should land on
   `/about`), `/sitemap.xml`, and `/robots.txt`.
9. Only after the new site is live and verified, coordinate any eCatholic cancellation date. Do not cancel eCatholic before the Flocknote giving page is live, tested without admin login, and linked from `/give`.

Rollback: delete the `VITE_SITE_URL` variable, remove the custom domain, and
re-run the deploy — the site returns to the github.io address.

## References

- GitHub Pages custom domain DNS records: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GKG DNS FAQ and DNS Zone Hosting notes: https://www.gkg.net/domain/support/faq/dns.html
