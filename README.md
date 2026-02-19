# ATP Tournament Bracket Challenge (Demo)

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What this demo does
- Scrapes the draw and results from the official ATP Tour draw pages.
- Shows a clickable bracket per tournament with round-by-round picks.
- Provides Pre, Live, and Completed modes.
- Scores picks with 10x standard bracket points (10, 20, 40, 80, 160...).
- Highlights live results in green/red as matches complete.
- Saves brackets per user with an auth-backed leaderboard (local JSON store).

## Demo tournaments
- ATP Hong Kong
- ATP Montpellier
- Brisbane
- Adelaide
- Auckland
- Australian Open

You can add additional tournaments by updating the list in `public/app.js`.
