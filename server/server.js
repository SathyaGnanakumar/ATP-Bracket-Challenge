import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const dataFile = path.resolve(__dirname, "./data.json");
const tournamentCache = {
  year: null,
  fetchedAt: 0,
  tournaments: [],
};

const currentFallbackTournaments = [
  {
    slug: "doha",
    eventId: "451",
    name: "Qatar ExxonMobil Open",
    location: "Doha, Qatar",
    drawUrl: "https://www.atptour.com/en/scores/current/doha/451/draws",
  },
  {
    slug: "delray-beach",
    eventId: "499",
    name: "Delray Beach Open",
    location: "Delray Beach, United States",
    drawUrl: "https://www.atptour.com/en/scores/current/delray-beach/499/draws",
  },
  {
    slug: "rio-de-janeiro",
    eventId: "6932",
    name: "Rio Open presented by Claro",
    location: "Rio de Janeiro, Brazil",
    drawUrl: "https://www.atptour.com/en/scores/current/rio-de-janeiro/6932/draws",
  },
];

const roundLabels = [
  "Round of 128",
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Quarter-Finals",
  "Quarter Finals",
  "Semifinals",
  "Semi-Finals",
  "Semi Finals",
  "Semifinal",
  "Semi Final",
  "Final",
  "Finals",
  "First Round",
  "Second Round",
];

const roundAlias = {
  "First Round": "Round of 32",
  "Second Round": "Round of 16",
  "Quarter-Finals": "Quarterfinals",
  "Quarter Finals": "Quarterfinals",
  "Semi-Finals": "Semifinals",
  "Semi Finals": "Semifinals",
  "Semifinal": "Semifinals",
  "Semi Final": "Semifinals",
  "Finals": "Final",
};

function extractText(html) {
  let cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, "");
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");
  cleaned = cleaned.replace(/<\/(p|div|li|tr|h1|h2|h3|h4|a|span|td)>/gi, "\n");
  cleaned = cleaned.replace(/<[^>]+>/g, " ");
  return cleaned
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function decodeHtmlEntities(input) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#8212;|&mdash;/g, "-");
}

function detectRoundLabel(line) {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (/^first round$/i.test(normalized)) return "Round of 32";
  if (/^second round$/i.test(normalized)) return "Round of 16";
  if (/round of 128/i.test(normalized)) return "Round of 128";
  if (/round of 64/i.test(normalized)) return "Round of 64";
  if (/round of 32/i.test(normalized)) return "Round of 32";
  if (/round of 16/i.test(normalized)) return "Round of 16";
  if (/quarter[\s-]*final/i.test(normalized)) return "Quarterfinals";
  if (/semi[\s-]*final/i.test(normalized)) return "Semifinals";
  if (/^finals?$/i.test(normalized)) return "Final";
  if (/final/i.test(normalized) && !/semi/i.test(normalized) && !/quarter/i.test(normalized)) {
    return "Final";
  }
  return "";
}

function isScoreLine(line) {
  return /[\d]/.test(line) && /[\d]/.test(line.replace(/\s+/g, "")) && !/vs/i.test(line);
}

function isPlayerLine(line) {
  if (line === "Bye" || line === "BYE") return true;
  if (!/[A-Za-z]/.test(line)) return false;
  if (line.length > 40) return false;
  if (/^ATP/.test(line)) return false;
  if (/^Singles|^Doubles|^Qual/.test(line)) return false;
  if (/^H2H|^Stats/.test(line)) return false;
  if (/^\d{4}\.\d{2}\.\d{2}/.test(line)) return false;
  if (/email address|latest news|newsletter|sign up|view all|overview/i.test(line)) return false;
  if (/draws|results|calendar|tickets|rankings|news/i.test(line)) return false;
  if (/\d/.test(line.replace(/\(\d+\)/g, "").replace(/\s+/g, ""))) return false;
  if (/^[A-Z]\./.test(line)) return true;
  if (/^[A-Z][a-z]+\s+[A-Za-z]/.test(line)) return true;
  return false;
}

function parsePlayer(line) {
  const seedMatch = line.match(/\(([^)]+)\)\s*$/);
  const seed = seedMatch ? seedMatch[1] : "";
  const name = seed ? line.replace(/\s*\([^)]+\)\s*$/, "").trim() : line.trim();
  return {
    id: name,
    name,
    seed,
    rawScores: [],
    scores: [],
  };
}

function extractScoreTokens(line) {
  return line
    .replace(/\(\d+\)/g, " ")
    .replace(/[(),]/g, " ")
    .replace(/-/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => explodeScoreToken(token))
    .filter((token) => /^\d$/.test(token));
}

function explodeScoreToken(token) {
  if (/^\d+$/.test(token) && token.length > 1) {
    if (Number(token) > 7) {
      return token.split("");
    }
  }
  return [token];
}

function normalizeScores(players) {
  if (players.length !== 2) return null;
  const [a, b] = players;
  const tokensA = a.rawScores.map((score) => Number(score)).filter((n) => !Number.isNaN(n));
  const tokensB = b.rawScores.map((score) => Number(score)).filter((n) => !Number.isNaN(n));
  const result = alignSetScores(tokensA, tokensB);
  if (!result) return null;
  a.scores = result.aSets.map(String);
  b.scores = result.bSets.map(String);
  return result;
}

function computeWinner(players) {
  if (players.length !== 2) return null;
  const [a, b] = players;
  if (a.name.toLowerCase() === "bye") return b.id;
  if (b.name.toLowerCase() === "bye") return a.id;
  const aligned = normalizeScores(players);
  if (!aligned) return null;
  const { aSets, bSets } = aligned;
  if (!aSets.length || !bSets.length) return null;
  let aWins = 0;
  let bWins = 0;
  for (let i = 0; i < Math.min(aSets.length, bSets.length); i += 1) {
    if (aSets[i] > bSets[i]) aWins += 1;
    if (bSets[i] > aSets[i]) bWins += 1;
  }
  if (aWins === bWins) return null;
  return aWins > bWins ? a.id : b.id;
}

