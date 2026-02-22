# ATP Tournament Bracket Challenge

Pick ATP winners round-by-round, compete with friends in pools, and track standings live.

## Features
- ATP draw + results scraping from ATP Tour pages.
- Clickable bracket UI with `Pre`, `Live`, and `Completed` modes.
- Scoring that doubles each round: `R32 10 · R16 20 · QF 40 · SF 80 · F 160`.
- Pool-based leaderboard and saved brackets.
- Invite links for pool joins: `/?invite=<code>`.
- Tournament lock behavior:
  - brackets are editable before start
  - locked once tournament starts / results appear
- Admin model:
  - one admin account (`Sathya`) controls pool create/rename/delete + invite visibility
  - other users can join pools and edit only their own bracket
  - browser identity is locked to first chosen name for simplicity

## Local Setup
```bash
cd "/Users/Sathya1/Documents/ATP Tournament Bracket Challenge"
npm install
npm run dev
```

Open: `http://localhost:3000`

## Scripts
- `npm run dev` → start server locally
- `npm start` → production start command (used by hosting platforms like Render)

## Data Storage
- Local JSON file: `server/data.json`
- Includes users, picks, pools, pool members, and admin/device identity mapping.

To reset all app data:
1. Replace `server/data.json` with:
```json
{
  "users": {},
  "picks": {},
  "pools": {},
  "poolMembers": {},
  "meta": {
    "deviceUserMap": {}
  }
}
```

## Deploy (Render)
1. Push repo to GitHub.
2. Create a Render Web Service from the repo.
3. Use:
   - Build command: `npm install`
   - Start command: `npm start`
4. Deploy.

After deploy, invite links automatically use your deployed domain (not localhost), e.g.:
- `https://your-app.onrender.com/?invite=abcd1234`

## Notes
- This app requires a Node backend; static hosting alone (e.g. GitHub Pages by itself) is not enough.
- Tournament list is fetched dynamically from ATP pages, with local fallbacks in code.
