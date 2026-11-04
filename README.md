# WAVEN

Static GitHub Pages site. `index.html` links to the aroma and enneagram pages.
GitHub Actions copies `Enneagram` to `enneagram.html` and publishes only the HTML
pages and `assets/`, not the build sources or node_modules.

## Build

Use Node.js 24, then `npm ci --ignore-scripts` and `npm run build`.
Commit updated assets together with sources. React / React DOM are 18.3.1;
Tailwind's vendored browser runtime is 3.4.17. Font versions and build tools are
pinned in package-lock.json. Third-party licenses are stored beside the assets.
SHA256SUMS.json records vendored JavaScript hashes. Rebuilding uses local packages
and does not download executable browser dependencies.

The editable compiled JavaScript is in scripts/source/. Unicode escapes and
minification reduce casual readability; they are NOT encryption or access control.
All displayed content is recoverable by visitors. Previous public Git commits
still contain the old sources. Do not store secrets or private content here.

There are no external library/font requests at runtime. The LINE link only opens
when clicked. Tailwind still generates styles locally in the browser to preserve
the existing dynamically constructed classes.
