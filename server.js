import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()


app.use(express.json())
app.use(cors())


const sql = mysql2.createPool({
    host: process.env.DB_HOST || "benserverplex.ddns.net",
    user: process.env.DB_USER || "alunos",
    password: process.env.DB_PASSWORD || "senhaAlunos",
    database: process.env.DB_NAME || "alunos_filmes03TB"
})

app.get("/", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_GuiQueiroz"

    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao buscar os filmes!" })
        }

        response.json(data)
    })
})

app.post("/create", (request, response) => {
    const { title, gender, duration, ageRating } = request.body

    const insertCommand = "INSERT INTO filmes_GuiQueiroz(title, gender, duration, ageRating) VALUES (?, ?, ?, ?)"

    sql.query(insertCommand, [title, gender, duration, ageRating], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao criar o filme!" })
        }

        response.status(201).json({
            message: "Filme criado com sucesso!"
        })
    })
})

app.delete("/delete/:id", (request, response) => {
    const { id } = request.params

    const deleteCommand = "DELETE FROM filmes_GuiQueiroz WHERE id=?"

    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao apagar o filme!" })
        }

        response.json({
            message: "Filme apagado com sucesso!"
        })
    })
})

app.put("/update/:id", (request, response) => {
    const { id } = request.params
    const { title, gender, duration, ageRating } = request.body

    const updateCommand = "UPDATE filmes_GuiQueiroz SET title = ?, gender = ?, duration = ?, ageRating = ? WHERE id = ?"

    sql.query(updateCommand, [title, gender, duration, ageRating, id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao atualizar o filme!" })
        }

        response.json({
            message: "Filme atualizado com sucesso!"
        })
    })
})


if (!process.env.VERCEL) {
    app.listen(3067, () => {
        console.log("Servidor rodando na porta 3067")
    })
}

export default app
