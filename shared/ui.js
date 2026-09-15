/**
 * GameTracker — utilitários de UI compartilhados entre as páginas:
 * toasts e o modal de confirmação (substitui window.confirm).
 * Expõe window.toast() e window.askConfirm() para as páginas usarem.
 */
(function () {
  'use strict';

  function toast(message, isDanger) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast' + (isDanger ? ' danger' : '');
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .3s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 2600);
  }
  window.toast = toast;

  // O modal de confirmação só existe nas páginas com ações destrutivas
  // (biblioteca.html e jogo.html) — na tela de login ele é omitido.
  const confirmModal = document.getElementById('confirm-modal');
  if (!confirmModal) return;

  const confirmModalTitle = document.getElementById('confirm-modal-title');
  const confirmModalOk = document.getElementById('confirm-modal-ok');
  const confirmModalCancel = document.getElementById('confirm-modal-cancel');
  let confirmResolve = null;

  function closeConfirm(result) {
    confirmModal.hidden = true;
    if (confirmResolve) { confirmResolve(result); confirmResolve = null; }
  }

  window.askConfirm = function askConfirm(message) {
    confirmModalTitle.textContent = message;
    confirmModal.hidden = false;
    confirmModalOk.focus();
    return new Promise((resolve) => { confirmResolve = resolve; });
  };

  confirmModalOk.addEventListener('click', () => closeConfirm(true));
  confirmModalCancel.addEventListener('click', () => closeConfirm(false));
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) closeConfirm(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !confirmModal.hidden) closeConfirm(false);
  });
})();
