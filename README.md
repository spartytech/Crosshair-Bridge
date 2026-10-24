# Crosshair Bridge

Two tools for moving your setup between games and aim trainers:

- **Crosshair** converts crosshairs from CS2, Valorant, Overwatch 2 and your own designs into transparent PNGs for **Kovaak's** and **Aim Lab**.
- **Sensitivity** (`#citlivost`) converts mouse sensitivity between CS2, Valorant, Overwatch 2, Apex Legends, Call of Duty,
  Rainbow Six Siege and Fortnite, shows cm/360 and can recalculate for a new DPI.

Built with React 18, TypeScript and Tailwind CSS 4, bundled with Vite. The app's interface is in Czech.

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address printed in the terminal (usually http://localhost:5173).

| Command             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | development server with hot reload                      |
| `npm run build`     | type check and production build into `dist/`            |
| `npm run preview`   | serves the finished build from `dist/`                  |
| `npm test`          | tests for the code parsers and pixel layout (Vitest)    |
| `npm run typecheck` | type check only                                         |

The build in `dist/` has to be served over HTTP (`npm run preview` or any static hosting).
Browsers won't load JavaScript modules from a page opened by double-clicking it (`file://`).

## Project structure

```
src/
├── main.tsx                  entry point
├── App.tsx                   switches between the two tools by URL hash
├── state.ts                  crosshair state: type, default state, code loading, repair of saved state
├── sensState.ts              sensitivity state and repair of saved state
├── pages/
│   ├── CrosshairPage.tsx     crosshair converter layout and state
│   └── SensPage.tsx          sensitivity converter
├── index.css                 Tailwind, color tokens (light and dark theme), preview scenes
├── games/
│   ├── types.ts              GameDef and FieldDef: description of a game and its fields
│   └── index.ts              definitions for CS2, Valorant, Overwatch 2 and the custom editor, resolutions
├── lib/                      pure logic, no React
│   ├── types.ts              CrosshairModel and per-game value types
│   ├── defaults.ts           default values and sample codes
│   ├── cs2Code.ts            CS2 share code decoding (new CS…, transitional and legacy CSGO-…)
│   ├── valorantCode.ts       Valorant profile code parsing
│   ├── models.ts             conversion of game values to a pixel model and back to the custom editor
│   ├── geometry.ts           layout of the model on whole pixels
│   ├── render.ts             canvas drawing, PNG export, file download
│   ├── sens.ts               sensitivity yaw values, conversion and cm/360
│   └── utils.ts              rounding, colors, formatting
├── hooks/
│   └── usePersistentState.ts state persisted in localStorage
├── components/
│   ├── ui.tsx                Panel, Button, Chip, Mono
│   ├── Header.tsx            title and tool switcher
│   ├── GamePicker.tsx        game switcher
│   ├── CodeInput.tsx         crosshair code input
│   ├── ParamsPanel.tsx       parameter form generated from the game definition
│   ├── fields/               RangeField, ToggleField, SelectField, ColorField, NumberField
│   ├── Preview.tsx           preview on a scene, zoom, dimensions
│   ├── ExportPanel.tsx       resolution and PNG download
│   ├── HowTo.tsx             instructions for Kovaak's and Aim Lab
│   └── GameSupport.tsx       overview of games with and without share codes
└── test/
    ├── codes.test.ts
    └── sens.test.ts
```

## Adding another game

1. In `src/lib/types.ts`, add a value type for the game and extend `GameId`.
2. Put the default values in `src/lib/defaults.ts` and the conversion to `CrosshairModel` in `src/lib/models.ts`.
3. If the game has a share code, write a parser modeled on `valorantCode.ts`.
4. In `src/games/index.ts`, describe the game with `defineGame` (form fields are generated automatically) and add it to `GAMES` and `GAME_ORDER`.

## Conversion notes

- **CS2**: since 22 Sep 2026, crosshair sizes are measured in pixels and the code includes the screen height it was made for.
  Legacy `CSGO-…` codes are converted by estimate (size × height / 480, gap = 4 + gap), so the result may be off by a pixel.
- **Valorant**: rescaling from 1080p to another resolution is a toggle and is off by default.
- **Kovaak's** displays the PNG according to its own crosshair scale setting. Start at 1.0 and compare with the real-size preview.
- CS2 code format based on [akiver/csgo-sharecode](https://github.com/akiver/csgo-sharecode).

## Sensitivity notes

- Conversion keeps the same distance per 360° turn, so it applies to hipfire only. ADS and scoped sensitivity are not converted.
- Yaw values (degrees per mouse count at sensitivity 1): CS2 and Apex 0.022, Valorant 0.07, Overwatch 2 and Call of Duty 0.0066,
  Rainbow Six Siege 0.00572957795 (default `MouseSensitivityMultiplierUnit` 0.02), Fortnite 0.005555 per percent.
- To add a game, add its yaw to `SENS_GAMES` and `SENS_ORDER` in `src/lib/sens.ts`.
