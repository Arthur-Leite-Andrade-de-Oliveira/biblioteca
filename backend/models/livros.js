import mongoose from "mongoose"

const livroSchema = new mongoose.Schema({
    numero: Number,
    nome: String,
    gen: String,
    autor: String,
    status: Boolean,
    emprestimo: String,
    img: String
});

export default mongoose.model('livros',livroSchema);