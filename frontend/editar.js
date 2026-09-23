// URL do backend.
// Local: "http://localhost:3067" | Produção: URL do backend publicado na Vercel.
const API_URL = "https://atividade1-3bimestre-delta.vercel.app"

const form = document.getElementById("formEditar")
const mensagem = document.getElementById("mensagem")

// Pega o id do filme a editar pela query string (?id=)
const parametros = new URLSearchParams(window.location.search)
const id = parametros.get("id")

if (!id) {
    mensagem.textContent = "Filme não informado. Volte para a lista e escolha um filme para editar."
    mensagem.classList.add("erro")
    form.querySelector("button").disabled = true
}

// Preenche o formulário com os dados atuais do filme
async function carregarFilme() {
    try {
        const resposta = await fetch(API_URL)

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        const filmes = await resposta.json()
        const filme = filmes.find((item) => String(item.id) === String(id))

        if (!filme) {
            mensagem.textContent = "Filme não encontrado."
            mensagem.classList.add("erro")
            form.querySelector("button").disabled = true
            return
        }

        form.title.value = filme.title
        form.gender.value = filme.gender
        form.duration.value = filme.duration
        form.ageRating.value = filme.ageRating
    } catch (erro) {
        console.error("Erro ao carregar o filme:", erro)
        mensagem.textContent = "Não foi possível carregar os dados do filme."
        mensagem.classList.add("erro")
    }
}

// Envia as alterações para a API
form.addEventListener("submit", async (evento) => {
    evento.preventDefault()
    mensagem.textContent = ""
    mensagem.classList.remove("erro")

    const dados = {
        title: form.title.value.trim(),
        gender: form.gender.value.trim(),
        duration: Number(form.duration.value),
        ageRating: Number(form.ageRating.value)
    }

    try {
        const resposta = await fetch(`${API_URL}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        window.location.href = "index.html"
    } catch (erro) {
        console.error("Erro ao atualizar o filme:", erro)
        mensagem.textContent = "Não foi possível salvar as alterações. Tente novamente."
        mensagem.classList.add("erro")
    }
})

if (id) {
    carregarFilme()
}
