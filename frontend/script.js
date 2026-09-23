// URL do backend.
// Local: "http://localhost:3067" | Produção: URL do backend publicado na Vercel.
const API_URL = "https://atividade1-3bimestre-delta.vercel.app"

const sectionFilmes = document.querySelector(".filmes")

/**
 * Escapa caracteres especiais antes de jogar o texto no HTML,
 * evitando que um título vindo do banco quebre a página (XSS).
 * @param {unknown} texto valor cru vindo da API
 * @returns {string} texto seguro para interpolar no template
 */
function escaparHtml(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (caractere) => {
        const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
        return mapa[caractere]
    })
}

// Paletas de gradiente vibrante, no estilo "pôster", sorteadas por gênero
const PALETAS_GRADIENTE = [
    "linear-gradient(160deg, #ff9a5a 0%, #c23a6b 60%, #4a1e5c 100%)",
    "linear-gradient(160deg, #4fd1c5 0%, #2b6f7a 60%, #14202e 100%)",
    "linear-gradient(160deg, #a78bfa 0%, #6d3fc7 60%, #241946 100%)",
    "linear-gradient(160deg, #fbbf24 0%, #d9622b 60%, #3a1a1a 100%)",
    "linear-gradient(160deg, #34d399 0%, #1f7a5c 60%, #0f2f28 100%)",
    "linear-gradient(160deg, #60a5fa 0%, #3b4fc7 60%, #1a1a4a 100%)"
]

/**
 * Escolhe um gradiente de forma determinística a partir do gênero,
 * assim o mesmo gênero sempre cai na mesma paleta.
 * @param {string} texto
 * @returns {string} gradiente CSS
 */
function escolherGradiente(texto) {
    const chave = String(texto ?? "")
    let hash = 0

    for (let i = 0; i < chave.length; i++) {
        hash = (hash * 31 + chave.charCodeAt(i)) >>> 0
    }

    return PALETAS_GRADIENTE[hash % PALETAS_GRADIENTE.length]
}

/**
 * Monta o card de um filme, com botões de editar e apagar.
 * @param {{id: number, title: string, gender: string, duration: number, ageRating: number}} filme
 * @returns {string} HTML do card
 */
function montarCardFilme(filme) {
    const classificacao = filme.ageRating > 0 ? `${filme.ageRating} anos` : "Livre"
    const gradiente = escolherGradiente(filme.gender)

    return `
        <article class="filme" style="--gradiente: ${gradiente}">
            <h2>${escaparHtml(filme.title)}</h2>
            <p>${escaparHtml(filme.gender)}</p>
            <p>${escaparHtml(filme.duration)} min · ${escaparHtml(classificacao)}</p>
            <div class="acoes">
                <a class="botao" href="editar.html?id=${filme.id}">Editar</a>
                <button class="botao botao-apagar" data-id="${filme.id}">Apagar</button>
            </div>
        </article>
    `
}

// Acessa a rota GET do backend e exibe os filmes na tela
async function buscarFilmes() {
    try {
        const resposta = await fetch(API_URL)

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        const filmes = await resposta.json()

        sectionFilmes.innerHTML = filmes.map(montarCardFilme).join("")
    } catch (erro) {
        // Falha aparece só no console, sem poluir a tela do usuário.
        console.error("Erro ao buscar os filmes:", erro)
    }
}

// Apaga um filme pelo id, pedindo confirmação antes
async function apagarFilme(id) {
    const confirmou = confirm("Tem certeza que deseja apagar este filme?")
    if (!confirmou) return

    try {
        const resposta = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        buscarFilmes()
    } catch (erro) {
        console.error("Erro ao apagar o filme:", erro)
        alert("Não foi possível apagar o filme. Tente novamente.")
    }
}

// Delegação de evento: captura clique em qualquer botão de apagar dentro da lista
sectionFilmes.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-apagar")
    if (!botao) return

    apagarFilme(botao.dataset.id)
})

buscarFilmes()
