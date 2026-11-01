# Sploit's PS Store

An English-language, static game and homebrew catalogue website.

## GitHub Pages deployment

1. Upload the contents of this project folder to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your publishing branch (usually `main`) and the `/ (root)` folder.
5. Save and wait for GitHub Pages to publish the site.

Open the published site using the URL shown in the Pages settings.

## Project structure

- `index.html` — homepage and catalogue shelves.
- `loja.html` — category and platform catalogue.
- `detalhes/` — item details page and its assets.
- `data/` — catalogue data used by the website.
- `fpkgi/` — JSON catalogue data used by the FPKGi integration.
- `*.js` and `*.css` — site behaviour and styling.

## Important notes

- Keep the folder structure intact; the site loads data and scripts using relative paths.
- The project is static and does not require a server-side runtime.
- Download links may point to third-party sources. This project does not host those files.
- Only add or distribute content that you have the right to share.
