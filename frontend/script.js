// URL do backend.
// Local: "http://localhost:3067" | Produção: URL do backend publicado na Vercel.
const API_URL = "http://localhost:3067"

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

/**
 * Monta o card de um filme.
 * @param {{title: string, gender: string, duration: number, ageRating: number}} filme
 * @returns {string} HTML do card
 */
function montarCardFilme(filme) {
    const classificacao = filme.ageRating > 0 ? `${filme.ageRating} anos` : "Livre"

    return `
        <article class="filme">
            <h2>${escaparHtml(filme.title)}</h2>
            <p><strong>Gênero:</strong> ${escaparHtml(filme.gender)}</p>
            <p><strong>Duração:</strong> ${escaparHtml(filme.duration)} minutos</p>
            <p><strong>Classificação indicativa:</strong> ${escaparHtml(classificacao)}</p>
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

buscarFilmes()