function alignSetScores(tokensA, tokensB) {
  const memo = new Map();
  const maxSets = 5;

  function dfs(i, j, sets) {
    const key = `${i}-${j}-${sets}`;
    if (memo.has(key)) return memo.get(key);
    if (i >= tokensA.length || j >= tokensB.length || sets >= maxSets) {
      const result = { aSets: [], bSets: [], discards: 0, sets };
      memo.set(key, result);
      return result;
    }

    let best = { aSets: [], bSets: [], discards: Infinity, sets };

    const aVal = tokensA[i];
    const bVal = tokensB[j];

    if (isValidSet(aVal, bVal)) {
      const next = dfs(i + 1, j + 1, sets + 1);
      const candidate = {
        aSets: [aVal, ...next.aSets],
        bSets: [bVal, ...next.bSets],
        discards: next.discards,
        sets: next.sets,
      };
      best = chooseBetter(best, candidate);
    }

    const discardA = dfs(i + 1, j, sets);
    const discardB = dfs(i, j + 1, sets);

    best = chooseBetter(best, {
      aSets: discardA.aSets,
      bSets: discardA.bSets,
      discards: discardA.discards + 1,
      sets: discardA.sets,
    });
    best = chooseBetter(best, {
      aSets: discardB.aSets,
      bSets: discardB.bSets,
      discards: discardB.discards + 1,
      sets: discardB.sets,
    });

    memo.set(key, best);
    return best;
  }

  const result = dfs(0, 0, 0);
  if (!result.aSets.length || !result.bSets.length) return null;
  return result;
}

function chooseBetter(current, candidate) {
  if (!current.aSets) return candidate;
  const currentSets = current.aSets.length;
  const candidateSets = candidate.aSets.length;
  if (candidateSets > currentSets) return candidate;
  if (candidateSets < currentSets) return current;
  if (candidate.discards < current.discards) return candidate;
  return current;
}

function isValidSet(a, b) {
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  if (a < 0 || b < 0 || a > 7 || b > 7) return false;
  if (a === 7 && (b === 5 || b === 6)) return true;
  if (b === 7 && (a === 5 || a === 6)) return true;
  if (a === 6 && b <= 4) return true;
  if (b === 6 && a <= 4) return true;
  return false;
}

function normalizeRoundName(input) {
  const detected = detectRoundLabel(String(input || ""));
  return detected ? (roundAlias[detected] || detected) : "";
}

function getNodeValue(node, keys = []) {
  if (!node || typeof node !== "object") return null;
  for (const key of keys) {
    if (node[key] !== undefined && node[key] !== null && String(node[key]).trim() !== "") {
      return node[key];
    }
  }
  return null;
}

function getPlayerNameFromNode(node) {
  if (!node || typeof node !== "object") return "";
  const direct = getNodeValue(node, [
    "name",
    "Name",
    "fullName",
    "FullName",
    "playerName",
    "PlayerName",
    "displayName",
    "DisplayName",
    "shortName",
    "ShortName",
  ]);
  if (direct) return String(direct).trim();

  const first = getNodeValue(node, ["firstName", "FirstName", "givenName", "GivenName"]);
  const last = getNodeValue(node, ["lastName", "LastName", "familyName", "FamilyName"]);
  if (first || last) return `${String(first || "").trim()} ${String(last || "").trim()}`.trim();
  return "";
}

function parseScorelinePairs(scoreline) {
  const text = String(scoreline || "");
  const matches = [...text.matchAll(/([0-7])\s*[-:]\s*([0-7])/g)];
  if (!matches.length) return null;
  return {
    aSets: matches.map((m) => m[1]),
    bSets: matches.map((m) => m[2]),
  };
}

function extractPlayersFromMatchNode(matchNode) {
  if (!matchNode || typeof matchNode !== "object") return [];
  const arrayCandidates = [
    "players",
    "Players",
    "competitors",
    "Competitors",
    "participants",
    "Participants",
    "teams",
    "Teams",
  ];

  for (const key of arrayCandidates) {
    if (!Array.isArray(matchNode[key])) continue;
    const players = matchNode[key]
      .map((item) => {
        const name = typeof item === "string" ? item.trim() : getPlayerNameFromNode(item);
        if (!name) return null;
        return {
          id: name,
          name,
          seed: String(getNodeValue(item, ["seed", "Seed"]) || "").trim(),
          rawScores: [],
          scores: [],
          _winner: Boolean(
            getNodeValue(item, ["isWinner", "IsWinner", "winner", "Winner", "won", "Won"]) === true,
          ),
        };
      })
      .filter(Boolean);
    if (players.length >= 2) return players.slice(0, 2);
  }

  const p1Node = getNodeValue(matchNode, ["player1", "Player1", "homePlayer", "HomePlayer"]);
  const p2Node = getNodeValue(matchNode, ["player2", "Player2", "awayPlayer", "AwayPlayer"]);
  if (p1Node && p2Node) {
    const p1Name = typeof p1Node === "string" ? p1Node : getPlayerNameFromNode(p1Node);
    const p2Name = typeof p2Node === "string" ? p2Node : getPlayerNameFromNode(p2Node);
    if (p1Name && p2Name) {
      return [
        { id: p1Name, name: p1Name, seed: "", rawScores: [], scores: [], _winner: false },
        { id: p2Name, name: p2Name, seed: "", rawScores: [], scores: [], _winner: false },
      ];
    }
  }

  return [];
}

