const fallbackTournaments = [
  {
    id: "2026-miami-403",
    slug: "miami",
    eventId: "403",
    name: "Miami Open presented by Itau",
    location: "Miami Gardens, United States",
    startDate: "2026-03-19",
    endDate: "2026-03-29",
    drawUrl: "https://www.atptour.com/en/scores/current/miami/403/draws",
  },
  {
    id: "2026-indian-wells-404",
    slug: "indian-wells",
    eventId: "404",
    name: "BNP Paribas Open",
    location: "Indian Wells, United States",
    startDate: "2026-03-04",
    endDate: "2026-03-16",
    drawUrl: "https://www.atptour.com/en/scores/archive/indian-wells/404/2026/draws",
  },
  {
    id: "2026-acapulco-807",
    slug: "acapulco",
    eventId: "807",
    name: "Abierto Mexicano Telcel",
    location: "Acapulco, Mexico",
    startDate: "2026-02-23",
    endDate: "2026-03-01",
    drawUrl: "https://www.atptour.com/en/scores/archive/acapulco/807/2026/draws",
  },
  {
    id: "2026-doha-451",
    slug: "doha",
    eventId: "451",
    name: "Qatar ExxonMobil Open",
    location: "Doha, Qatar",
    startDate: "2026-02-16",
    endDate: "2026-02-22",
    drawUrl: "https://www.atptour.com/en/scores/archive/doha/451/2026/draws",
  },
  {
    id: "2026-dubai-495",
    slug: "dubai",
    eventId: "495",
    name: "Dubai Duty Free Tennis Championships",
    location: "Dubai, UAE",
    startDate: "2026-02-23",
    endDate: "2026-03-01",
    drawUrl: "https://www.atptour.com/en/scores/archive/dubai/495/2026/draws",
  },
  {
    id: "2026-dallas-424",
    slug: "dallas",
    eventId: "424",
    name: "Dallas Open",
    location: "Dallas, United States",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
    drawUrl: "https://www.atptour.com/en/scores/archive/dallas/424/2026/draws",
  },
  {
    id: "2026-rotterdam-407",
    slug: "rotterdam",
    eventId: "407",
    name: "ABN AMRO Open",
    location: "Rotterdam, Netherlands",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
    drawUrl: "https://www.atptour.com/en/scores/archive/rotterdam/407/2026/draws",
  },
  {
    id: "2026-delray-beach-499",
    slug: "delray-beach",
    eventId: "499",
    name: "Delray Beach Open",
    location: "Delray Beach, United States",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
    drawUrl: "https://www.atptour.com/en/scores/archive/delray-beach/499/2026/draws",
  },
  {
    id: "2026-buenos-aires-506",
    slug: "buenos-aires",
    eventId: "506",
    name: "IEB+ Argentina Open",
    location: "Buenos Aires, Argentina",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
    drawUrl: "https://www.atptour.com/en/scores/archive/buenos-aires/506/2026/draws",
  },
  {
    id: "2026-rio-de-janeiro-6932",
    slug: "rio-de-janeiro",
    eventId: "6932",
    name: "Rio Open presented by Claro",
    location: "Rio de Janeiro, Brazil",
    startDate: "2026-02-16",
    endDate: "2026-02-22",
    drawUrl: "https://www.atptour.com/en/scores/archive/rio-de-janeiro/6932/2026/draws",
  },
  {
    id: "2026-montpellier-375",
    slug: "montpellier",
    eventId: "375",
    name: "Open Occitanie",
    location: "Montpellier, France",
    startDate: "2026-02-02",
    endDate: "2026-02-08",
    drawUrl: "https://www.atptour.com/en/scores/archive/montpellier/375/2026/draws",
  },
  {
    id: "2026-australian-open-580",
    slug: "australian-open",
    eventId: "580",
    name: "Australian Open",
    location: "Melbourne, Australia",
    startDate: "2026-01-19",
    endDate: "2026-02-01",
    drawUrl: "https://www.atptour.com/en/scores/archive/australian-open/580/2026/draws",
  },
  {
    id: "2026-brisbane-339",
    slug: "brisbane",
    eventId: "339",
    name: "Brisbane International",
    location: "Brisbane, Australia",
    startDate: "2026-01-05",
    endDate: "2026-01-11",
    drawUrl: "https://www.atptour.com/en/scores/archive/brisbane/339/2026/draws",
  },
  {
    id: "2026-asb-classic-301",
    slug: "asb-classic",
    eventId: "301",
    name: "ASB Classic",
    location: "Auckland, New Zealand",
    startDate: "2026-01-05",
    endDate: "2026-01-11",
    drawUrl: "https://www.atptour.com/en/scores/archive/asb-classic/301/2026/draws",
  },
  {
    id: "2026-adelaide-8998",
    slug: "adelaide",
    eventId: "8998",
    name: "Adelaide International",
    location: "Adelaide, Australia",
    startDate: "2026-01-09",
    endDate: "2026-01-17",
    drawUrl: "https://www.atptour.com/en/scores/archive/adelaide/8998/2026/draws",
  },
];

const state = {
  tournaments: [],
  tournament: null,
  mode: "pre",
  view: "bracket",
  data: null,
  picks: {},
  submitted: false,
  session: null,
  leaderboard: null,
  tournamentMeta: {},
  standings: [],
  standingsQuery: "",
  standingsPage: 1,
  standingsPageSize: 25,
  selectedEntryId: null,
  currentWeekOnly: true,
  pools: [],
  activePoolId: "",
  isLocked: false,
  pendingInviteCode: "",
  seasonData: null,
  seasonLoading: false,
  seasonDrawCache: {},
};

const DEVICE_ID_KEY = "deviceId";
const CURRENT_WEEK_FILTER_KEY = "currentWeekOnly";

const roundOrder = [
  "Round of 128",
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

const dom = {
  select: document.getElementById("tournament-select"),
  toggle: document.getElementById("mode-toggle"),
  viewSelect: document.getElementById("view-select"),
  meta: document.getElementById("tournament-meta"),
  bracket: document.getElementById("bracket"),
  scores: document.getElementById("scores"),
  scoreRule: document.getElementById("score-rule"),
  leaderboard: document.getElementById("leaderboard"),
  standings: document.getElementById("standings"),
  season: document.getElementById("season"),
  loginScreen: document.getElementById("login-screen"),
  loginName: document.getElementById("login-name"),
  loginPinRow: document.getElementById("login-pin-row"),
  loginPin: document.getElementById("login-pin"),
  loginTournament: document.getElementById("login-tournament"),
  loginSubmit: document.getElementById("login-submit"),
  loginHint: document.getElementById("login-hint"),
  currentUser: document.getElementById("current-user"),
  adminBadge: document.getElementById("admin-badge"),
  logoutUser: document.getElementById("logout-user"),
  currentWeekOnly: document.getElementById("current-week-only"),
  poolSelect: document.getElementById("pool-select"),
  createPool: document.getElementById("create-pool"),
  joinPool: document.getElementById("join-pool"),
  renamePool: document.getElementById("rename-pool"),
  deletePool: document.getElementById("delete-pool"),
  poolInvite: document.getElementById("pool-invite"),
};

async function init() {
  state.pendingInviteCode = getInviteCodeFromUrl();
  if (state.pendingInviteCode) {
    // Invite links should always start from the login screen, not auto-resume prior sessions.
    sessionStorage.removeItem("sessionToken");
    localStorage.removeItem("sessionToken");
    state.session = null;
  }
  state.currentWeekOnly = localStorage.getItem(CURRENT_WEEK_FILTER_KEY) !== "false";
  dom.currentWeekOnly.checked = state.currentWeekOnly;
  await loadTournaments();
  applyUrlState();

  dom.select.addEventListener("change", (event) => {
    state.tournament = getVisibleTournaments().find((t) => t.id === event.target.value);
    loadTournament();
  });

  dom.toggle.addEventListener("click", async (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const mode = event.target.dataset.mode;
    if (!mode) return;
    if (state.selectedEntryId && mode !== "completed") {
      state.selectedEntryId = null;
      await restoreCurrentUserPicks();
    }
    state.mode = mode;
    [...dom.toggle.querySelectorAll("button")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
      btn.classList.toggle("live", btn.dataset.mode === "live" && mode === "live");
    });
    render();
  });

  dom.viewSelect.addEventListener("change", async (event) => {
    state.view = event.target.value;
    syncUrlState();
    if (state.view === "season") {
      await loadSeasonStandings();
    } else {
      render();
    }
  });

  dom.loginSubmit.addEventListener("click", login);
  dom.loginName.addEventListener("input", () => {
    const isAdmin = dom.loginName.value.trim().toLowerCase() === "sathya";
    dom.loginPinRow?.classList.toggle("hidden", !isAdmin);
    if (!isAdmin && dom.loginPin) dom.loginPin.value = "";
  });
  dom.loginName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });
  dom.loginPin?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });
  dom.loginTournament.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });
  dom.poolSelect?.addEventListener("change", () => {
    state.activePoolId = dom.poolSelect.value;
    localStorage.setItem("activePoolId", state.activePoolId);
    refreshPoolInvite();
    loadTournament();
  });
  dom.createPool?.addEventListener("click", createPool);
  dom.joinPool?.addEventListener("click", joinPool);
  dom.renamePool?.addEventListener("click", renamePool);
  dom.deletePool?.addEventListener("click", deletePool);
  document.getElementById("change-pin")?.addEventListener("click", changeAdminPin);
  document.getElementById("rename-me")?.addEventListener("click", renameMe);
  document.getElementById("manage-users")?.addEventListener("click", openManageUsers);
  document.getElementById("admin-panel-close")?.addEventListener("click", closeManageUsers);
  document.querySelector(".admin-panel__backdrop")?.addEventListener("click", closeManageUsers);
  dom.logoutUser.addEventListener("click", logout);
  dom.currentWeekOnly.addEventListener("change", () => {
    state.currentWeekOnly = Boolean(dom.currentWeekOnly.checked);
    localStorage.setItem(CURRENT_WEEK_FILTER_KEY, String(state.currentWeekOnly));
    populateTournamentOptions(dom.select);
    populateTournamentOptions(dom.loginTournament, true);
    setDefaultTournament();
    if (state.tournament) {
      dom.select.value = state.tournament.id;
      dom.loginTournament.value = state.tournament.id;
      loadTournament();
    }
  });

  applyPoolPermissions();
  initAuth();
}

