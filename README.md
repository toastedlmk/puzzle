# The Afterword

An original, self-contained browser riddle in 100 entries, inspired by the observation, source inspection, and decoding puzzles in the supplied video. The puzzles and visual identity are original, rather than a copy of the referenced game.

## Run locally

Requires Node.js 20.19+ or 22.12+ (Node 24 is supported).

```sh
npm ci
npm run dev
```

The development server listens on port 3000. In the managed cloud workspace, use `npm ci --cache /tmp/afterword-npm-cache` if the default npm cache directory is not writable.

```sh
npm run build       # Production files in dist/
npm run preview     # Serve the production build on port 3000
npm test            # Engine, decoding, and puzzle-integrity checks
npm run test:e2e    # Browser flows, complete 100-entry run, and responsive checks
```

Browser checks use the installed `/usr/bin/chromium` when available. Else run `npx playwright install chromium`, or set `CHROMIUM_PATH` to your browser executable. The test runner starts the development server automatically when needed.

## Publish on GitHub Pages

The repository includes `.github/workflows/pages.yml`. It installs the locked dependencies, tests the game, builds the site, and deploys `dist/` whenever `main` changes. Relative asset paths support the `/puzzle/` repository URL.

For the first deployment:

1. In `toastedlmk/puzzle`, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions → Deploy to GitHub Pages → Run workflow**, choose `main`, and run it. If a deployment already started, rerun it after enabling Pages.

After the deployment succeeds, the site will be available at **https://toastedlmk.github.io/puzzle/**. The workflow's deployment environment also shows the published URL. Future pushes to `main` update the same site automatically. A private repository needs a GitHub plan that supports Pages for private repositories.

## Open without a server

Run `npm run build:standalone` to generate `dist/the-afterword.html`. Download that single file and open it in a modern browser. It contains all JavaScript, fonts, and illustrations, with no network requirements. The offline edition displays an entry address above the game so address-based clues still work without changing a local file's URL. Browser storage policies determine whether progress can persist when opening local files; an in-game warning appears if storage is unavailable.

The regular development server runs inside the cloud workspace. Its `localhost:3000` address is not accessible from another computer unless that computer runs the app locally or the cloud port is explicitly forwarded.

## The game

- Five chapters of twenty sequential entries: observation, decoding, page inspection, logic and code, then layered connections.
- Three progressive hints for every entry; the third explicitly reveals its answer.
- Per-entry notes, completed answers, and progress persist in this browser's local storage. The site warns when storage is unavailable. Clearing browser data clears the save; there is no cross-device sync.
- The built-in inspector exposes the current clue's real markup, accessible image descriptions, styles, tab title, and address. No browser developer tools are required on mobile.
- The decoder desk provides 32 translations: Morse in both directions; adjustable alphabet rotation and ROT13; Atbash; keyed Vigenère; five-bit/Bacon; Polybius; two-rail fence; NATO phonetics; binary, hexadecimal, decimal, and octal bytes; alphabet positions; Roman numerals; Base64; URL encoding; common HTML entities; and reversal. Common encodings work in both directions and support UTF-8 text. The translator never evaluates submitted JavaScript.
- **Copy text** copies the displayed puzzle text, including spaced number sequences and code snippets. Translation results have **Copy result** and **Use as answer** buttons. Copying falls back to selected text when browser clipboard access is unavailable.
- Search the translators by name or category. Matching ignores capitalization and accents, so typing `vigenere` finds Vigenère. Clearing the search restores the complete list.
- Revisit unlocked entries through the index. Resetting progress requires a separate explicit confirmation.
- Right-click a chapter in the contents or index tabs for a quick list of its unlocked questions. The chapter-name dropdown above each question opens the same menu on touch screens. Arrow keys, Home/End, Shift+F10, Escape, and outside clicks work with the menu; locked questions remain locked.
- Every entry has a **Redo question** button. It clears the answer, revealed hints, and interactive state for a fresh attempt while preserving field notes, solved entries, and unlocked chapters. Replaying a completed entry hides its solution and saves the retry across reloads; solving it again does not increase the completed count or change the original attempt statistics.
- All fonts and clues are served locally. There are no analytics, accounts, or external service requirements.

## Structure

- `src/puzzles.js`: original clues, answers, hints, explanations, and chapter metadata.
- `src/engine.js`: validation, normalization, sequential unlocking, URL clues, and resilient save loading.
- `src/decoder.js`: bounded text translation tools.
- `src/translation-methods.js`: grouped translator labels, examples, and input guidance.
- `src/main.js`: accessible game interface, notebook, index, dialogs, and persistence.
- `src/chapter-menu.js`: chapter context menus and keyboard/touch navigation.
- `src/style.css`: responsive visual design and reduced-motion support.
- `scripts/export-standalone.mjs`: packages the built site, fonts, illustration, and font licenses into one downloadable HTML file.

This is a casual client-side riddle, not a competition platform. Answers are included in the client bundle and can be found by inspecting the application code. Deploy `dist/` to any static host to share it publicly; no backend, credentials, or environment variables are needed.