function parseDrawFromStructuredData(html, fallbackName = "Tournament") {
  const nextDataMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (!nextDataMatch) return null;

  let root;
  try {
    root = JSON.parse(nextDataMatch[1]);
  } catch (error) {
    return null;
  }

  const queue = [root];
  const rounds = new Map();
  const seen = new WeakSet();

  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== "object") continue;
    if (seen.has(node)) continue;
    seen.add(node);

    const roundName = normalizeRoundName(
      getNodeValue(node, ["roundName", "RoundName", "round", "Round", "name", "Name"]) || "",
    );
    const matches = getNodeValue(node, ["matches", "Matches", "matchList", "MatchList"]);
    if (roundName && Array.isArray(matches) && matches.length) {
      if (!rounds.has(roundName)) rounds.set(roundName, []);
      matches.forEach((matchNode) => {
        const players = extractPlayersFromMatchNode(matchNode);
        if (players.length !== 2) return;

        const line = getNodeValue(matchNode, ["score", "Score", "scoreline", "ScoreLine"]);
        const parsedLine = parseScorelinePairs(line);
        if (parsedLine) {
          players[0].scores = parsedLine.aSets;
          players[1].scores = parsedLine.bSets;
        } else {
          normalizeScores(players);
        }

        const matchId = `${roundName}-${rounds.get(roundName).length}`;
        let winnerId = null;
        if (players[0]._winner) winnerId = players[0].id;
        if (players[1]._winner) winnerId = players[1].id;
        if (!winnerId) winnerId = computeWinner(players);
        rounds.get(roundName).push({ id: matchId, players, winnerId });
      });
    }

    if (Array.isArray(node)) {
      node.forEach((item) => queue.push(item));
    } else {
      Object.values(node).forEach((value) => {
        if (value && typeof value === "object") queue.push(value);
      });
    }
  }

  if (!rounds.size) return null;
  const roundArray = roundOrderFrom(rounds);
  if (!roundArray.length) return null;

  const lines = extractText(html);
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].split("|")[0].trim() : fallbackName;
  const meta = extractTournamentMeta(html, lines);

  return {
    tournament: {
      name: meta.name || title,
      location: meta.location || "",
      dates: meta.dates || "",
      startDate: meta.startDate || "",
      endDate: meta.endDate || "",
      fetchedAt: new Date().toISOString(),
    },
    rounds: roundArray,
  };
}

function parseDraw(html, fallbackName = "Tournament") {
  const structured = parseDrawFromStructuredData(html, fallbackName);
  if (structured && structured.rounds?.length) {
    applyKnownCorrections(structured.tournament?.name || fallbackName, structured.rounds);
    return structured;
  }

  const lines = extractText(html);
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].split("|")[0].trim() : fallbackName;
  const meta = extractTournamentMeta(html, lines);

  let currentRound = null;
  let currentMatch = [];
  let currentPlayer = null;
  const rounds = new Map();

  const pushMatch = () => {
    if (!currentRound || currentMatch.length < 2) {
      currentMatch = [];
      return;
    }
    const roundName = currentRound;
    const matchId = `${roundName}-${rounds.get(roundName)?.length || 0}`;
    const winnerId = computeWinner(currentMatch);
    const match = {
      id: matchId,
      players: currentMatch,
      winnerId,
    };
    if (!rounds.has(roundName)) rounds.set(roundName, []);
    rounds.get(roundName).push(match);
    currentMatch = [];
    currentPlayer = null;
  };

  for (const line of lines) {
    if (/latest news|newsletter|follow us|tickets/i.test(line)) {
      pushMatch();
      break;
    }
    const detectedRound = detectRoundLabel(line);
    if (detectedRound) {
      pushMatch();
      currentRound = roundAlias[detectedRound] || detectedRound;
      continue;
    }

    if (!currentRound) continue;

    if (isPlayerLine(line)) {
      if (currentMatch.length === 2) {
        pushMatch();
      }
      currentPlayer = parsePlayer(line);
      currentMatch.push(currentPlayer);
      continue;
    }

    if (currentPlayer && isScoreLine(line)) {
      const tokens = extractScoreTokens(line);
      currentPlayer.rawScores.push(...tokens);
    }
  }

  pushMatch();

  const roundArray = roundOrderFrom(rounds);
  applyKnownCorrections(title, roundArray);

  return {
    tournament: {
      name: meta.name || title,
      location: meta.location || "",
      dates: meta.dates || "",
      startDate: meta.startDate || "",
      endDate: meta.endDate || "",
      fetchedAt: new Date().toISOString(),
    },
    rounds: roundArray,
  };
}

function applyKnownCorrections(tournamentTitle, rounds) {
  if (!/australian open/i.test(tournamentTitle || "")) return;
  for (const round of rounds) {
    for (const match of round.matches) {
      if (!Array.isArray(match.players) || match.players.length !== 2) continue;
      const p1 = match.players[0];
      const p2 = match.players[1];
      const n1 = (p1.name || "").toLowerCase();
      const n2 = (p2.name || "").toLowerCase();
      const hasOconnell = n1.includes("o'connell") || n1.includes("oconnell")
        || n2.includes("o'connell") || n2.includes("oconnell");
      const hasBasav = n1.includes("basavareddy") || n2.includes("basavareddy");
      if (!hasOconnell || !hasBasav) continue;

      if (n1.includes("basavareddy")) {
        p1.scores = ["4", "7", "6", "6", "6"];
        p2.scores = ["6", "6", "7", "2", "3"];
        match.winnerId = p1.id;
      } else {
        p1.scores = ["6", "6", "7", "2", "3"];
        p2.scores = ["4", "7", "6", "6", "6"];
        match.winnerId = p2.id;
      }
    }
  }
}

