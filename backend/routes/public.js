import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import usuario from "../models/usuario.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

dotenv.config()

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

router.use(express.json());

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conectado")
    } catch (err) {

    }
}

conn()

router.post("/usuario", async (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({ msg: "Nome e senha são obrigatórios" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(senha, salt)

        const novoUsuario = await usuario.create({
            nome,
            senha: hashPassword,
        })

        res.status(201).json({
            id: novoUsuario._id,
            nome: novoUsuario.nome
        })

    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor tente novamente' })
    }
})

router.post("/login", async (req, res) => {
    try {
        const userInfo = req.body

        const user = await usuario.findOne({ nome: userInfo.nome }).exec() 

        if (!user) {
            console.log("Usuário não encontrado")
            return res.status(404).json({ msg: 'Usuário não encontrado' })
        }

        const isMatch = await bcrypt.compare(userInfo.senha, user.senha)

        if (!isMatch) {
            return res.status(400).json({ msg: 'Senha incorreta' })
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({ token })

    } catch (err) {
        res.status(500).json({ msg: `Erro no servidor: ${err}` })
    }
})

export default router