# React + Vite

## Terminal Mode

The portfolio has two presentations sharing the same routes and content. First visits use the dashboard. Choose **Terminal Mode** beside the theme selector or in the mobile header to enter the monochrome terminal; **Dashboard Mode** or `exit` returns to the same page with the previous theme preference.

The console starts closed. **Open Terminal** slides a full-width panel up over the page and focuses its inline prompt; command names appear blue and arguments amber. Drag the top edge to resize, or focus the separator and use Up/Down (Shift for larger steps), Home/End, or double-click to reset. The console header stays stationary while output scrolls. **Close** hides the entire panel and restores launcher focus; Escape dismisses suggestions first, then closes the panel. Presentation choice persists in localStorage. History and draft input survive navigation and mode switches; preferred panel height survives closing and navigation. Reload resets the console session, height, and open state. Photos, previews, and page content remain monochrome.

Start with `help`, `ls`, `cd projects`, `cd elecsys`, and `cat readme.txt`. About and Contact use home-page section links; Skills maps to `/tech-stack`. Tab completes, arrow keys select suggestions or browse history, Enter accepts a selected suggestion or runs the command, and Escape dismisses suggestions. Commands simulate a portfolio filesystem and never execute a system shell. `open github`, `open cv`, and approved external targets return clickable links.

Run `npm run build`, `npm run lint`, `npm run typecheck`, and `npm run test` for source checks. Browser checks require Microsoft Edge and a running Vite server. The terminal checks are `npm run test:terminal-behavior` and `npm run test:terminal-visual`; screenshots are written to `output/playwright/terminal/`.

For a server on a custom port, set `DASHBOARD_BASE_URL` for dashboard and terminal checks, `THEME_VISUAL_BASE_URL` for theme checks, and `PROJECT_VISUAL_BASE_URL` for project checks. Each value should include the trailing slash, e.g. `http://127.0.0.1:5180/`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