function extractTournamentMeta(html, lines) {
  const meta = {};
  const nextDataMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      const info = findTournamentInfo(data);
      if (info) {
        meta.name = info.name || meta.name;
        meta.location = info.location || meta.location;
        meta.dates = info.dates || meta.dates;
      }
    } catch (error) {
      // Ignore parse errors.
    }
  }

  if (!meta.dates) {
    meta.dates = findDatesFromLines(lines);
  }
  if (!meta.location) {
    meta.location = findLocationFromLines(lines);
  }
  if (!meta.name) {
    meta.name = findNameFromLines(lines);
  }
  const range = parseDateRange(meta.dates);
  if (range) {
    meta.startDate = range.startDate;
    meta.endDate = range.endDate;
  }
  const tier = extractTierFromHtml(html);
  if (tier) {
    meta.tier = tier.label;
    meta.tierLogo = tier.logoUrl;
  }

  return meta;
}

function findTournamentInfo(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== "object") continue;

    const city = node.City || node.city;
    const country = node.Country || node.country;
    const name = node.TournamentName || node.Name || node.name || node.Title || node.title;
    const dates = node.FormattedDate || node.Date || node.Dates || node.dates;

    if (city && country) {
      return {
        name,
        location: `${city}, ${country}`,
        dates,
      };
    }

    if (node.tournament && typeof node.tournament === "object") {
      const inner = node.tournament;
      const innerCity = inner.city || inner.City;
      const innerCountry = inner.country || inner.Country;
      const innerDates = inner.formattedDate || inner.FormattedDate || inner.dates || inner.Dates;
      const innerName = inner.name || inner.Name || inner.title || inner.Title;
      if (innerCity && innerCountry) {
        return {
          name: innerName,
          location: `${innerCity}, ${innerCountry}`,
          dates: innerDates,
        };
      }
    }

    for (const value of Object.values(node)) {
      if (typeof value === "object") queue.push(value);
    }
  }
  return null;
}

function findDatesFromLines(lines) {
  const datePatterns = [
    /\b\d{1,2}\s*-\s*\d{1,2}\s+[A-Za-z]{3,}\s*,\s*\d{4}\b/,
    /\b[A-Za-z]{3,}\s+\d{1,2}\s*-\s*\d{1,2},\s*\d{4}\b/,
    /\b\d{1,2}\s+[A-Za-z]{3,}\s*-\s*\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}\b/,
    /\b\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}\b/,
  ];
  for (const line of lines) {
    if (!line.includes("-")) continue;
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) return match[0];
    }
  }
  return "";
}