async function initAuth() {
  if (state.pendingInviteCode) {
    dom.loginHint.textContent = "Enter your name to join this pool invite.";
    dom.loginScreen.classList.remove("hidden");
    setDefaultTournament();
    return;
  }
  const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
  // Migrate any sessionStorage-only token to localStorage for persistence.
  if (!localStorage.getItem("sessionToken") && sessionStorage.getItem("sessionToken")) {
    localStorage.setItem("sessionToken", sessionStorage.getItem("sessionToken"));
    sessionStorage.removeItem("sessionToken");
  }
  if (token) {
    const me = await apiFetch("/api/me", { method: "GET" }, token);
    if (me?.id) {
      state.session = { ...me, token };
      dom.currentUser.textContent = me.name;
      dom.loginScreen.classList.add("hidden");
      await loadPools();
      await tryAutoJoinPendingInvite();
      setDefaultTournament();
      return loadTournament();
    }
    sessionStorage.removeItem("sessionToken");
    localStorage.removeItem("sessionToken");
    state.session = null;
    state.picks = {};
  }
  dom.loginScreen.classList.remove("hidden");
  setDefaultTournament();
}

async function login() {
  const name = dom.loginName.value.trim();
  const tournamentId = dom.loginTournament.value;
  if (!name) {
    dom.loginHint.textContent = "Please enter your name.";
    return;
  }
  dom.loginHint.textContent = "Signing you in...";
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, deviceId: getDeviceId(), pin: dom.loginPin?.value || undefined }),
  });
  if (!response.ok) {
    const text = await response.text();
    dom.loginHint.textContent = `Login failed (${response.status}). ${text}`.slice(0, 120);
    return;
  }
  const data = await response.json();
  localStorage.setItem("sessionToken", data.token);
  if (data.deviceId) {
    localStorage.setItem(DEVICE_ID_KEY, data.deviceId);
  }
  state.session = data;
  dom.currentUser.textContent = data.name;
  dom.loginScreen.classList.add("hidden");
  await loadPools();
  await tryAutoJoinPendingInvite();
  const visible = getVisibleTournaments(true);
  state.tournament = visible.find((t) => t.id === tournamentId) || visible[0] || state.tournaments[0];
  dom.select.value = state.tournament.id;
  loadTournament();
}

async function loadPools() {
  if (!state.session) return;
  const data = await apiFetch("/api/pools", { method: "GET" });
  state.pools = data?.pools || [];
  if (!state.pools.length && canManagePools()) {
    const created = await apiFetch("/api/pools", {
      method: "POST",
      body: JSON.stringify({ name: `${state.session.name}'s Pool` }),
    });
    if (created?.pool) state.pools = [created.pool];
  }
  const preferred = localStorage.getItem("activePoolId");
  state.activePoolId = state.pools.find((p) => p.id === preferred)?.id || state.pools[0]?.id || "";
  if (state.activePoolId) localStorage.setItem("activePoolId", state.activePoolId);
  renderPoolOptions();
  refreshPoolInvite();
  applyPoolPermissions();
}

function renderPoolOptions() {
  if (!dom.poolSelect) return;
  dom.poolSelect.innerHTML = state.pools
    .map((pool) => `<option value="${pool.id}">${escapeHtml(pool.name)}</option>`)
    .join("");
  if (state.activePoolId) dom.poolSelect.value = state.activePoolId;
}

function refreshPoolInvite() {
  if (!dom.poolInvite) return;
  const pool = state.pools.find((item) => item.id === state.activePoolId);
  if (!pool || !pool.inviteCode || !canManagePools()) {
    dom.poolInvite.innerHTML = "";
    return;
  }
  const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(pool.inviteCode)}`;
  dom.poolInvite.innerHTML = `Invite: <a href="${escapeHtml(inviteLink)}" target="_blank">${escapeHtml(inviteLink)}</a> <button type="button" class="copy-invite" data-link="${escapeHtml(inviteLink)}">Copy</button>`;
  dom.poolInvite.querySelector(".copy-invite")?.addEventListener("click", async (e) => {
    const link = e.target.dataset.link;
    try {
      await navigator.clipboard.writeText(link);
      e.target.textContent = "Copied!";
      setTimeout(() => { e.target.textContent = "Copy"; }, 1500);
    } catch {
      e.target.textContent = "Copy";
    }
  });
}

function applyPoolPermissions() {
  const canManage = canManagePools();
  if (dom.createPool) dom.createPool.style.display = canManage ? "inline-flex" : "none";
  if (dom.renamePool) dom.renamePool.style.display = canManage ? "inline-flex" : "none";
  if (dom.deletePool) dom.deletePool.style.display = canManage ? "inline-flex" : "none";
  const changePinBtn = document.getElementById("change-pin");
  if (changePinBtn) changePinBtn.style.display = canManage ? "inline-flex" : "none";
  const manageUsersBtn = document.getElementById("manage-users");
  if (manageUsersBtn) manageUsersBtn.style.display = canManage ? "inline-flex" : "none";
  if (dom.adminBadge) dom.adminBadge.classList.toggle("visible", canManage);
}

async function createPool() {
  if (!state.session || !canManagePools()) return;
  const name = window.prompt("Pool name?", `${state.session.name}'s Pool`);
  if (!name) return;
  const response = await apiFetch("/api/pools", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!response?.pool) return;
  await loadPools();
  state.activePoolId = response.pool.id;
  localStorage.setItem("activePoolId", state.activePoolId);
  renderPoolOptions();
  refreshPoolInvite();
  loadTournament();
}

async function joinPool() {
  if (!state.session) return;
  const inviteCode = window.prompt("Enter invite code");
  if (!inviteCode) return;
  const joined = await joinPoolByCode(inviteCode.trim(), true);
  if (joined) loadTournament();
}

