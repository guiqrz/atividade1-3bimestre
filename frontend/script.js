// URL do backend.
// Local: "http://localhost:3067" | Produção: URL do backend publicado na Vercel.
const API_URL = "https://atividade1-3bimestre-delta.vercel.app"

const sectionFilmes = document.querySelector(".filmes")
const setaAnterior = document.querySelector(".seta-anterior")
const setaProxima = document.querySelector(".seta-proxima")
const botaoPesquisar = document.getElementById("botaoPesquisar")
const campoPesquisa = document.getElementById("campoPesquisa")

// Guarda a última lista vinda da API, para filtrar localmente sem nova requisição
let filmesCarregados = []

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

// Cores de tecido de poltrona (clara/escura), sorteadas por gênero
const PALETAS_POLTRONA = [
    ["#c2534a", "#7a2f28"],
    ["#4a8a7a", "#245248"],
    ["#7a6bc2", "#453a7a"],
    ["#c28a3f", "#7a5620"],
    ["#4a7ac2", "#28477a"],
    ["#8a4a6b", "#4a2438"]
]

/**
 * Escolhe um par de cores de tecido de forma determinística a partir do gênero,
 * assim o mesmo gênero sempre cai na mesma poltrona.
 * @param {string} texto
 * @returns {[string, string]} [cor clara, cor escura]
 */
function escolherPoltrona(texto) {
    const chave = String(texto ?? "")
    let hash = 0

    for (let i = 0; i < chave.length; i++) {
        hash = (hash * 31 + chave.charCodeAt(i)) >>> 0
    }

    return PALETAS_POLTRONA[hash % PALETAS_POLTRONA.length]
}

/**
 * Monta o card de um filme: poltrona de cinema com o cartão de conteúdo sentado nela.
 * @param {{id: number, title: string, gender: string, duration: number, ageRating: number}} filme
 * @returns {string} HTML do card
 */
function montarCardFilme(filme) {
    const classificacao = filme.ageRating > 0 ? `${filme.ageRating} anos` : "Livre"
    const [tecido, tecidoEscuro] = escolherPoltrona(filme.gender)

    return `
        <article class="filme" style="--acento: ${tecido}; --acento-escuro: ${tecidoEscuro}">
            <div class="poltrona">
                <div class="bracos"></div>
                <div class="encosto"></div>
                <div class="assento"></div>
            </div>
            <div class="cartao">
                <h2>${escaparHtml(filme.title)}</h2>
                <p>${escaparHtml(filme.gender)}</p>
                <p>${escaparHtml(filme.duration)} min · ${escaparHtml(classificacao)}</p>
                <div class="acoes">
                    <a class="botao" href="editar.html?id=${filme.id}">Editar</a>
                    <button class="botao botao-apagar" data-id="${filme.id}">Apagar</button>
                </div>
            </div>
        </article>
    `
}

// Renderiza uma lista de filmes na tela
function renderizarFilmes(filmes) {
    sectionFilmes.innerHTML = filmes.map(montarCardFilme).join("")
    centralizarSeCouber()
}

// Acessa a rota GET do backend e exibe os filmes na tela
async function buscarFilmes() {
    try {
        const resposta = await fetch(API_URL)

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        filmesCarregados = await resposta.json()
        renderizarFilmes(filmesCarregados)
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

// Centraliza os cards quando eles cabem todos na largura visível, sem precisar de scroll
function centralizarSeCouber() {
    const cabemTodos = sectionFilmes.scrollWidth <= sectionFilmes.clientWidth + 1
    sectionFilmes.style.justifyContent = cabemTodos ? "center" : "flex-start"
}

window.addEventListener("resize", centralizarSeCouber)

// Navega o carrossel pelas setas, rolando a largura de um card por vez
function rolarCarrossel(direcao) {
    const card = sectionFilmes.querySelector(".filme")
    const distancia = card ? card.getBoundingClientRect().width + 22 : 240

    sectionFilmes.scrollBy({ left: direcao * distancia, behavior: "smooth" })
}

setaAnterior.addEventListener("click", () => rolarCarrossel(-1))
setaProxima.addEventListener("click", () => rolarCarrossel(1))

// Abre/fecha o campo de pesquisa; ao fechar, limpa a busca e mostra tudo de novo
botaoPesquisar.addEventListener("click", () => {
    const abrindo = !campoPesquisa.classList.contains("aberta")

    campoPesquisa.classList.toggle("aberta", abrindo)
    botaoPesquisar.setAttribute("aria-expanded", String(abrindo))

    if (abrindo) {
        campoPesquisa.focus()
    } else {
        campoPesquisa.value = ""
        renderizarFilmes(filmesCarregados)
    }
})

// Filtra os filmes já carregados por título ou gênero, conforme o usuário digita
campoPesquisa.addEventListener("input", () => {
    const termo = campoPesquisa.value.trim().toLowerCase()

    if (!termo) {
        renderizarFilmes(filmesCarregados)
        return
    }

    const filtrados = filmesCarregados.filter((filme) =>
        String(filme.title).toLowerCase().includes(termo) ||
        String(filme.gender).toLowerCase().includes(termo)
    )

    renderizarFilmes(filtrados)
})

buscarFilmes()
