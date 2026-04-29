# Biblioteca Comunitária App

## 👥 Integrantes
- Julia Barcelos

## 📌 Descrição do Projeto
O Biblioteca Comunitária App é um aplicativo desenvolvido em React Native para auxiliar no gerenciamento de uma biblioteca comunitária.

O sistema permite cadastrar livros, usuários e controlar empréstimos e devoluções, facilitando o acesso à leitura e ajudando comunidades, escolas ou pequenos projetos sociais a organizarem seus acervos.

## 🎯 Problema Social
Muitas bibliotecas comunitárias, projetos sociais e pequenos espaços de leitura não possuem um sistema simples para controlar seus livros e empréstimos.

Isso pode gerar perda de livros, dificuldade para saber quais obras estão disponíveis e falta de organização no atendimento aos leitores.

## 💡 Solução
O aplicativo oferece uma solução simples, offline e de fácil uso para registrar livros, usuários e empréstimos, contribuindo para a organização e incentivo à leitura na comunidade.

## 🚀 Funcionalidades
- Cadastro de livros
- Listagem de livros
- Edição de livros
- Exclusão de livros
- Cadastro de usuários
- Listagem de usuários
- Exclusão de usuários
- Registro de empréstimos
- Registro de devoluções
- Controle automático da quantidade disponível de livros
- Bloqueio de exclusão de livros ou usuários com empréstimos em aberto

## 🛠 Tecnologias Utilizadas
- React Native
- Expo
- Expo Router
- SQLite
- expo-sqlite
- JavaScript

## 🗂 Estrutura Principal
- `app/index.js` - Tela inicial
- `app/livros.js` - Cadastro, listagem, edição e exclusão de livros
- `app/usuarios.js` - Cadastro, listagem e exclusão de usuários
- `app/emprestimos.js` - Registro de empréstimos e devoluções
- `database.js` - Configuração do banco SQLite e funções de persistência

## ▶️ Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/juliasbarcelos/biblioteca-comunitaria-app.git