async function renamePool() {
  if (!state.session || !canManagePools() || !state.activePoolId) return;
  const pool = state.pools.find((item) => item.id === state.activePoolId);
  if (!pool) return;
  const name = window.prompt("New pool name?", pool.name);
  if (!name) return;
  const response = await fetch(`/api/pools?id=${encodeURIComponent(pool.id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.session.token}`,
    },
    body: JSON.stringify({ name: name.trim() }),
  });
  if (!response.ok) {
    window.alert("Could not rename pool.");
    return;
  }
  await loadPools();
  loadTournament();
}

async function deletePool() {
  if (!state.session || !canManagePools() || !state.activePoolId) return;
  const pool = state.pools.find((item) => item.id === state.activePoolId);
  if (!pool) return;
  const confirmed = window.confirm(`Delete pool "${pool.name}"? This will remove all saved brackets in this pool.`);
  if (!confirmed) return;
  const response = await fetch(`/api/pools?id=${encodeURIComponent(pool.id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${state.session.token}`,
    },
  });
  if (response.status === 403) {
    window.alert("Only the pool owner can delete this pool.");
    return;
  }
  if (!response.ok) {
    window.alert("Could not delete pool.");
    return;
  }
  if (state.activePoolId === pool.id) {
    localStorage.removeItem("activePoolId");
  }
  await loadPools();
  loadTournament();
}

async function changeAdminPin() {
  if (!state.session || !canManagePools()) return;
  const pin = window.prompt("Enter new admin PIN (min 4 characters):");
  if (!pin) return;
  if (pin.length < 4) {
    window.alert("PIN must be at least 4 characters.");
    return;
  }
  const response = await fetch("/api/admin/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.session.token}` },
    body: JSON.stringify({ pin }),
  });
  if (!response.ok) {
    window.alert("Could not update PIN.");
    return;
  }
  window.alert("Admin PIN updated successfully.");
}

async function openManageUsers() {
  if (!state.session || !canManagePools()) return;
  const panel = document.getElementById("admin-panel");
  const body = document.getElementById("admin-panel-body");
  if (!panel || !body) return;
  body.innerHTML = "<p style='color:var(--muted);font-size:0.9rem'>Loading…</p>";
  panel.classList.remove("hidden");

  const data = await apiFetch("/api/admin/users", { method: "GET" });
  if (!data?.users) {
    body.innerHTML = "<p style='color:var(--danger)'>Failed to load users.</p>";
    return;
  }
  renderAdminUsers(data.users);
}

function closeManageUsers() {
  document.getElementById("admin-panel")?.classList.add("hidden");
}

function renderAdminUsers(users) {
  const body = document.getElementById("admin-panel-body");
  if (!body) return;
  if (!users.length) {
    body.innerHTML = "<p style='color:var(--muted);font-size:0.9rem'>No users found.</p>";
    return;
  }

  const rows = users.map((u) => {
    const isSelf = u.id === state.session?.id;
    const poolNames = u.pools.map((p) => escapeHtml(p.name)).join(", ") || "No pools";
    const selfClass = isSelf ? " admin-user-row--self" : "";
    const removeFromPoolButtons = u.pools.map((p) =>
      `<button type="button" class="ghost" data-action="remove-from-pool" data-user-id="${escapeHtml(u.id)}" data-pool-id="${escapeHtml(p.id)}" data-user-name="${escapeHtml(u.name)}" data-pool-name="${escapeHtml(p.name)}">Remove from ${escapeHtml(p.name)}</button>`
    ).join("");
    const renameBtn = `<button type="button" class="ghost" data-action="rename-user" data-user-id="${escapeHtml(u.id)}" data-user-name="${escapeHtml(u.name)}">Rename</button>`;
    const deleteBtn = isSelf ? "" : `<button type="button" class="ghost danger" data-action="delete-user" data-user-id="${escapeHtml(u.id)}" data-user-name="${escapeHtml(u.name)}">Delete</button>`;

    return `<div class="admin-user-row${selfClass}">
      <div class="admin-user-row__info">
        <div class="admin-user-row__name">${escapeHtml(u.name)}</div>
        <div class="admin-user-row__pools">${poolNames}</div>
      </div>
      <div class="admin-user-row__actions">
        ${renameBtn}
        ${removeFromPoolButtons}
        ${deleteBtn}
      </div>
    </div>`;
  }).join("");

  body.innerHTML = `<div class="admin-user-list">${rows}</div>`;

  body.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const userId = btn.dataset.userId;
    const userName = btn.dataset.userName;
    const poolId = btn.dataset.poolId;
    const poolName = btn.dataset.poolName;

    if (action === "rename-user") {
      const newName = window.prompt(`Rename "${userName}" to:`, userName);
      if (!newName || newName.trim() === userName) return;
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.session.token}` },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not rename user.");
        return;
      }
      await refreshAdminUsers();
    }

    if (action === "remove-from-pool") {
      if (!window.confirm(`Remove "${userName}" from pool "${poolName}"?`)) return;
      const res = await fetch(`/api/pools/members?pool=${encodeURIComponent(poolId)}&user=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${state.session.token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not remove user from pool.");
        return;
      }
      await refreshAdminUsers();
    }

    if (action === "delete-user") {
      if (!window.confirm(`Delete user "${userName}"? This will permanently remove their account and all their picks.`)) return;
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${state.session.token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not delete user.");
        return;
      }
      await refreshAdminUsers();
    }
  });
}

async function refreshAdminUsers() {
  const data = await apiFetch("/api/admin/users", { method: "GET" });
  if (data?.users) renderAdminUsers(data.users);
}