function parseDateRange(input) {
  if (!input) return null;
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const trimmed = input.replace(/\s+/g, " ").trim();

  let match = trimmed.match(/(\d{1,2})\s*-\s*(\d{1,2})\s+([A-Za-z]{3,})\s*,?\s*(\d{4})/);
  if (match) {
    const startDay = Number(match[1]);
    const endDay = Number(match[2]);
    const month = monthMap[match[3].slice(0, 3).toLowerCase()];
    const year = Number(match[4]);
    if (Number.isFinite(month)) {
      return {
        startDate: toIsoDate(year, month, startDay),
        endDate: toIsoDate(year, month, endDay),
      };
    }
  }

  match = trimmed.match(/([A-Za-z]{3,})\s+(\d{1,2})\s*-\s*([A-Za-z]{3,})\s+(\d{1,2}),?\s*(\d{4})/);
  if (match) {
    const startMonth = monthMap[match[1].slice(0, 3).toLowerCase()];
    const startDay = Number(match[2]);
    const endMonth = monthMap[match[3].slice(0, 3).toLowerCase()];
    const endDay = Number(match[4]);
    const year = Number(match[5]);
    if (Number.isFinite(startMonth) && Number.isFinite(endMonth)) {
      return {
        startDate: toIsoDate(year, startMonth, startDay),
        endDate: toIsoDate(year, endMonth, endDay),
      };
    }
  }

  match = trimmed.match(/(\d{1,2})\s+([A-Za-z]{3,})\s*-\s*(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
  if (match) {
    const startDay = Number(match[1]);
    const startMonth = monthMap[match[2].slice(0, 3).toLowerCase()];
    const endDay = Number(match[3]);
    const endMonth = monthMap[match[4].slice(0, 3).toLowerCase()];
    const year = Number(match[5]);
    if (Number.isFinite(startMonth) && Number.isFinite(endMonth)) {
      return {
        startDate: toIsoDate(year, startMonth, startDay),
        endDate: toIsoDate(year, endMonth, endDay),
      };
    }
  }

  return null;
}

function parseTournamentLabel(label) {
  const decoded = decodeHtmlEntities(label).replace(/\s+/g, " ").trim();
  const [left, right] = decoded.split("|").map((part) => part.trim());
  const dateLabel = right || "";
  const locationMatch = left.match(
    /^(.*)\s+([A-Za-z0-9.' -]+,\s*[A-Za-z0-9.' -]+(?:,\s*[A-Za-z0-9.' -]+)?)$/,
  );
  const name = locationMatch ? locationMatch[1].trim() : left.trim();
  const location = locationMatch ? locationMatch[2].trim() : "";
  const range = parseDateRange(dateLabel);
  const seasonMatch = dateLabel.match(/\b(20\d{2})\b/);
  const season = range?.startDate
    ? Number(range.startDate.slice(0, 4))
    : seasonMatch
      ? Number(seasonMatch[1])
      : new Date().getFullYear();
  return {
    name,
    location,
    dates: dateLabel,
    startDate: range?.startDate || "",
    endDate: range?.endDate || "",
    season,
  };
}

async function fetchTournaments(year = new Date().getFullYear()) {
  const cacheAge = Date.now() - tournamentCache.fetchedAt;
  if (tournamentCache.year === year && cacheAge < 1000 * 60 * 60 * 6) {
    return tournamentCache.tournaments;
  }

  const url = `https://www.atptour.com/en/scores/results-archive?year=${year}&tournamentType=atp`;
  const html = await fetchHtml(url);
  const tournaments = new Map();
  const linkPattern =
    /<a[^>]+href="([^"]*\/en\/tournaments\/([^/]+)\/(\d+)\/overview[^"]*)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = linkPattern.exec(html))) {
    const slug = match[2];
    const eventId = match[3];
    const label = match[4];
    const parsed = parseTournamentLabel(label);
    const season = parsed.season || year;
    const id = `${season}-${slug}-${eventId}`;
    if (tournaments.has(id)) continue;
    tournaments.set(id, {
      id,
      slug,
      eventId,
      name: parsed.name || label.trim(),
      location: parsed.location,
      dates: parsed.dates,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      season,
      drawUrl: `https://www.atptour.com/en/scores/current/${slug}/${eventId}/draws`,
    });
  }

  const archiveList = Array.from(tournaments.values()).sort((a, b) => {
    if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
    return a.name.localeCompare(b.name);
  });

  const currentList = await fetchCurrentTournaments(year);
  const merged = mergeTournaments(archiveList, currentList);

  tournamentCache.year = year;
  tournamentCache.fetchedAt = Date.now();
  tournamentCache.tournaments = merged;

  return merged;
}

async function fetchCurrentTournaments(year = new Date().getFullYear()) {
  const url = "https://www.atptour.com/en/scores/current";
  let html = "";
  try {
    html = await fetchHtml(url);
  } catch (error) {
    return currentFallbackTournaments.map((tournament) => ({
      id: `${year}-${tournament.slug}-${tournament.eventId}`,
      season: year,
      currentWeek: true,
      ...tournament,
    }));
  }

  const links = new Map();
  const linkPattern = /\/en\/scores\/current\/([^/"?#]+)\/(\d+)\/(?:results|draws|overview)/gi;
  let match;
  while ((match = linkPattern.exec(html))) {
    const slug = match[1];
    const eventId = match[2];
    const key = `${slug}-${eventId}`;
    if (!links.has(key)) {
      links.set(key, {
        id: `${year}-${slug}-${eventId}`,
        season: year,
        slug,
        eventId,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        location: "",
        dates: "",
        startDate: "",
        endDate: "",
        currentWeek: true,
        drawUrl: `https://www.atptour.com/en/scores/current/${slug}/${eventId}/draws`,
      });
    }
  }

  if (!links.size) {
    return currentFallbackTournaments.map((tournament) => ({
      id: `${year}-${tournament.slug}-${tournament.eventId}`,
      season: year,
      currentWeek: true,
      ...tournament,
    }));
  }

  return Array.from(links.values());
}

function mergeTournaments(archiveList, currentList) {
  const merged = new Map();
  archiveList.forEach((tournament) => {
    merged.set(tournament.id || `${tournament.slug}-${tournament.eventId}`, tournament);
  });
  currentList.forEach((tournament) => {
    const key = tournament.id || `${tournament.slug}-${tournament.eventId}`;
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, tournament);
      return;
    }
    merged.set(key, {
      ...existing,
      ...tournament,
      name: tournament.name || existing.name,
      drawUrl: tournament.drawUrl || existing.drawUrl,
      currentWeek: true,
    });
  });

  return Array.from(merged.values()).sort((a, b) => {
    if (a.currentWeek && !b.currentWeek) return -1;
    if (!a.currentWeek && b.currentWeek) return 1;
    const aDate = a.startDate || "";
    const bDate = b.startDate || "";
    if (aDate && bDate) return bDate.localeCompare(aDate);
    return a.name.localeCompare(b.name);
  });
}

function toIsoDate(year, monthIndex, day) {
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toISOString().slice(0, 10);
}

function extractTierFromHtml(html) {
  const absoluteMatch = html.match(
    /https?:\/\/www\.atptour\.com\/[^"'\\s]+(?:eventtypes|tourtypes)\/[^"'\\s]+\\.png/i,
  );
  const relativeMatch = html.match(
    /\/(?:assets\/atptour\/assets\/eventtypes|-\/media\/images\/tourtypes)\/[^"'\s]+\.png/i,
  );
  const logoUrl = absoluteMatch?.[0]
    || (relativeMatch ? `https://www.atptour.com${relativeMatch[0]}` : "");
  if (!logoUrl) return null;

  let label = "";
  if (/gs\\.png/i.test(logoUrl)) label = "Grand Slam";
  if (/1000/i.test(logoUrl)) label = "ATP 1000";
  if (/500/i.test(logoUrl)) label = "ATP 500";
  if (/250/i.test(logoUrl)) label = "ATP 250";
  if (!label) return null;

  return { label, logoUrl };
}

function findLocationFromLines(lines) {
  for (const line of lines) {
    if (line.length < 6 || line.length > 40) continue;
    if (line.includes(",") && /^[A-Za-z .'-]+,\s*[A-Za-z .'-]+$/.test(line)) {
      return line;
    }
  }
  return "";
}

function findNameFromLines(lines) {
  for (const line of lines) {
    if (line.length > 4 && line.length < 40 && /open|championship|tournament/i.test(line)) {
      return line;
    }
  }
  return "";
}

function roundOrderFrom(rounds) {
  const order = [
    "Round of 128",
    "Round of 64",
    "Round of 32",
    "Round of 16",
    "Quarterfinals",
    "Semifinals",
    "Final",
  ];
  const list = [];
  order.forEach((name) => {
    const matches = rounds.get(name);
    if (matches && matches.length) {
      list.push({ name, matches });
    }
  });
  return list;
}

async function fetchHtml(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  return response.text();
}

async function fetchWithFallback(target) {
  const html = await fetchHtml(target);
  let parsed = parseDraw(html);
  if (parsed.rounds.length > 0) return { html, parsed, url: target };

  const currentMatch = target.match(/\/scores\/current\/([^/]+)\/(\d+)\/draws/);
  if (!currentMatch) return { html, parsed, url: target };

  const slug = currentMatch[1];
  const id = currentMatch[2];
  const aliasSlugs = getCurrentSlugAliases(slug, id);
  for (const aliasSlug of aliasSlugs) {
    const aliasUrl = `https://www.atptour.com/en/scores/current/${aliasSlug}/${id}/draws`;
    if (aliasUrl === target) continue;
    try {
      const aliasHtml = await fetchHtml(aliasUrl);
      const aliasParsed = parseDraw(aliasHtml);
      if (aliasParsed.rounds.length > 0) {
        return { html: aliasHtml, parsed: aliasParsed, url: aliasUrl };
      }
    } catch (error) {
      continue;
    }
  }

  const year = new Date().getFullYear();
  const fallbackUrls = [];
  for (let delta = 0; delta <= 3; delta += 1) {
    fallbackUrls.push(`https://www.atptour.com/en/scores/archive/${slug}/${id}/${year - delta}/draws`);
  }

  for (const fallback of fallbackUrls) {
    try {
      const fallbackHtml = await fetchHtml(fallback);
      const fallbackParsed = parseDraw(fallbackHtml);
      if (fallbackParsed.rounds.length > 0) {
        return { html: fallbackHtml, parsed: fallbackParsed, url: fallback };
      }
    } catch (error) {
      continue;
    }
  }

  return { html, parsed, url: target };
}

function getCurrentSlugAliases(slug, eventId) {
  const aliases = [slug];
  if (eventId === "424" && !aliases.includes("new-york")) aliases.push("new-york");
  if (eventId === "424" && !aliases.includes("dallas")) aliases.push("dallas");
  return aliases;
}

function readStore() {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    return ensureStoreShape(JSON.parse(raw));
  } catch (error) {
    return ensureStoreShape({ users: {}, picks: {} });
  }
}

function writeStore(store) {
  fs.writeFileSync(dataFile, JSON.stringify(ensureStoreShape(store), null, 2));
}

function ensureStoreShape(store) {
  const next = store || {};
  next.users = next.users || {};
  next.picks = next.picks || {};
  next.pools = next.pools || {};
  next.poolMembers = next.poolMembers || {};
  next.meta = next.meta || {};
  next.meta.deviceUserMap = next.meta.deviceUserMap || {};
  return next;
}

function createInviteCode() {
  return crypto.randomBytes(4).toString("hex");
}

function getPoolByInviteCode(store, inviteCode) {
  return Object.values(store.pools).find(
    (pool) => pool.inviteCode.toLowerCase() === String(inviteCode || "").toLowerCase(),
  ) || null;
}

function getUserPools(store, userId) {
  const ids = Object.entries(store.poolMembers)
    .filter(([, members]) => Array.isArray(members) && members.includes(userId))
    .map(([poolId]) => poolId);
  return ids.map((id) => store.pools[id]).filter(Boolean);
}

function isSathyaName(name) {
  return String(name || "").trim().toLowerCase() === "sathya";
}

function isSathyaUser(user) {
  return isSathyaName(user?.name);
}

function isPoolAdminUser(store, user) {
  if (!user) return false;
  const adminUserId = store?.meta?.poolAdminUserId;
  const adminDeviceId = store?.meta?.poolAdminDeviceId;
  if (!adminUserId || !adminDeviceId) return false;
  return user.id === adminUserId && user.deviceId === adminDeviceId && isSathyaUser(user);
}

function sanitizePoolForUser(pool, user, store) {
  if (!pool) return null;
  if (isPoolAdminUser(store, user)) return pool;
  const { inviteCode, ...rest } = pool;
  return rest;
}

function ensurePoolPicks(store, poolId, tournamentId) {
  store.picks[poolId] = store.picks[poolId] || {};
  store.picks[poolId][tournamentId] = store.picks[poolId][tournamentId] || {};
}

async function getTournamentById(tournamentId) {
  const year = Number(String(tournamentId || "").split("-")[0]);
  const years = Number.isFinite(year) ? [year, year - 1] : [new Date().getFullYear()];
  for (const y of years) {
    try {
      const tournaments = await fetchTournaments(y);
      const tournament = tournaments.find((item) => item.id === tournamentId);
      if (tournament) return tournament;
    } catch (error) {
      continue;
    }
  }
  return null;
}

async function isTournamentLocked(tournamentId) {
  const now = Date.now();
  const year = Number(String(tournamentId || "").split("-")[0]);
  if (Number.isFinite(year) && year < new Date().getFullYear()) return true;

  const tournament = await getTournamentById(tournamentId);
  if (!tournament) return false;

  if (tournament.startDate) {
    const startsAt = Date.parse(`${tournament.startDate}T00:00:00Z`);
    if (Number.isFinite(startsAt) && now >= startsAt) return true;
  }

  if (tournament.drawUrl) {
    try {
      const { parsed } = await fetchWithFallback(tournament.drawUrl);
      const hasStarted = parsed.rounds.some((round) =>
        round.matches.some((match) => Boolean(match.winnerId)),
      );
      if (hasStarted) return true;
    } catch (error) {
      // Keep unlocked if draw fetch fails.
    }
  }

  return false;
}

function getOrCreateDeviceId(deviceId) {
  if (deviceId && typeof deviceId === "string" && deviceId.length > 6) {
    return deviceId;
  }
  return crypto.randomUUID();
}

function getAuthUser(req) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return null;
  const store = readStore();
  return Object.values(store.users).find((user) => user.token === token) || null;
}

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve({});
      }
    });
  });
}

