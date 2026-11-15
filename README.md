# mahashivaji.org — MahaShivaji Foundation website

A plain static site: no build step, no server code. Every file in this folder goes online exactly as it is.

```
index.html        Home
strength.html     Strength first: the manifesto, twelve issues and answers, conduct
begin.html        Begin with yourself: pledge, resolutions, self-resolve guides
network.html      01 Connect · The Network
ventures.html     02 Create · Ventures
academy.html      03 Develop · Academy
contribute.html   04 Contribute
civic-lab.html    05 Improve · Civic Lab
frontier.html     06 Progress · Frontier Maharashtra
shivcharitra.html Shivcharitra: free books, comics and games; the Fort Quiz
forts.html        The Forts: 23 key forts, 12 UNESCO, with sources and maps
maharashtra.html  36 Districts: Census 2011 figures, division filter, outreach
d-*.html          One open profile page per district (36 files)
library.html      The Archive: 41 files with search, filters, random pull and a keyboard viewer
foundation.html   The Foundation: story, strengths we build on, inspiration, charter, panel, location
404.html          Page not found
assets/           site.css, site.js, fonts.css, fonts/, img/
CNAME             mahashivaji.org (used by GitHub Pages)
.nojekyll         tells GitHub Pages to serve files as they are
sitemap.xml, robots.txt
```

## Before you upload: one optional setting

There are no forms on this site. Every "write to us" link opens the visitor's email with team@mahashivaji.org, a subject line and the details we need already filled in, so nothing extra has to be set up for it to work on GitHub Pages or Cloudflare Pages.

Optional: to show a WhatsApp button, open `assets/site.js` and put your number with country code, digits only (e.g. `919800000000`), in the `whatsapp` line.

To change the email address, find and replace `team@mahashivaji.org` across all files.

## Option A: GitHub Pages (same as before)

1. On github.com, open your repository (or create one, e.g. `mahashivaji-site`).
2. **Add file → Upload files**. Drag in *everything inside* this folder, including the `assets` folder, `CNAME` and `.nojekyll`. Commit.
   - Files must sit at the top of the repository, so `index.html` is visible on the repo's front page, not inside a sub-folder.
   - `.nojekyll` is a hidden file. If your computer hides it, upload it on its own afterwards, or skip it; the site still works.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root) → Save.**
4. In **Custom domain**, enter `mahashivaji.org` (the CNAME file fills this in). Tick **Enforce HTTPS** once it appears.
5. At your domain registrar, point the domain to GitHub:
   - Four **A** records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - One **CNAME** record for `www`: `<your-github-username>.github.io`
   - DNS can take a few hours to update.

To update later: upload the changed files over the old ones and commit. The site refreshes in a minute or two.

## Option B: Netlify Drop (fastest, no GitHub)

Go to app.netlify.com/drop and drag this whole folder onto the page. It is live in seconds on a netlify.app address; add mahashivaji.org under Domain settings.

## Option C: Cloudflare Pages (recommended)

Workers & Pages → Create → Pages → Upload assets → drag the folder. Add the custom domain in the project settings.

## Editing text

Every page is ordinary HTML. To add a resource to the Library, copy one `<a class="item" ...>` block in library.html and change its link, title, description and the data-stage / data-need / data-type values.

If you uploaded the earlier version, delete its old pages from the repository (explore.html, learn.html, start.html, my-area.html, connect.html, join.html, about.html) so they do not linger online.

Fonts are self-hosted (SIL Open Font License): Inter and Source Serif 4.

## Design notes (v6, "Open Files")

- Black ground, one orange (#FF6A13), line drawings generated as inline SVG. Fonts are IBM Plex Mono and Inter, self-hosted in assets/fonts.
- The home page plays a short boot sequence once per browser session. Any key or tap skips it. Visitors who set "reduce motion" never see it, and all other animation is switched off for them too.
- The status bar clock shows India time. "Session" is a random four-character code made in the browser; nothing is tracked or sent anywhere.
- To add a file to the Archive, add a line to the list in the build script, or copy one `<a class="item" ...>` block in library.html and change its link, title, description and data-stage / data-need / data-type values.

## Updating district profiles

Each d-<district>.html page has a "What this file will hold" list with six sections marked "Being compiled". As stewards verify material, replace a section's "Being compiled" tag with the content and its sources. District figures come from Census 2011; update them when the next census publishes district results.
