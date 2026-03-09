import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import livros from "../models/livros.js"

dotenv.config()

const router = express.Router()

router.use(express.json());

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conectado")
    } catch (err) {

    }
}

conn()

router.put("/livros/:id", async (req, res) => {
    try {

        const id = req.params.id
        console.log(id)

        let {numero,nome,gen,autor,status,emprestimo,img} = req.body

        await livros.findByIdAndUpdate(id,{
            numero,
            nome,
            gen,
            autor,
            status,
            emprestimo,
            img,
        })


        res.status(200).json({msg: "Livro atualizado!"});

    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente: ' + err.message })
    }
})

router.delete("/livros/:id", async (req, res) => {
    try {
        const id = req.params.id

        const livro = await livros.findByIdAndDelete(id)

        res.status(200).json(livro);
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente: ' + err.message })
    }
})


router.get("/livros", async (req, res) => {
    try {
        const livro = await livros.find()

        res.status(200).json(livro);
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente: ' + err.message })
    }
})

router.get("/livros/:id", async (req, res) => {
    try {
        const livro = await livros.findById(req.params.id)

        if (!livro) {
            return res.status(404).json({ msg: "Livro não encontrado" })
        }

        res.status(200).json(livro);
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente: ' + err.message })
    }
})

router.post("/livros", async (req, res) => {
    try {
        const { numero, nome, gen, autor, qtd } = req.body
        const status = false
        const emprestimo = ""

        if (!numero || !nome || !gen || !autor || !qtd) {
            return res.status(402).json({ msg: 'esqueceu de preencher alguns dos campos, tente novamente' })
        }
        console.log(nome)


        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${nome}&key=${process.env.GOOGLE_API_KEY}`);

        const data = await response.json();

        const livro = data.items[0];

        const img = livro.volumeInfo.title === nome? livro.volumeInfo.imageLinks.thumbnail.replace("zoom=1", "zoom=4") : "";

        const novosLivros = []

        for (let i = 0; i < qtd; i++) {
            novosLivros.push({
                numero,
                nome,
                gen,
                autor,
                status,
                emprestimo,
                img,
            })
        }
        await livros.insertMany(novosLivros)

        console.log("livros Criados")

        res.status(201).json({msg: "Livros criados!"})

    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente: ' + err.message })
    }
})


export default router