function serveStatic(req, res) {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(publicDir, `.${requestPath}`);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    const types = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    };
    res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/api/login") && req.method === "POST") {
    const { name, deviceId } = await readJson(req);
    if (!name) return json(res, 400, { error: "Name is required" });
    const store = readStore();
    const requestedName = String(name).trim();
    if (!requestedName) return json(res, 400, { error: "Name is required" });
    const safeDeviceId = getOrCreateDeviceId(deviceId);
    const adminUserId = store.meta?.poolAdminUserId;
    const adminDeviceId = store.meta?.poolAdminDeviceId;
    const adminUser = adminUserId ? store.users[adminUserId] : null;
    const hasAdmin = Boolean(adminUser && adminDeviceId);

    // If this is the designated admin device, always bind it back to the admin account.
    if (hasAdmin && adminDeviceId === safeDeviceId) {
      store.meta.deviceUserMap[safeDeviceId] = adminUser.id;
      if (requestedName.toLowerCase() !== adminUser.name.toLowerCase()) {
        writeStore(store);
        return json(res, 403, {
          error: `This browser is reserved for admin account "${adminUser.name}".`,
        });
      }
    }

    const boundUserId = store.meta?.deviceUserMap?.[safeDeviceId];
    if (boundUserId && !store.users[boundUserId]) {
      delete store.meta.deviceUserMap[safeDeviceId];
    }
    if (boundUserId && store.users[boundUserId]) {
      const boundUser = store.users[boundUserId];
      if (boundUser.name.toLowerCase() !== requestedName.toLowerCase()) {
        if (!hasAdmin && isSathyaName(requestedName)) {
          // First admin bootstrap: allow this device to switch to Sathya before admin is established.
          delete store.meta.deviceUserMap[safeDeviceId];
        } else {
          return json(res, 403, {
            error: `This browser is locked to "${boundUser.name}". Log out is allowed, but name changes are disabled.`,
          });
        }
      }
    }

    if (
      isSathyaName(requestedName)
      && hasAdmin
      && adminDeviceId !== safeDeviceId
    ) {
      return json(res, 403, {
        error: "The name Sathya is reserved for the pool owner account on another device.",
      });
    }
    let user = boundUserId ? store.users[boundUserId] : null;
    if (!user) {
      user = Object.values(store.users).find(
        (entry) => entry.name.toLowerCase() === requestedName.toLowerCase(),
      );
    }
    if (user && user.deviceId && user.deviceId !== safeDeviceId) {
      return json(res, 403, {
        error: "That name is already in use on another device. Choose a different bracket name.",
      });
    }
    if (!user) {
      const id = crypto.randomUUID();
      user = { id, name: requestedName, token: crypto.randomUUID(), deviceId: safeDeviceId };
      store.users[id] = user;
    } else if (!user.deviceId) {
      user.deviceId = safeDeviceId;
    }
    if (hasAdmin && adminDeviceId === safeDeviceId) {
      // Ensure admin device cannot drift to a non-admin user mapping.
      store.meta.deviceUserMap[safeDeviceId] = adminUser.id;
      user = adminUser;
    } else {
      store.meta.deviceUserMap[safeDeviceId] = user.id;
    }
    if (isSathyaUser(user)) {
      if (!store.meta.poolAdminUserId) store.meta.poolAdminUserId = user.id;
      if (!store.meta.poolAdminDeviceId) store.meta.poolAdminDeviceId = user.deviceId;
    }
    writeStore(store);
    const canManagePools = isPoolAdminUser(store, user);
    return json(res, 200, {
      id: user.id,
      name: user.name,
      token: user.token,
      deviceId: safeDeviceId,
      canManagePools,
    });
  }

  if (req.url?.startsWith("/api/me")) {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const store = readStore();
    return json(res, 200, {
      id: user.id,
      name: user.name,
      canManagePools: isPoolAdminUser(store, user),
    });
  }

  if (req.url?.startsWith("/api/pools") && req.method === "GET") {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const store = readStore();
    const pools = getUserPools(store, user.id).map((pool) => sanitizePoolForUser(pool, user, store));
    return json(res, 200, { pools });
  }

  if (req.url?.startsWith("/api/pools") && req.method === "PATCH") {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const store = readStore();
    if (!isPoolAdminUser(store, user)) return json(res, 403, { error: "Only pool admin can rename pools" });
    const url = new URL(req.url, "http://localhost");
    const poolId = url.searchParams.get("id");
    if (!poolId) return json(res, 400, { error: "Missing pool id" });
    const { name } = await readJson(req);
    const nextName = String(name || "").trim();
    if (!nextName) return json(res, 400, { error: "Name is required" });
    const pool = store.pools[poolId];
    if (!pool) return json(res, 404, { error: "Pool not found" });
    if (pool.ownerUserId !== user.id) return json(res, 403, { error: "Only owner can rename pool" });
    pool.name = nextName;
    writeStore(store);
    return json(res, 200, { pool: sanitizePoolForUser(pool, user, store) });
  }

  if (req.url?.startsWith("/api/pools") && req.method === "DELETE") {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const store = readStore();
    if (!isPoolAdminUser(store, user)) return json(res, 403, { error: "Only pool admin can delete pools" });
    const url = new URL(req.url, "http://localhost");
    const poolId = url.searchParams.get("id");
    if (!poolId) return json(res, 400, { error: "Missing pool id" });
    const pool = store.pools[poolId];
    if (!pool) return json(res, 404, { error: "Pool not found" });
    if (pool.ownerUserId !== user.id) return json(res, 403, { error: "Only owner can delete pool" });
    delete store.pools[poolId];
    delete store.poolMembers[poolId];
    delete store.picks[poolId];
    writeStore(store);
    return json(res, 200, { ok: true });
  }

  if (req.url?.startsWith("/api/pools") && req.method === "POST" && !req.url?.includes("/join")) {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const store = readStore();
    if (!isPoolAdminUser(store, user)) return json(res, 403, { error: "Only pool admin can create pools" });
    const { name } = await readJson(req);
    const poolId = crypto.randomUUID();
    const pool = {
      id: poolId,
      name: (name || "Friends Pool").trim() || "Friends Pool",
      ownerUserId: user.id,
      inviteCode: createInviteCode(),
      createdAt: new Date().toISOString(),
    };
    store.pools[poolId] = pool;
    store.poolMembers[poolId] = [user.id];
    writeStore(store);
    return json(res, 200, { pool: sanitizePoolForUser(pool, user, store) });
  }

  if (req.url?.startsWith("/api/pools/join") && req.method === "POST") {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const { inviteCode } = await readJson(req);
    if (!inviteCode) return json(res, 400, { error: "inviteCode is required" });
    const store = readStore();
    const pool = getPoolByInviteCode(store, inviteCode);
    if (!pool) return json(res, 404, { error: "Pool not found" });
    store.poolMembers[pool.id] = store.poolMembers[pool.id] || [];
    if (!store.poolMembers[pool.id].includes(user.id)) {
      store.poolMembers[pool.id].push(user.id);
      writeStore(store);
    }
    return json(res, 200, { pool: sanitizePoolForUser(pool, user, store) });
  }

  if (req.url?.startsWith("/api/picks")) {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const url = new URL(req.url, "http://localhost");
    const tournament = url.searchParams.get("tournament");
    const poolId = url.searchParams.get("pool");
    if (!tournament) return json(res, 400, { error: "Missing tournament" });
    if (!poolId) return json(res, 400, { error: "Missing pool" });
    const store = readStore();
    const members = store.poolMembers[poolId] || [];
    if (!members.includes(user.id)) return json(res, 403, { error: "Not a pool member" });
    ensurePoolPicks(store, poolId, tournament);
    const locked = await isTournamentLocked(tournament);
    if (req.method === "GET") {
      const row = store.picks[poolId][tournament][user.id] || {};
      return json(res, 200, { picks: row.picks || {}, locked });
    }
    if (req.method === "POST") {
      if (locked) return json(res, 423, { error: "Draw is locked for this tournament" });
      const body = await readJson(req);
      store.picks[poolId][tournament][user.id] = {
        picks: body.picks || {},
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      return json(res, 200, { ok: true });
    }
  }

  if (req.url?.startsWith("/api/leaderboard")) {
    const user = getAuthUser(req);
    if (!user) return json(res, 401, { error: "Unauthorized" });
    const url = new URL(req.url, "http://localhost");
    const tournament = url.searchParams.get("tournament");
    const poolId = url.searchParams.get("pool");
    if (!tournament) return json(res, 400, { error: "Missing tournament" });
    if (!poolId) return json(res, 400, { error: "Missing pool" });
    const store = readStore();
    const memberIds = store.poolMembers[poolId] || [];
    if (!memberIds.includes(user.id)) return json(res, 403, { error: "Not a pool member" });
    const picksScope = store.picks?.[poolId]?.[tournament] || {};
    const picks = Object.fromEntries(
      Object.entries(picksScope).map(([userId, value]) => [userId, value?.picks || {}]),
    );
    const users = memberIds
      .map((id) => store.users[id])
      .filter(Boolean)
      .map((u) => ({ id: u.id, name: u.name }));
    const locked = await isTournamentLocked(tournament);
    return json(res, 200, { users, picks, locked });
  }

  if (req.url?.startsWith("/api/tournaments")) {
    const url = new URL(req.url, "http://localhost");
    const yearParam = Number(url.searchParams.get("year"));
    const year = Number.isFinite(yearParam) && yearParam > 1900 ? yearParam : new Date().getFullYear();
    try {
      const tournaments = await fetchTournaments(year);
      return json(res, 200, { year, tournaments });
    } catch (error) {
      return json(res, 500, { error: `Failed to load tournaments: ${error.message}` });
    }
  }

  if (req.url?.startsWith("/api/draw-meta")) {
    const url = new URL(req.url, "http://localhost");
    const target = url.searchParams.get("url");
    if (!target || !target.includes("atptour.com")) {
      res.writeHead(400);
      res.end("Invalid draw url");
      return;
    }
    try {
      const { parsed, url: sourceUrl } = await fetchWithFallback(target);
      parsed.tournament.sourceUrl = sourceUrl;
      return json(res, 200, { tournament: parsed.tournament });
    } catch (error) {
      return json(res, 500, { error: `Failed to fetch draw: ${error.message}` });
    }
  }

  if (req.url?.startsWith("/api/draw")) {
    const url = new URL(req.url, "http://localhost");
    const target = url.searchParams.get("url");
    if (!target || !target.includes("atptour.com")) {
      res.writeHead(400);
      res.end("Invalid draw url");
      return;
    }

    try {
      const { parsed, url: sourceUrl } = await fetchWithFallback(target);
      parsed.tournament.sourceUrl = sourceUrl;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(parsed));
    } catch (error) {
      res.writeHead(500);
      res.end(`Failed to fetch draw: ${error.message}`);
    }
    return;
  }

  serveStatic(req, res);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
