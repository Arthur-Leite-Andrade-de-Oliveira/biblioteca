import mongoose from "mongoose"

const usuarioSchema = new mongoose.Schema({
    nome: String,
    senha: String,
});

export default mongoose.model('usuarios',usuarioSchema);