async function renameMe() {
  if (!state.session) return;
  const newName = window.prompt("Enter your new display name:", state.session.name);
  if (!newName || newName.trim() === state.session.name) return;
  const response = await fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.session.token}` },
    body: JSON.stringify({ name: newName.trim() }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    window.alert(data.error || "Could not rename.");
    return;
  }
  const data = await response.json();
  state.session.name = data.name;
  dom.currentUser.textContent = data.name;
}

function logout() {
  sessionStorage.removeItem("sessionToken");
  localStorage.removeItem("sessionToken");
  localStorage.removeItem("activePoolId");
  state.session = null;
  state.picks = {};
  state.selectedEntryId = null;
  state.pools = [];
  state.activePoolId = "";
  state.isLocked = false;
  dom.currentUser.textContent = "Guest";
  dom.loginHint.textContent = "";
  renderPoolOptions();
  refreshPoolInvite();
  applyPoolPermissions();
  dom.loginScreen.classList.remove("hidden");
}

function getDeviceId() {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const value =
    (window.crypto && "randomUUID" in window.crypto && window.crypto.randomUUID())
      || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(DEVICE_ID_KEY, value);
  return value;
}

function canManagePools() {
  return Boolean(state.session?.canManagePools);
}

function getInviteCodeFromUrl() {
  const code = new URLSearchParams(window.location.search).get("invite");
  return code ? code.trim() : "";
}

function clearInviteFromUrl() {
  const params = new URLSearchParams(window.location.search);
  params.delete("invite");
  const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.replaceState(null, "", next);
}

async function joinPoolByCode(inviteCode, alertOnFail = false) {
  if (!state.session || !inviteCode) return false;
  const response = await apiFetch("/api/pools/join", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
  if (!response?.pool) {
    if (alertOnFail) window.alert("Pool not found. Check invite code.");
    return false;
  }
  await loadPools();
  state.activePoolId = response.pool.id;
  localStorage.setItem("activePoolId", state.activePoolId);
  renderPoolOptions();
  refreshPoolInvite();
  return true;
}

async function tryAutoJoinPendingInvite() {
  if (!state.pendingInviteCode) return;
  await joinPoolByCode(state.pendingInviteCode, false);
  state.pendingInviteCode = "";
  clearInviteFromUrl();
}

async function apiFetch(path, options = {}, overrideToken) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const token = overrideToken || state.session?.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) return null;
  return response.json();
}

function populateTournamentOptions(selectEl, includeCurrent = false) {
  const tournaments = getVisibleTournaments(includeCurrent);
  selectEl.innerHTML = tournaments
    .map((t) => {
      const meta = state.tournamentMeta[t.id];
      const safeName = sanitizeUiText(t.name);
      const isUpcoming = meta?.isUpcomingWeek && !meta?.isCurrentWeek;
      const label = meta?.isCurrentWeek ? `${safeName} (This Week)` : isUpcoming ? `${safeName} (Upcoming)` : safeName;
      const className = meta?.isCurrentWeek ? "tournament-option current" : isUpcoming ? "tournament-option upcoming" : "tournament-option";
      return `<option class="${className}" value="${t.id}">${escapeHtml(label)}</option>`;
    })
    .join("");
}

function getVisibleTournaments(includeCurrent = false) {
  if (!state.currentWeekOnly) return state.tournaments;
  const current = state.tournaments.filter((t) => state.tournamentMeta[t.id]?.isCurrentWeek);
  const upcoming = state.tournaments.filter((t) => state.tournamentMeta[t.id]?.isUpcomingWeek && !state.tournamentMeta[t.id]?.isCurrentWeek);
  const combined = [...current, ...upcoming];
  if (combined.length) return combined;
  if (includeCurrent) return state.tournaments;
  return state.tournaments.slice(0, 6);
}

async function loadTournaments() {
  let list = [];
  try {
    const response = await fetch("/api/tournaments");
    if (response.ok) {
      const data = await response.json();
      list = data.tournaments || [];
    }
  } catch (error) {
    // Ignore network errors and fall back to the static list.
  }

  const combined = [...list, ...fallbackTournaments];
  const deduped = new Map();
  combined.forEach((tournament) => {
    const key = tournament.id || `${tournament.slug}-${tournament.eventId}`;
    if (!deduped.has(key)) deduped.set(key, tournament);
  });
  state.tournaments = deduped.size ? Array.from(deduped.values()) : fallbackTournaments;
  state.tournaments.sort((a, b) => {
    const aDate = a.startDate || "";
    const bDate = b.startDate || "";
    if (aDate && bDate) return bDate.localeCompare(aDate);
    if (aDate) return -1;
    if (bDate) return 1;
    return a.name.localeCompare(b.name);
  });
  state.tournamentMeta = buildTournamentMeta(state.tournaments);
  populateTournamentOptions(dom.select);
  populateTournamentOptions(dom.loginTournament, true);
  setDefaultTournament();
}

function buildTournamentMeta(list) {
  const today = new Date();
  return Object.fromEntries(
    list.map((tournament) => [
      tournament.id,
      {
        ...tournament,
        isCurrentWeek:
          Boolean(tournament.currentWeek)
          || isTodayInRange(today, tournament.startDate, tournament.endDate),
        isUpcomingWeek: isUpcomingInDays(today, tournament.startDate, 7),
      },
    ]),
  );
}

function setDefaultTournament() {
  const visible = getVisibleTournaments(true);
  const current = visible.find((t) => state.tournamentMeta[t.id]?.isCurrentWeek);
  if (current) {
    state.tournament = current;
    dom.select.value = current.id;
    dom.loginTournament.value = current.id;
    return;
  }
  if (!state.tournament && visible.length) {
    state.tournament = visible[0];
    dom.select.value = state.tournament.id;
    dom.loginTournament.value = state.tournament.id;
    return;
  }
  if (state.tournament && !visible.some((t) => t.id === state.tournament.id)) {
    state.tournament = visible[0] || null;
    if (state.tournament) {
      dom.select.value = state.tournament.id;
      dom.loginTournament.value = state.tournament.id;
    }
  }
}

function isTodayInRange(today, startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return today >= start && today <= end;
}

function isUpcomingInDays(today, startDate, days) {
  if (!startDate) return false;
  const start = new Date(startDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((start - today) / dayMs);
  return diffDays >= 0 && diffDays <= days;
}

async function loadTournament() {
  if (!state.tournament) return;
  if (!state.activePoolId) {
    dom.meta.innerHTML = "<span>Create or join a pool to start.</span>";
    dom.bracket.innerHTML = "";
    dom.scores.innerHTML = "";
    dom.standings.innerHTML = "";
    dom.leaderboard.innerHTML = "";
    return;
  }
  state.selectedEntryId = null;
  state.standingsPage = 1;
  state.standingsQuery = "";
  // If viewing season, stay on season view (it's pool-level, not tournament-level)
  if (state.view === "season") {
    loadSeasonStandings();
    return;
  }

  dom.meta.innerHTML = "<span>Loading draw from ATP Tour…</span>";
  dom.bracket.innerHTML = "";

  try {
    const response = await fetchWithTimeout(
      `/api/draw?url=${encodeURIComponent(state.tournament.drawUrl)}&tournamentId=${encodeURIComponent(state.tournament.id)}`,
      15000,
    );
    if (!response.ok) throw new Error(`Draw fetch failed (${response.status})`);
    const data = await response.json();
    data.tournament.location = data.tournament.location || state.tournament.location;
    data.tournament.name = data.tournament.name || state.tournament.name;
    if (!Array.isArray(data.rounds) || data.rounds.length === 0) {
      throw new Error("Draw not yet published");
    }
    state.data = data;

    if (state.session) {
      const picksData = await apiFetch(
        `/api/picks?tournament=${state.tournament.id}&pool=${state.activePoolId}`,
        {
          method: "GET",
        },
      );
      state.picks = picksData?.picks || {};
      state.submitted = Boolean(picksData?.submitted);
      state.isLocked = Boolean(picksData?.locked);
      state.leaderboard = await apiFetch(
        `/api/leaderboard?tournament=${state.tournament.id}&pool=${state.activePoolId}`,
        {
          method: "GET",
        },
      );
      if (state.leaderboard?.locked !== undefined) {
        state.isLocked = Boolean(state.leaderboard.locked);
      }
      hydrateStandings();
      applySelectedEntryFromUrl();
    }

    updateMeta();
    syncUrlState();
    renderBracketActions();
    render();
  } catch (error) {
    const isNotPublished = error.message.includes("not yet published");
    dom.meta.innerHTML = `<span>${isNotPublished ? "Draw not yet published — check back closer to the tournament start date." : `Unable to load draw (${error.message}).`}</span>`;
    dom.bracket.innerHTML = "";
    dom.scores.innerHTML = "";
    dom.standings.innerHTML = "";
  }
}

async function restoreCurrentUserPicks() {
  if (!state.session || !state.tournament || !state.activePoolId) return;
  const picksData = await apiFetch(
    `/api/picks?tournament=${state.tournament.id}&pool=${state.activePoolId}`,
    {
      method: "GET",
    },
  );
  state.picks = picksData?.picks || {};
  state.submitted = Boolean(picksData?.submitted);
  state.isLocked = Boolean(picksData?.locked);
}

function applySelectedEntryFromUrl() {
  const entryId = new URLSearchParams(window.location.search).get("entry");
  if (!entryId) return;
  const entry = state.standings.find((row) => row.userId === entryId);
  if (!entry) return;
  state.selectedEntryId = entryId;
  state.mode = "completed";
  state.view = "bracket";
  state.picks = entry.picks || {};
  dom.viewSelect.value = "bracket";
  [...dom.toggle.querySelectorAll("button")].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === "completed");
    btn.classList.toggle("live", false);
  });
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function updateMeta() {
  const { tournament } = state.data;
  const fallbackName = state.tournamentMeta[state.tournament.id]?.name || state.tournament?.name || "";
  const fallbackLocation =
    state.tournamentMeta[state.tournament.id]?.location || state.tournament?.location || "";
  const tier =
    tournament.tier || state.tournamentMeta[state.tournament.id]?.tier || state.tournament?.tier;
  const parsedName = sanitizeUiText(tournament.name || "");
  const parsedLocation = sanitizeUiText(tournament.location || "");
  const cleanName =
    parsedName && !/^(scores|draws|results)$/i.test(parsedName) ? parsedName : sanitizeUiText(fallbackName);
  const cleanLocation = (() => {
    if (!parsedLocation) return sanitizeUiText(fallbackLocation);
    if (parsedLocation.length < 9 && fallbackLocation) return sanitizeUiText(fallbackLocation);
    if (/^[A-Z]{2,3}\s*,/i.test(parsedLocation) && fallbackLocation) return sanitizeUiText(fallbackLocation);
    return parsedLocation;
  })();
  const cleanDates = sanitizeUiText(tournament.dates || "Dates unavailable");
  const lockLabel = state.isLocked ? "Locked" : "Open";
  dom.meta.innerHTML = [
    `<span><strong>${escapeHtml(cleanName)}</strong></span>`,
    `<span>${escapeHtml(cleanLocation)}</span>`,
    `<span>${escapeHtml(cleanDates)}</span>`,
    tier ? `<span class="meta-tier">${tier}</span>` : "",
    `<span class="meta-lock ${state.isLocked ? "locked" : "open"}">${lockLabel}</span>`,
  ].join("");
}

function render() {
  if (!state.data) return;
  const completedRounds = normalizeRounds(sortRounds(state.data.rounds));
  const preRounds = buildPreBracket(completedRounds);
  // Always use preRounds for the visual bracket structure so connector lines
  // are correctly drawn based on the bracket tree (pairs of R128 → R64, etc.).
  // Live/Completed results are overlaid on top via getResultsMap(completedRounds).
  const rounds = preRounds;
  const results = getResultsMap(completedRounds);
  const layout = buildLayout(rounds);

  dom.bracket.innerHTML = rounds
    .map((round, index) => renderRound(round, index, rounds, results, layout))
    .join("");

  const showScores = state.view === "scores";
  const showStandings = state.view === "standings";
  const showSeason = state.view === "season";
  const showBracket = !showScores && !showStandings && !showSeason;
  dom.scores.classList.toggle("active", showScores);
  dom.standings.classList.toggle("active", showStandings);
  if (dom.season) dom.season.classList.toggle("active", showSeason);
  dom.bracket.style.display = showBracket ? "grid" : "none";
  dom.scores.innerHTML = renderScores(completedRounds, results);
  dom.standings.innerHTML = renderStandings(completedRounds, results);
  dom.leaderboard.innerHTML = renderLeaderboard(completedRounds, results);
  dom.leaderboard.style.display = (showStandings || showSeason) ? "none" : "block";

  // "Viewing [Name]'s bracket" banner
  renderViewingBanner();
  renderBracketActions();

  dom.bracket.querySelectorAll(".player").forEach((node) => {
    node.addEventListener("click", () => {
      if (node.classList.contains("disabled")) return;
      if (state.isLocked) return;
      if (state.selectedEntryId && state.selectedEntryId !== state.session?.id) return;
      const matchId = node.dataset.match;
      const playerId = node.dataset.player;
      const roundName = node.dataset.round;
      if (!matchId || !playerId) return;
      if (!state.picks[roundName]) state.picks[roundName] = {};
      state.picks[roundName][matchId] = playerId;
      savePicks();
    });
  });

  dom.bracket.querySelectorAll(".set-winner-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const matchId = btn.dataset.match;
      const playerId = btn.dataset.player;
      if (!confirm(`Set ${playerId} as the tournament champion?`)) return;
      await apiFetch("/api/admin/final-result", {
        method: "POST",
        body: JSON.stringify({ tournamentId: state.tournament.id, matchId, winnerId: playerId }),
      });
      loadTournament();
    });
  });

  if (showStandings) {
    bindStandingsEvents(completedRounds);
  }
}

function renderBracketActions() {
  const el = document.getElementById("bracket-actions");
  if (!el) return;

  const isOwnBracket =
    state.session &&
    state.data &&
    state.mode === "pre" &&
    (!state.selectedEntryId || state.selectedEntryId === state.session.id);

  if (!isOwnBracket) {
    el.innerHTML = "";
    return;
  }

  const hasAnyPick = Object.values(state.picks).some(
    (round) => Object.keys(round || {}).length > 0,
  );

  if (state.isLocked) {
    el.innerHTML = `<div class="bracket-action-bar locked-notice">🔒 Bracket locked — picks are final.</div>`;
    return;
  }

  if (state.submitted) {
    el.innerHTML = `
      <div class="bracket-action-bar submitted">
        <span class="submit-status">✅ Bracket submitted!</span>
        <button type="button" id="edit-bracket-btn" class="ghost">✏️ Edit picks</button>
      </div>`;
    document.getElementById("edit-bracket-btn")?.addEventListener("click", async () => {
      state.submitted = false;
      await savePicks({ submitted: false });
    });
  } else {
    el.innerHTML = hasAnyPick
      ? `<div class="bracket-action-bar">
           <span class="submit-hint">Picks auto-save as you click. Hit Submit when you're done!</span>
           <button type="button" id="submit-bracket-btn" class="btn-submit">Submit Bracket ✓</button>
         </div>`
      : `<div class="bracket-action-bar">
           <span class="submit-hint">Click players in the bracket to make your picks.</span>
         </div>`;
    document.getElementById("submit-bracket-btn")?.addEventListener("click", async () => {
      await savePicks({ submitted: true });
    });
  }
}

function renderViewingBanner() {
  let banner = document.getElementById("viewing-banner");
  const isViewingOther = state.selectedEntryId && state.selectedEntryId !== state.session?.id;
  if (!isViewingOther) {
    if (banner) banner.remove();
    return;
  }
  const entry = state.standings.find((row) => row.userId === state.selectedEntryId);
  const name = entry?.name || "this player";
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "viewing-banner";
    banner.className = "viewing-banner";
    // Insert before the bracket section
    const content = document.querySelector(".content");
    if (content) content.parentNode.insertBefore(banner, content);
  }
  banner.innerHTML = `
    <span>Viewing <strong>${escapeHtml(name)}</strong>'s bracket</span>
    <button type="button" id="back-to-my-bracket" class="ghost">← Back to my bracket</button>
  `;
  document.getElementById("back-to-my-bracket")?.addEventListener("click", async () => {
    state.selectedEntryId = null;
    state.mode = "pre";
    state.view = "bracket";
    await restoreCurrentUserPicks();
    [...dom.toggle.querySelectorAll("button")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === "pre");
      btn.classList.toggle("live", false);
    });
    dom.viewSelect.value = "bracket";
    syncUrlState();
    render();
  });
}

function renderRound(round, roundIndex, rounds, results, layout) {
  const matches = round.matches
    .map((match) => renderMatch(match, round.name, roundIndex, rounds, results, layout))
    .join("");
  const connectors = roundIndex === 0 ? "" : renderConnectors(round, roundIndex, rounds, layout);
  return `
    <div class="round" style="height: ${layout.totalHeight}px;">
      <h3>${round.name}</h3>
      ${connectors}
      ${matches}
    </div>
  `;
}

function renderMatch(match, roundName, roundIndex, rounds, results, layout) {
  const actualWinner = results[match.id];
  const picked = state.picks?.[roundName]?.[match.id];
  // Always resolve via pre-bracket logic; live/completed results fill in actual players.
  const players = state.mode === "pre"
    ? resolvePrePlayers(match, roundIndex, rounds)
    : resolveCompletedPlayers(match, roundIndex, rounds, results);
  const top = layout.positions[match.id] ?? 0;

  // Bye match: one opponent is "Bye" — no picking, no points.
  const hasBye = players.some((p) => p?.id === "Bye");

  // Admin can set the Final winner when it's missing.
  const isFinal = roundName === "Final";
  const canSetWinner = isFinal && !actualWinner && state.mode === "completed"
    && state.session?.canManagePools && players.every((p) => p && p.id && p.id !== "TBD" && p.id !== "Bye");
  const setWinnerButtons = canSetWinner
    ? `<div class="set-winner-row">${players.map((p) =>
        `<button class="set-winner-btn" data-match="${match.id}" data-player="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`
      ).join(" <span>or</span> ")}</div>`
    : "";

  return `
    <div class="match${hasBye ? " bye-match" : ""}" style="top: ${top}px;">
      ${players
        .map((player) =>
          renderPlayer(
            player,
            match.id,
            roundName,
            picked,
            actualWinner,
            state.mode === "live" && !!actualWinner,
            hasBye,
          ),
        )
        .join("")}
      ${renderScoreline(players)}
      ${setWinnerButtons}
    </div>
  `;
}

function renderPlayer(player, matchId, roundName, picked, actualWinner, lockLive, byeMatch = false) {
  if (!player) {
    return `<div class="player disabled"><span>TBD</span></div>`;
  }
  if (player.id === "Bye") {
    return `<div class="player bye disabled"><span class="player-name"><span class="player-label">Bye</span></span></div>`;
  }
  const pickedThisPlayer = picked === player.id;
  const isPicked = state.mode !== "completed" && pickedThisPlayer;
  const isWinner = (state.mode === "completed" || state.mode === "live") && actualWinner === player.id;
  const isCorrect = state.mode === "live" && isPicked && actualWinner && actualWinner === player.id;
  const isIncorrectLive = state.mode === "live" && pickedThisPlayer && actualWinner && actualWinner !== player.id;
  const isIncorrectCompleted =
    state.mode === "completed" && pickedThisPlayer && actualWinner && actualWinner !== player.id;
  const isIncorrect = Boolean(isIncorrectLive || isIncorrectCompleted);
  const isDisabled = state.mode === "completed" || lockLive || state.isLocked;
  const score =
    state.mode !== "pre" && player.scores?.length
      ? `<span class="player-score">${player.scores
          .map((set) => `<span class="set-score">${set}</span>`)
          .join("")}</span>`
      : "";
  const seedLeft = player.seed ? `<span class="seed-badge">${escapeHtml(player.seed)}</span>` : "";
  return `
    <div class="player ${isPicked ? "selected" : ""} ${isWinner ? "winner" : ""} ${
      isCorrect ? "correct" : ""
    } ${isIncorrect ? "incorrect" : ""} ${isDisabled ? "disabled" : ""}"
      data-match="${matchId}" data-player="${player.id}" data-round="${roundName}">
      <span class="player-name">${seedLeft}<span class="player-label">${escapeHtml(player.name)}</span></span>
      <span class="player-meta">${score}</span>
    </div>
  `;
}

function renderScoreline(players) {
  return "";
}

function renderScores(rounds, results) {
  const roundPoints = getRoundPoints(rounds);
  const summary = rounds.map((round) => {
    const matches = round.matches;
    const correct = matches.filter((match) => {
      const picked = state.picks?.[round.name]?.[match.id];
      return picked && results[match.id] === picked;
    }).length;
    const points = correct * roundPoints[round.name];
    return { round: round.name, correct, points, total: matches.length };
  });

  const totalScore = summary.reduce((sum, row) => sum + row.points, 0);

  return `
    <h3>Your Score</h3>
    <p>Total points: <strong>${totalScore}</strong></p>
    <div class="score-board">
      ${Object.entries(roundPoints)
        .map(
          ([round, points]) => `
        <div class="score-pill">
          <span>${roundShort(round)}</span>
          <span>${points} pts</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="score-grid">
      ${summary
        .map(
          (row) => `
        <div class="score-card">
          <strong>${roundShort(row.round)}</strong>
          <p>${row.correct} correct · ${row.points} pts</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function hydrateStandings() {
  if (!state.leaderboard || !state.data) {
    state.standings = [];
    return;
  }
  const rounds = normalizeRounds(sortRounds(state.data.rounds));
  const results = getResultsMap(rounds);
  const roundPoints = getRoundPoints(rounds);
  // Exclude bye matches from scoring and accuracy — no real match was played.
  const totalMatches = rounds.reduce(
    (sum, round) => sum + round.matches.filter((m) => !isByeMatch(m)).length,
    0,
  );

  const rows = state.leaderboard.users.map((user) => {
    const picks = state.leaderboard.picks[user.id] || {};
    let score = 0;
    let correct = 0;
    let champion = "";

    rounds.forEach((round) => {
      round.matches.forEach((match) => {
        if (isByeMatch(match)) return; // No points for bye matches
        const picked = picks?.[round.name]?.[match.id];
        if (round.name === "Final" && picked) champion = picked;
        if (picked && results[match.id] === picked) {
          correct += 1;
          score += roundPoints[round.name];
        }
      });
    });

    const accuracy = totalMatches ? Math.round((correct / totalMatches) * 100) : 0;
    return {
      userId: user.id,
      name: user.name,
      score,
      correct,
      accuracy,
      champion,
      picks,
    };
  });

  rows.sort((a, b) => b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name));
  state.standings = rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

async function loadSeasonStandings() {
  if (!state.session || !state.activePoolId) return;
  if (dom.season) dom.season.innerHTML = "<p>Loading season standings…</p>";
  if (dom.season) dom.season.classList.add("active");
  dom.bracket.style.display = "none";
  dom.scores.classList.remove("active");
  dom.standings.classList.remove("active");
  dom.leaderboard.style.display = "none";

  const seasonData = await apiFetch(`/api/season-standings?pool=${encodeURIComponent(state.activePoolId)}`);
  if (!seasonData) {
    if (dom.season) dom.season.innerHTML = "<p>Failed to load season standings.</p>";
    return;
  }

  // Fetch draws for all tournaments in parallel (use cache)
  const drawPromises = seasonData.tournaments.map(async (t) => {
    if (state.seasonDrawCache[t.id]) return { id: t.id, draw: state.seasonDrawCache[t.id] };
    if (!t.drawUrl) return { id: t.id, draw: null };
    try {
      const resp = await fetchWithTimeout(
        `/api/draw?url=${encodeURIComponent(t.drawUrl)}&tournamentId=${encodeURIComponent(t.id)}`,
        15000,
      );
      if (!resp.ok) return { id: t.id, draw: null };
      const draw = await resp.json();
      state.seasonDrawCache[t.id] = draw;
      return { id: t.id, draw };
    } catch {
      return { id: t.id, draw: null };
    }
  });
  const drawResults = await Promise.all(drawPromises);
  const drawByTournament = Object.fromEntries(drawResults.map(({ id, draw }) => [id, draw]));

  // Compute scores per user per tournament
  const userScores = {};
  for (const user of seasonData.users) {
    userScores[user.id] = { name: user.name, total: 0, byTournament: {} };
  }

  for (const t of seasonData.tournaments) {
    const draw = drawByTournament[t.id];
    if (!draw || !draw.rounds?.length) continue;
    const rounds = normalizeRounds(sortRounds(draw.rounds));
    const results = getResultsMap(rounds);
    const roundPoints = {};
    let pts = 10;
    rounds.forEach((r) => { roundPoints[r.name] = pts; pts *= 2; });

    for (const user of seasonData.users) {
      const picks = seasonData.picks[t.id]?.[user.id] || {};
      let score = 0;
      rounds.forEach((round) => {
        round.matches.forEach((match) => {
          const picked = picks?.[round.name]?.[match.id];
          if (picked && results[match.id] === picked) score += roundPoints[round.name];
        });
      });
      userScores[user.id].byTournament[t.id] = score;
      userScores[user.id].total += score;
    }
  }

  const rows = Object.values(userScores).sort((a, b) => b.total - a.total);
  rows.forEach((row, i) => { row.rank = i + 1; });

  state.seasonData = { users: seasonData.users, tournaments: seasonData.tournaments, rows };
  if (dom.season) dom.season.innerHTML = renderSeasonStandings();
}

function renderSeasonStandings() {
  const { users, tournaments, rows } = state.seasonData || {};
  if (!rows || !rows.length) return "<h3>Season Standings</h3><p>No picks recorded yet.</p>";

  const myRow = rows.find((r) => r.name === state.session?.name);
  const tourCols = tournaments.map((t) => `<th>${escapeHtml(t.name.replace(/^[^A-Z]*/, "").split(" ").slice(0, 2).join(" ") || t.id)}</th>`).join("");

  const bodyRows = rows.map((row) => {
    const isMe = row.name === state.session?.name;
    const tourCells = tournaments.map((t) => `<td>${row.byTournament?.[t.id] ?? 0}</td>`).join("");
    return `<tr class="${isMe ? "standings-me" : ""}">
      <td>${row.rank}</td>
      <td>${escapeHtml(row.name)}${isMe ? " <span class='you-badge'>you</span>" : ""}</td>
      ${tourCells}
      <td><strong>${row.total}</strong></td>
    </tr>`;
  }).join("");

  return `
    <h3>Season Standings</h3>
    <p class="standings-meta">${rows.length} entries · Your rank: #${myRow?.rank || "-"} · ${tournaments.length} tournament${tournaments.length !== 1 ? "s" : ""}</p>
    <div class="standings-table-wrap">
      <table class="standings-table season-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            ${tourCols}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `;
}

function renderStandings(rounds, results) {
  if (!state.session || !state.standings.length) {
    return `
      <h3>Standings</h3>
      <p class="standings-meta">No entries yet for this tournament.</p>
    `;
  }
  const filtered = state.standings.filter((row) =>
    row.name.toLowerCase().includes(state.standingsQuery.toLowerCase()),
  );
  const pageSize = Number(state.standingsPageSize) || 25;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(state.standingsPage, totalPages);
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const myRow = state.standings.find((row) => row.userId === state.session.id);

  return `
    <h3>Standings</h3>
    <p class="standings-meta">${filtered.length.toLocaleString()} entries · Your place: #${myRow?.rank || "-"}</p>
    <div class="standings-toolbar">
      <input id="standings-search" type="text" value="${escapeHtml(state.standingsQuery)}" placeholder="Search player" />
      <select id="standings-page-size">
        ${[25, 50, 100].map((n) => `<option value="${n}" ${n === pageSize ? "selected" : ""}>${n} / page</option>`).join("")}
      </select>
    </div>
    <div class="standings-table-wrap">
      <table class="standings-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Entry</th>
            <th>Points</th>
            <th>Correct</th>
            <th>Accuracy</th>
            <th>Champion Pick</th>
            ${state.isLocked ? "<th></th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${pageRows
            .map(
              (row) => `
            <tr class="standings-row ${state.selectedEntryId === row.userId ? "selected" : ""}" data-entry-id="${row.userId}">
              <td>${row.rank}</td>
              <td>${escapeHtml(row.name)}${row.userId === state.session?.id ? " <span class='you-badge'>you</span>" : ""}</td>
              <td>${row.score}</td>
              <td>${row.correct}</td>
              <td>${row.accuracy}%</td>
              <td>${escapeHtml(row.champion || "-")}</td>
              ${state.isLocked ? `<td><button class="view-bracket-btn ghost" data-entry-id="${row.userId}">View bracket</button></td>` : ""}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="standings-pagination">
      <span>Page ${page} of ${totalPages}</span>
      <div class="pager-buttons">
        <button type="button" id="standings-prev" ${page <= 1 ? "disabled" : ""}>Prev</button>
        <button type="button" id="standings-next" ${page >= totalPages ? "disabled" : ""}>Next</button>
      </div>
    </div>
  `;
}

function bindStandingsEvents(rounds) {
  const search = document.getElementById("standings-search");
  const pageSize = document.getElementById("standings-page-size");
  const prev = document.getElementById("standings-prev");
  const next = document.getElementById("standings-next");

  search?.addEventListener("input", (event) => {
    state.standingsQuery = event.target.value;
    state.standingsPage = 1;
    render();
  });

  pageSize?.addEventListener("change", (event) => {
    state.standingsPageSize = Number(event.target.value);
    state.standingsPage = 1;
    render();
  });

  prev?.addEventListener("click", () => {
    state.standingsPage = Math.max(1, state.standingsPage - 1);
    render();
  });

  next?.addEventListener("click", () => {
    state.standingsPage += 1;
    render();
  });

  document.querySelectorAll(".view-bracket-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const entryId = btn.dataset.entryId;
      if (!entryId) return;
      const entry = state.standings.find((row) => row.userId === entryId);
      if (!entry) return;
      state.selectedEntryId = entryId;
      state.mode = "completed";
      state.view = "bracket";
      state.picks = entry.picks || {};
      [...dom.toggle.querySelectorAll("button")].forEach((b) => {
        b.classList.toggle("active", b.dataset.mode === "completed");
        b.classList.toggle("live", false);
      });
      dom.viewSelect.value = "bracket";
      syncUrlState();
      render();
    });
  });
}

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const mode = params.get("mode");
  const tournamentId = params.get("tournament");
  if (view && ["bracket", "scores", "standings", "season"].includes(view)) {
    state.view = view;
    dom.viewSelect.value = view;
  }
  if (mode && ["pre", "live", "completed"].includes(mode)) {
    state.mode = mode;
    [...dom.toggle.querySelectorAll("button")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
      btn.classList.toggle("live", btn.dataset.mode === "live" && mode === "live");
    });
  }
  if (tournamentId) {
    const match = state.tournaments.find((t) => t.id === tournamentId);
    if (match) {
      state.tournament = match;
      dom.select.value = match.id;
      dom.loginTournament.value = match.id;
    }
  }
}

function syncUrlState() {
  if (!state.tournament) return;
  const params = new URLSearchParams(window.location.search);
  params.set("tournament", state.tournament.id);
  params.set("view", state.view);
  params.set("mode", state.mode);
  if (state.selectedEntryId) params.set("entry", state.selectedEntryId);
  else params.delete("entry");
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", next);
}

function renderLeaderboard(rounds, results) {
  if (!state.leaderboard) return "";
  const roundPoints = getRoundPoints(rounds);
  const rows = state.leaderboard.users.map((user) => {
    const picks = state.leaderboard.picks[user.id] || {};
    const score = rounds.reduce((sum, round) => {
      const correct = round.matches.filter((match) => {
        if (isByeMatch(match)) return false; // No points for bye matches
        const picked = picks?.[round.name]?.[match.id];
        return picked && results[match.id] === picked;
      }).length;
      return sum + correct * roundPoints[round.name];
    }, 0);
    return { name: user.name, score };
  });

  const ordered = rows.sort((a, b) => b.score - a.score);

  return `
    <h3>Leaderboard</h3>
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        ${ordered
          .map(
            (row) => `
          <tr>
            <td>${row.name}</td>
            <td>${row.score}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function savePicks({ submitted } = {}) {
  if (!state.session || !state.activePoolId) return;
  if (submitted !== undefined) state.submitted = submitted;
  const response = await fetch(
    `/api/picks?tournament=${encodeURIComponent(state.tournament.id)}&pool=${encodeURIComponent(state.activePoolId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.session.token}`,
      },
      body: JSON.stringify({ picks: state.picks, submitted: state.submitted }),
    },
  );
  if (response.status === 423) {
    state.isLocked = true;
    updateMeta();
    renderBracketActions();
    render();
    return;
  }
  if (!response.ok) return;

  const picksData = await apiFetch(
    `/api/picks?tournament=${state.tournament.id}&pool=${state.activePoolId}`,
    {
      method: "GET",
    },
  );
  state.isLocked = Boolean(picksData?.locked);
  state.submitted = Boolean(picksData?.submitted);
  state.leaderboard = await apiFetch(
    `/api/leaderboard?tournament=${state.tournament.id}&pool=${state.activePoolId}`,
    {
      method: "GET",
    },
  );
  if (state.leaderboard?.locked !== undefined) {
    state.isLocked = Boolean(state.leaderboard.locked);
  }
  hydrateStandings();
  updateMeta();
  renderBracketActions();
  render();
}

function sortRounds(rounds) {
  return [...rounds].sort((a, b) => roundOrder.indexOf(a.name) - roundOrder.indexOf(b.name));
}

function buildPreBracket(completedRounds) {
  const preRounds = [];
  completedRounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) {
      preRounds.push({
        name: round.name,
        matches: round.matches.map((match) => ({
          id: match.id,
          players: match.players,
        })),
      });
      return;
    }

    const prev = preRounds[roundIndex - 1];
    const matchCount = Math.ceil(prev.matches.length / 2);
    const matches = [];

    for (let i = 0; i < matchCount; i += 1) {
      const sourceA = prev.matches[i * 2]?.id;
      const sourceB = prev.matches[i * 2 + 1]?.id;
      const actualId = round.matches[i]?.id || `${round.name}-${i}`;
      matches.push({
        id: actualId,
        source: [sourceA, sourceB],
      });
    }

    preRounds.push({ name: round.name, matches });
  });

  return preRounds;
}

function buildLayout(rounds) {
  const matchHeight = 78;
  const gap = 16;
  const topOffset = 40;
  const baseMatches = rounds[0]?.matches.length || 0;
  const positions = {};
  const roundPositions = [];

  let currentPositions = Array.from(
    { length: baseMatches },
    (_, i) => i * (matchHeight + gap) + topOffset,
  );
  roundPositions.push(currentPositions);

  for (let r = 1; r < rounds.length; r += 1) {
    const prevPositions = roundPositions[r - 1];
    const matchCount = rounds[r].matches.length;
    const next = [];
    for (let i = 0; i < matchCount; i += 1) {
      const left = prevPositions[i * 2] ?? 0;
      const right = prevPositions[i * 2 + 1] ?? left;
      next.push((left + right) / 2);
    }
    roundPositions.push(next);
  }

  rounds.forEach((round, roundIndex) => {
    round.matches.forEach((match, matchIndex) => {
      positions[match.id] = roundPositions[roundIndex]?.[matchIndex] ?? 0;
    });
  });

  const totalHeight = baseMatches
    ? (matchHeight + gap) * (baseMatches - 1) + matchHeight + topOffset + 24
    : matchHeight;

  return { positions, totalHeight, matchHeight, gap };
}

function renderConnectors(round, roundIndex, rounds, layout) {
  const prevRound = rounds[roundIndex - 1];
  if (!prevRound) return "";
  const connectors = [];
  round.matches.forEach((match, matchIndex) => {
    const sourceA = prevRound.matches[matchIndex * 2];
    const sourceB = prevRound.matches[matchIndex * 2 + 1];
    if (!sourceA || !sourceB) return;
    const y1 = layout.positions[sourceA.id] + layout.matchHeight / 2;
    const y2 = layout.positions[sourceB.id] + layout.matchHeight / 2;
    const yMid = (y1 + y2) / 2;
    const top = Math.min(y1, y2);
    const height = Math.abs(y2 - y1);
    connectors.push(
      `<div class="connector connector-vertical" style="top:${top}px;height:${height}px;"></div>`,
    );
    connectors.push(
      `<div class="connector connector-horizontal" style="top:${yMid}px;"></div>`,
    );
  });
  return connectors.join("");
}

function resolvePrePlayers(match, roundIndex, rounds) {
  if (match.players) return match.players;
  const prevRound = rounds[roundIndex - 1];
  if (!prevRound) return [null, null];
  const [leftId, rightId] = match.source || [];
  const leftPick = state.picks?.[prevRound.name]?.[leftId];
  const rightPick = state.picks?.[prevRound.name]?.[rightId];
  return [findPlayerById(leftPick), findPlayerById(rightPick)];
}

function resolveCompletedPlayers(match, roundIndex, rounds, results) {
  if (match.players) return match.players;
  const prevRound = rounds[roundIndex - 1];
  if (!prevRound) return [null, null];
  const [leftId, rightId] = match.source || [];
  const leftWinner = results[leftId];
  const rightWinner = results[rightId];
  return [findPlayerById(leftWinner), findPlayerById(rightWinner)];
}

function normalizeRounds(rounds) {
  if (!rounds.length) return rounds;
  const baseMatches = rounds[0].matches.length;
  const expected = expectedRoundNames(baseMatches);
  const map = new Map(rounds.map((round) => [round.name, round]));
  const normalized = expected.map((name, index) => {
    const existing = map.get(name);
    if (existing) return existing;
    const matchCount = Math.max(1, Math.ceil(baseMatches / Math.pow(2, index)));
    const prevRound = index > 0 ? expected[index - 1] : null;
    const prevMatches = prevRound ? (map.get(prevRound)?.matches || []) : [];
    const matches = Array.from({ length: matchCount }, (_, i) => ({
      id: `${name}-placeholder-${i}`,
      source: [prevMatches[i * 2]?.id || "", prevMatches[i * 2 + 1]?.id || ""],
    }));
    return { name, matches };
  });
  for (let i = 1; i < normalized.length; i += 1) {
    const prev = normalized[i - 1];
    normalized[i].matches = normalized[i].matches.map((match, idx) => ({
      ...match,
      source:
        match.source && match.source.some(Boolean)
          ? match.source
          : [prev.matches[idx * 2]?.id || "", prev.matches[idx * 2 + 1]?.id || ""],
    }));
  }
  return normalized;
}

function expectedRoundNames(baseMatches) {
  const names = [];
  if (baseMatches > 32) names.push("Round of 128");
  if (baseMatches > 16) names.push("Round of 64");
  if (baseMatches > 8) names.push("Round of 32");
  if (baseMatches > 4) names.push("Round of 16");
  if (baseMatches > 2) names.push("Quarterfinals");
  if (baseMatches > 1) names.push("Semifinals");
  names.push("Final");
  return names;
}
function findPlayerById(id) {
  if (!id) return null;
  for (const round of state.data.rounds) {
    for (const match of round.matches) {
      const player = match.players.find((p) => p.id === id);
      if (player) return player;
    }
  }
  return null;
}

function isByeMatch(match) {
  return (match.players || []).some((p) => p?.id === "Bye");
}

function getResultsMap(rounds) {
  const results = {};

  // Step 1: Explicit winnerId from the draw data.
  rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.winnerId) results[match.id] = match.winnerId;
    });
  });

  // Step 2: Explicit bye inference — always applies regardless of match status.
  // A player facing "Bye" automatically advances; no real match was played.
  rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (results[match.id]) return;
      const players = match.players || [];
      const byeIdx = players.findIndex((p) => p?.id === "Bye");
      if (byeIdx !== -1) {
        const winner = players[1 - byeIdx];
        if (winner?.id) results[match.id] = winner.id;
      }
    });
  });

  // Step 3: Next-round inference — only when the tournament has actually started
  // (at least one match has an explicit winnerId). This prevents pre-published
  // draw data (e.g. Miami R64 matchups) from being misread as R128 results.
  const tournamentStarted = rounds.some((r) => r.matches.some((m) => m.winnerId));
  if (tournamentStarted) {
    for (let i = 0; i < rounds.length - 1; i++) {
      const nextRoundPlayers = new Set(
        rounds[i + 1].matches.flatMap((m) =>
          (m.players || []).map((p) => p?.id).filter(Boolean)
        )
      );
      rounds[i].matches.forEach((match) => {
        if (results[match.id]) return;
        const winner = (match.players || []).find(
          (p) => p?.id && p.id !== "Bye" && nextRoundPlayers.has(p.id)
        );
        if (winner) results[match.id] = winner.id;
      });
    }
  }

  // Step 4: Derive winner from set scores (mainly for the Final).
  for (const round of rounds) {
    for (const match of round.matches) {
      if (results[match.id]) continue;
      const [p1, p2] = match.players || [];
      if (!p1?.id || !p2?.id) continue;
      const s1 = (p1.scores || []).map(Number);
      const s2 = (p2.scores || []).map(Number);
      if (!s1.length || !s2.length) continue;
      let w1 = 0, w2 = 0;
      for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] > s2[i]) w1++;
        else if (s2[i] > s1[i]) w2++;
      }
      if (w1 !== w2) results[match.id] = w1 > w2 ? p1.id : p2.id;
    }
  }

  return results;
}

function getRoundPoints(rounds) {
  const points = {};
  let value = 10;
  rounds.forEach((round) => {
    points[round.name] = value;
    value *= 2;
  });
  const display = rounds
    .map((round) => `${roundShort(round.name)} ${points[round.name]}`)
    .join(" · ");
  dom.scoreRule.textContent = display;
  return points;
}

function roundShort(name) {
  if (name.includes("128")) return "R128";
  if (name.includes("64")) return "R64";
  if (name.includes("32")) return "R32";
  if (name.includes("16")) return "R16";
  if (name === "Quarterfinals") return "QF";
  if (name === "Semifinals") return "SF";
  if (name === "Final") return "F";
  return name;
}

function escapeHtml(input) {
  return String(input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUiText(input) {
  return String(input || "")
    .replace(/0\s*\|\|.*$/i, "")
    .replace(/tournaments\.length\s*>\s*0.*$/i, "")
    .replace(/[<>]/g, "")
    .trim();
}

init();
