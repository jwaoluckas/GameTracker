# GameTracker — Rastreador de Backlog de Jogos

Sistema web para gerenciar sua biblioteca pessoal de jogos: registrar o que já jogou, o que está jogando e o que quer jogar, além de avaliar cada jogo com uma nota de 1 a 5 estrelas.

Projeto desenvolvido com base no protótipo do Figma ("Game Tracker – Telas UI") e no planejamento acadêmico do grupo (João Lucas, David Soares e Ian Képler).

## Login de acesso

Não há banco de dados nem cadastro de novos usuários nesta versão (MVP). O acesso é feito com um login genérico fixo, definido em `shared/data.js`:

- **E-mail:** `jogador@gametracker.com`
- **Senha:** `gametracker123`

Esses valores já vêm pré-preenchidos no formulário de login para facilitar os testes.

## Como rodar

Não há dependências para instalar. Duas formas de executar:

1. **Abrindo direto no navegador:** dê duplo clique em `index.html`.
2. **Com o servidor Node.js incluso** (recomendado, evita eventuais restrições do navegador ao abrir arquivos locais):
   ```bash
   node server.js
   ```
   Depois acesse `http://localhost:3000`.

## Stack

- **Frontend:** HTML5, CSS3 e JavaScript puro (sem frameworks/bibliotecas).
- **Backend:** não foi necessário — toda a persistência dos dados acontece no `localStorage` do navegador.
- **Servidor:** `server.js` é um servidor estático opcional em Node.js (sem dependências externas), usado só para servir os arquivos via HTTP.

## Funcionalidades (escopo do MVP)

- Login com credenciais fixas, com opção de mostrar/ocultar a senha digitada.
- Cadastro de novos jogos (título, plataforma, gênero, status e nota).
- Listagem dos jogos cadastrados, com filtro por status (Todos, Na fila, Jogando, Platinado).
- Atualização de status e nota pessoal (1 a 5 estrelas).
- Exclusão de um jogo da lista (pelo card na listagem ou pela tela de edição).
- Layout responsivo para desktop e mobile, seguindo o design do Figma.

## Estrutura de pastas

Cada tela do sistema é organizada em sua própria pasta, com `.html`, `.css` e `.js` próprios — com exceção da tela de Login, que é o `index.html` na raiz (obrigatório para ser a primeira página do site):

```
GameTracker/
├── index.html            # Tela de Login (primeira tela do sistema)
├── index.css             # Estilos exclusivos da tela de Login
├── script.js              # Lógica da tela de Login
├── biblioteca/
│   ├── biblioteca.html    # Tela da Biblioteca (listagem dos jogos)
│   ├── biblioteca.css     # Estilos exclusivos da tela da Biblioteca
│   └── biblioteca.js      # Lógica da tela da Biblioteca
├── jogo/
│   ├── jogo.html          # Tela de cadastro/edição (jogo.html?id=<id> para editar)
│   ├── jogo.css           # Estilos exclusivos da tela de cadastro/edição
│   └── jogo.js            # Lógica da tela de cadastro/edição
├── shared/
│   ├── base.css           # Design system extraído do Figma (tokens, botões, cards, campos, toasts, modal etc.), usado por todas as telas
│   ├── data.js             # Camada de dados (localStorage) e login genérico
│   └── ui.js                # Utilitários compartilhados entre telas: toasts e modal de confirmação
├── server.js              # Servidor estático opcional em Node.js
└── README.md
```

## Dados de teste

Ao abrir pela primeira vez, a biblioteca já vem com 6 jogos de exemplo (Hollow Knight, Elden Ring, Stardew Valley, Celeste, God of War Ragnarök e Hades), iguais aos do protótipo do Figma. Você pode editá-los, excluí-los ou adicionar novos jogos normalmente.
