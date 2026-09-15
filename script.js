/**
 * GameTracker — tela de login (index.html).
 */
(function () {
  'use strict';

  if (Store.isLoggedIn()) {
    window.location.href = 'biblioteca/biblioteca.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email.trim() || !password) {
      loginError.textContent = 'Preencha e-mail e senha para continuar.';
      loginError.hidden = false;
      return;
    }

    if (Store.login(email, password)) {
      loginError.hidden = true;
      toast('Login realizado com sucesso!');
      window.location.href = 'biblioteca/biblioteca.html';
    } else {
      loginError.textContent = 'E-mail ou senha incorretos. Use o login de teste indicado no README.';
      loginError.hidden = false;
    }
  });

  document.getElementById('signup-link').addEventListener('click', (e) => {
    e.preventDefault();
    toast('MVP sem cadastro de novos usuários. Use o login de teste já preenchido no formulário.');
  });

  /* -----------------------------------------------------------
     Alternar visibilidade da senha ("olhinho")
     ----------------------------------------------------------- */
  const toggleBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-password');
  const iconEye = document.getElementById('icon-eye');
  const iconEyeOff = document.getElementById('icon-eye-off');

  toggleBtn.addEventListener('click', () => {
    const willShow = passwordInput.type === 'password';
    passwordInput.type = willShow ? 'text' : 'password';
    iconEye.hidden = willShow;
    iconEyeOff.hidden = !willShow;
    toggleBtn.setAttribute('aria-pressed', String(willShow));
    toggleBtn.setAttribute('aria-label', willShow ? 'Ocultar senha' : 'Mostrar senha');
  });
})();
