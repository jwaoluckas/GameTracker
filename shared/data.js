/**
 * GameTracker — camada de dados (sem backend/banco de dados).
 * Tudo é persistido no localStorage do navegador.
 */
const STORAGE_KEYS = {
  GAMES: 'gametracker_games',
  AUTH: 'gametracker_auth',
};

// Credenciais fixas do login genérico (não há cadastro de usuários no MVP).
const GENERIC_LOGIN = {
  email: 'jogador@gametracker.com',
  password: 'gametracker123',
};

const SEED_GAMES = [
  { id: 'g1', title: 'Hollow Knight', platform: 'PC', genre: 'Metroidvania', status: 'platinado', rating: 5 },
  { id: 'g2', title: 'Elden Ring', platform: 'PS5', genre: 'RPG de Ação', status: 'jogando', rating: 4 },
  { id: 'g3', title: 'Stardew Valley', platform: 'Switch', genre: 'Simulação', status: 'fila', rating: 0 },
  { id: 'g4', title: 'Celeste', platform: 'PC', genre: 'Plataforma', status: 'platinado', rating: 5 },
  { id: 'g5', title: 'God of War Ragnarök', platform: 'PS5', genre: 'Ação/Aventura', status: 'jogando', rating: 4 },
  { id: 'g6', title: 'Hades', platform: 'Switch', genre: 'Roguelike', status: 'fila', rating: 0 },
];

const Store = {
  getGames() {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    if (!raw) {
      this.saveGames(SEED_GAMES);
      return [...SEED_GAMES];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Falha ao ler jogos do localStorage, restaurando dados iniciais.', e);
      this.saveGames(SEED_GAMES);
      return [...SEED_GAMES];
    }
  },

  saveGames(games) {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  },

  addGame(game) {
    const games = this.getGames();
    const newGame = { ...game, id: 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
    games.push(newGame);
    this.saveGames(games);
    return newGame;
  },

  updateGame(id, updates) {
    const games = this.getGames();
    const idx = games.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    games[idx] = { ...games[idx], ...updates };
    this.saveGames(games);
    return games[idx];
  },

  deleteGame(id) {
    const games = this.getGames().filter((g) => g.id !== id);
    this.saveGames(games);
  },

  getGame(id) {
    return this.getGames().find((g) => g.id === id) || null;
  },

  isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  login(email, password) {
    const ok = email.trim().toLowerCase() === GENERIC_LOGIN.email
      && password === GENERIC_LOGIN.password;
    if (ok) localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return ok;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
};
