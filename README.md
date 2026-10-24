# Crosshair Bridge

Převodník crosshairů z CS2, Valorantu, Overwatche 2 a vlastních návrhů na průhledné PNG pro **Kovaak's** a **Aim Lab**.

React 18 + TypeScript + Tailwind CSS 4, sestavené přes Vite.

## Spuštění

Potřebuješ [Node.js](https://nodejs.org) 18 nebo novější.

```bash
npm install
npm run dev
```

Pak otevři adresu, kterou vypíše terminál (obvykle http://localhost:5173).

| Příkaz              | Co dělá                                               |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | vývojový server s okamžitým obnovením                 |
| `npm run build`     | kontrola typů a produkční build do složky `dist/`     |
| `npm run preview`   | spustí hotový build z `dist/`                         |
| `npm test`          | testy parserů kódů a rozložení pixelů (Vitest)        |
| `npm run typecheck` | jen kontrola typů                                     |

Hotový build v `dist/` je potřeba otevírat přes server (`npm run preview` nebo libovolný statický hosting).
Prohlížeč neotevře moduly JavaScriptu dvojklikem přes `file://`. Na rychlé použití bez Node.js slouží
samostatný `index.html` o složku výš.

## Struktura

```
src/
├── main.tsx                  vstupní bod
├── App.tsx                   rozložení stránky a stav aplikace
├── state.ts                  typ stavu, výchozí stav, načtení kódu, oprava uloženého stavu
├── index.css                 Tailwind, barevné tokeny (světlý i tmavý motiv), scény náhledu
├── games/
│   ├── types.ts              GameDef a FieldDef – popis hry a jejích polí
│   └── index.ts              definice CS2, Valorantu, Overwatche 2 a vlastního editoru, rozlišení
├── lib/                      čistá logika bez Reactu
│   ├── types.ts              CrosshairModel a typy hodnot jednotlivých her
│   ├── defaults.ts           výchozí hodnoty a ukázkové kódy
│   ├── cs2Code.ts            dekódování sdílecích kódů CS2 (nové CS…, přechodné i staré CSGO-…)
│   ├── valorantCode.ts       čtení kódů profilu z Valorantu
│   ├── models.ts             převod hodnot her na model v pixelech a zpět do vlastního editoru
│   ├── geometry.ts           rozložení modelu do celých pixelů
│   ├── render.ts             kreslení na canvas, export PNG, stažení souboru
│   └── utils.ts              zaokrouhlení, barvy, formátování
├── hooks/
│   └── usePersistentState.ts stav uložený v localStorage
├── components/
│   ├── ui.tsx                Panel, Button, Chip, Mono
│   ├── Header.tsx
│   ├── GamePicker.tsx        přepínač her
│   ├── CodeInput.tsx         pole pro kód crosshairu
│   ├── ParamsPanel.tsx       formulář parametrů generovaný z definice hry
│   ├── fields/               RangeField, ToggleField, SelectField, ColorField
│   ├── Preview.tsx           náhled na scéně, zvětšení, rozměry
│   ├── ExportPanel.tsx       rozlišení a stažení PNG
│   ├── HowTo.tsx             návod pro Kovaak's a Aim Lab
│   └── GameSupport.tsx       přehled her s kódem a bez kódu
└── test/
    └── codes.test.ts
```

## Přidání další hry

1. V `src/lib/types.ts` přidej typ hodnot hry a rozšiř `GameId`.
2. Výchozí hodnoty dej do `src/lib/defaults.ts` a převod na `CrosshairModel` do `src/lib/models.ts`.
3. Pokud hra má sdílecí kód, napiš parser po vzoru `valorantCode.ts`.
4. V `src/games/index.ts` hru popiš přes `defineGame` (pole formuláře se vygenerují samy) a přidej ji do `GAMES` a `GAME_ORDER`.

## Poznámky k převodu

- **CS2** od 22. 9. 2026 měří crosshair v pixelech a kód nese výšku obrazovky, pro kterou vznikl. Staré kódy
  `CSGO-…` se přepočítávají odhadem (velikost × výška / 480, mezera = 4 + gap), může to vyjít o pixel jinak.
- **Valorant**: přepočet z 1080p na jiné rozlišení je vypínač, ve výchozím stavu vypnutý.
- **Kovaak's** zobrazuje PNG podle svého měřítka crosshairu. Začni na 1.0 a porovnej s náhledem ve skutečné velikosti.
- Formát kódů CS2 podle [akiver/csgo-sharecode](https://github.com/akiver/csgo-sharecode).
