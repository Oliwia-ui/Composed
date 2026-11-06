# Composed

Portfolio of Oliwia Jasionek · digital design and development. *Make it make sense.*

Live: https://oliwia-ui.github.io/Composed/

## Run it

```bash
npm install
npm run dev      # local server with live reload
npm run build    # production build in dist/
```

Pushing to `main` builds the site and publishes it to GitHub Pages (see `.github/workflows/deploy.yml`).

## How it's put together

Every page is its own HTML file:

| Page | File |
| --- | --- |
| Home (the cube) | `index.html` |
| About me | `about.html` |
| Selected work | `work.html` |
| My process | `process.html` |
| Playground | `playground.html` |
| Hello | `contact.html` |
| Case studies | `garmin-sense.html`, `medimate.html`, `spotify-lingo.html`, `moodie.html` |

```
src/
  scss/
    main.scss          imports everything, in cascade order
    abstracts/         tokens, breakpoint mixin
    base/              reset, type, reduced motion
    layout/            fixed chrome, cube pages, standalone pages + page transitions
    components/        the cube, project visuals
    home/              one partial per home scene: hero, intro, vision, work list, deep, contact
    pages/             about, tools, process, playground
    case/              case study layout and each project's theme
  js/
    home.js            entry for index.html
    page.js            entry for the cube pages
    case.js            entry for the case studies
    lib/               shared: text splitting, restless type, GSAP + Lenis, back links
    home/              cube, scroll scenes, work previews, marine snow
    pages/             about modes, tools grid, case study demos
public/img/            images, copied as they are
```

Built with Vite, SCSS, GSAP (ScrollTrigger) and Lenis. Page-to-page transitions use the View Transitions API where the browser supports it.
