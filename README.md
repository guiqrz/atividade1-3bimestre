# 🎬 Lista de Filmes — CRUD com Node.js + MySQL

Atividade 1 do 3º bimestre. API REST em **Express** conectada a um banco **MySQL**, com um frontend simples que consome a rota de listagem.

**Autor:** Guilherme Queiroz

---

## 📁 Estrutura do projeto

```
atv1-3bi/
├── frontend/          # Site estático (deploy separado na Vercel)
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js          # API Express (deploy do backend na Vercel)
├── rotas.http         # Requisições prontas pra testar (extensão REST Client)
├── vercel.json        # Configuração de build do backend
└── package.json
```

---

## 🗄️ Banco de dados

| Item | Valor |
|---|---|
| Host | `benserverplex.ddns.net` |
| Database | `alunos_filmes03TB` |
| Tabela | `filmes_GuiQueiroz` |

### Estrutura da tabela

```sql
CREATE TABLE filmes_GuiQueiroz (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    ageRating INT NOT NULL,
    PRIMARY KEY (id)
);
```

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INT | Chave primária, auto incremento |
| `title` | VARCHAR(255) | Nome do filme |
| `gender` | VARCHAR(255) | Gênero |
| `duration` | INT | Duração em minutos |
| `ageRating` | INT | Classificação indicativa (`0` = Livre) |

---

## 🔌 Rotas da API

| Método | Rota | O que faz | Corpo (JSON) |
|---|---|---|---|
| `GET` | `/` | Lista todos os filmes | — |
| `POST` | `/create` | Cadastra um filme | `title`, `gender`, `duration`, `ageRating` |
| `PUT` | `/update/:id` | Atualiza um filme | `title`, `gender`, `duration`, `ageRating` |
| `DELETE` | `/delete/:id` | Apaga um filme | — |

Exemplo de corpo:

```json
{
    "title": "Cidade de Deus",
    "gender": "Crime",
    "duration": 130,
    "ageRating": 18
}
```

---

## 💻 Rodando localmente

```bash
npm install
npm run dev
```

O servidor sobe em `http://localhost:3067`. Pra testar as rotas, abra o `rotas.http` no VS Code com a extensão **REST Client** e clique em *Send Request*.

O `frontend/script.js` já vem apontando pro backend local. Pra ver a página, abra o `frontend/index.html` com a extensão **Live Server** (com o `npm run dev` rodando em paralelo).

---

## ☁️ Deploy na Vercel

O backend e o frontend são **dois projetos separados** na Vercel.

### Backend

Importe o repositório, deixe o *Root Directory* na raiz e faça o deploy — o `vercel.json` cuida do resto. Opcionalmente, dá pra sobrescrever a conexão do banco por variáveis de ambiente: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### Frontend

Antes do deploy, troque o `API_URL` no topo do `frontend/script.js` pela URL do backend já publicado (sem barra no final):

```js
const API_URL = "https://seu-backend.vercel.app"
```

Depois importe o mesmo repositório num projeto novo, defina o *Root Directory* como `frontend` e o *Framework Preset* como **Other**.

---

## 🔗 Links

| O quê | Link |
|---|---|
| Repositório | _(preencher)_ |
| Backend na Vercel | https://atividade1-3bimestre-delta.vercel.app |
| Frontend na Vercel | _(preencher)_ |
