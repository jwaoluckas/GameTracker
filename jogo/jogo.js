/**
 * GameTracker — tela de adicionar/editar jogo (jogo.html).
 * Modo edição é identificado pela query string: jogo.html?id=<id>
 */
(function () {
  'use strict';

  if (!Store.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const editingId = new URLSearchParams(window.location.search).get('id');

  let selectedStatus = 'fila';
  let selectedRating = 0;

  const gameForm = document.getElementById('game-form');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const formHeaderTitle = document.getElementById('form-header-title');
  const deleteGameBtn = document.getElementById('delete-game-btn');
  const statusButtons = document.querySelectorAll('.status-btn');
  const starButtons = document.querySelectorAll('.star');

  const fieldTitle = document.getElementById('game-title');
  const fieldPlatform = document.getElementById('game-platform');
  const fieldGenre = document.getElementById('game-genre');

  function initForm() {
    let game = null;

    if (editingId) {
      game = Store.getGame(editingId);
      if (!game) {
        toast('Jogo não encontrado.', true);
        window.location.href = '../biblioteca/biblioteca.html';
        return;
      }
    }

    if (game) {
      formTitle.textContent = 'Editar Jogo';
      formSubtitle.textContent = 'Atualize os dados do jogo acompanhado';
      formHeaderTitle.textContent = 'Editar Jogo';
      fieldTitle.value = game.title;
      fieldPlatform.value = game.platform;
      fieldGenre.value = game.genre;
      selectedStatus = game.status;
      selectedRating = game.rating || 0;
      deleteGameBtn.hidden = false;
    } else {
      formTitle.textContent = 'Adicionar Jogo';
      formSubtitle.textContent = 'Preencha os dados do jogo que você quer acompanhar';
      formHeaderTitle.textContent = 'Novo Jogo';
      selectedStatus = 'fila';
      selectedRating = 0;
      deleteGameBtn.hidden = true;
    }

    paintStatus();
    paintStars();
  }

  statusButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedStatus = btn.dataset.status;
      paintStatus();
    });
  });

  function paintStatus() {
    statusButtons.forEach((btn) => {
      const active = btn.dataset.status === selectedStatus;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  starButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = Number(btn.dataset.value);
      selectedRating = value === selectedRating ? 0 : value; // clique repetido zera a nota
      paintStars();
    });
  });

  function paintStars() {
    starButtons.forEach((btn) => {
      const value = Number(btn.dataset.value);
      const filled = value <= selectedRating;
      btn.classList.toggle('filled', filled);
      btn.textContent = filled ? '★' : '☆';
      btn.setAttribute('aria-checked', value === selectedRating ? 'true' : 'false');
    });
  }

  function clearFieldErrors() {
    document.querySelectorAll('.field-error[data-error-for]').forEach((el) => (el.hidden = true));
    [fieldTitle, fieldPlatform, fieldGenre].forEach((el) => el.classList.remove('invalid'));
  }

  function showFieldError(input, message) {
    input.classList.add('invalid');
    const err = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (err) { err.textContent = message; err.hidden = false; }
  }

  function validateForm() {
    clearFieldErrors();
    let valid = true;

    if (!fieldTitle.value.trim()) {
      showFieldError(fieldTitle, 'Informe o título do jogo.');
      valid = false;
    }
    if (!fieldPlatform.value.trim()) {
      showFieldError(fieldPlatform, 'Informe a plataforma.');
      valid = false;
    }
    if (!fieldGenre.value.trim()) {
      showFieldError(fieldGenre, 'Informe o gênero.');
      valid = false;
    }
    return valid;
  }

  gameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: fieldTitle.value.trim(),
      platform: fieldPlatform.value.trim(),
      genre: fieldGenre.value.trim(),
      status: selectedStatus,
      rating: selectedRating,
    };

    if (editingId) {
      Store.updateGame(editingId, payload);
      toast('Jogo atualizado com sucesso!');
    } else {
      Store.addGame(payload);
      toast('Jogo adicionado com sucesso!');
    }
    window.location.href = '../biblioteca/biblioteca.html';
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.href = '../biblioteca/biblioteca.html';
  });
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../biblioteca/biblioteca.html';
  });

  deleteGameBtn.addEventListener('click', async () => {
    if (!editingId) return;
    const game = Store.getGame(editingId);
    const sure = await askConfirm(`Remover "${game.title}" da sua biblioteca? Essa ação não pode ser desfeita.`);
    if (!sure) return;
    Store.deleteGame(editingId);
    toast('Jogo removido.', true);
    window.location.href = '../biblioteca/biblioteca.html';
  });

  initForm();
})();
