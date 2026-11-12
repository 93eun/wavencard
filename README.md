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

## Fair card selection

Both pages use Fisher–Yates shuffling with Web Crypto and rejection sampling
for unbiased integer indices. Cards have no weights, and each reading samples
without replacement. Past readings do not influence the next reading.

Run `npm run check:randomness` to verify distinct card IDs, rejection boundaries,
and all 362,880 possible nine-card shuffle paths. Every card must occur exactly
40,320 times in each slot. The nine-card deck gives each card a 2/9 chance of
inclusion in a two-card reading and 3/9 in a three-card reading. Equal probability
does not require equal observed counts over a small number of actual readings.
