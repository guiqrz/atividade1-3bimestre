// URL do backend.
// Local: "http://localhost:3067" | Produção: URL do backend publicado na Vercel.
const API_URL = "https://atividade1-3bimestre-delta.vercel.app"

const form = document.getElementById("formCadastro")
const mensagem = document.getElementById("mensagem")

// Envia o novo filme para a API
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
        const resposta = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com status ${resposta.status}`)
        }

        window.location.href = "index.html"
    } catch (erro) {
        console.error("Erro ao cadastrar o filme:", erro)
        mensagem.textContent = "Não foi possível cadastrar o filme. Tente novamente."
        mensagem.classList.add("erro")
    }
})
