/**
 * GameTracker — tela da biblioteca (biblioteca.html).
 */
(function () {
  'use strict';

  if (!Store.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const STATUS_LABEL = { fila: 'Na fila', jogando: 'Jogando', platinado: 'Platinado' };

  let currentFilter = 'todos';

  const gamesGrid = document.getElementById('games-grid');
  const gamesCount = document.getElementById('games-count');
  const emptyState = document.getElementById('empty-state');
  const filterTabs = document.querySelectorAll('.tab');

  document.getElementById('new-game-btn').addEventListener('click', () => {
    window.location.href = '../jogo/jogo.html';
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    Store.logout();
    toast('Você saiu da sua conta.');
    window.location.href = '../index.html';
  });

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      filterTabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      renderLibrary();
    });
  });

  function starString(rating) {
    if (!rating) return '—';
    return '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);
  }

  function pluralize(n) {
    return n === 1 ? '1 jogo cadastrado' : `${n} jogos cadastrados`;
  }

  function renderLibrary() {
    const allGames = Store.getGames();
    gamesCount.textContent = pluralize(allGames.length);

    const games = currentFilter === 'todos'
      ? allGames
      : allGames.filter((g) => g.status === currentFilter);

    gamesGrid.innerHTML = '';

    if (games.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    const fragment = document.createDocumentFragment();
    games.forEach((game) => fragment.appendChild(renderCard(game)));
    gamesGrid.appendChild(fragment);
  }

  function renderCard(game) {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Editar ${game.title}`);

    const ratingText = starString(game.rating);
    const ratingClass = game.rating ? '' : ' empty';

    card.innerHTML = `
      <div class="game-thumb">
        <button type="button" class="game-delete" aria-label="Excluir ${escapeHtml(game.title)}">✕</button>
      </div>
      <p class="game-title">${escapeHtml(game.title)}</p>
      <p class="game-meta">${escapeHtml(game.platform)} · ${escapeHtml(game.genre)}</p>
      <div class="game-footer">
        <span class="status-badge ${game.status}">${STATUS_LABEL[game.status]}</span>
        <span class="game-rating${ratingClass}">${ratingText}</span>
      </div>
    `;

    const openEdit = () => {
      window.location.href = '../jogo/jogo.html?id=' + encodeURIComponent(game.id);
    };
    card.addEventListener('click', openEdit);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEdit(); }
    });

    card.querySelector('.game-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      confirmDelete(game.id, game.title);
    });

    return card;
  }

  async function confirmDelete(id, title) {
    const sure = await askConfirm(`Remover "${title}" da sua biblioteca? Essa ação não pode ser desfeita.`);
    if (!sure) return;
    Store.deleteGame(id);
    toast('Jogo removido.', true);
    renderLibrary();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderLibrary();
})();
