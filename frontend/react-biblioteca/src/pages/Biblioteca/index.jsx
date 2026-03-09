import api from "../../services/api"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

function Biblioteca() {
    const [l, setLivros] = useState([])

    const [filtroNumero, setFiltroNumero] = useState("")
    const [filtroNome, setFiltroNome] = useState("")
    const [filtroAutor, setFiltroAutor] = useState("")
    const [filtroGen, setFiltroGen] = useState("")
    const [filtroEmprestado, setFiltroEmprestado] = useState("")

    const [isEmprestado, setIsEmprestado] = useState(false)

    const emprestadoRef = useRef()

    const navigate = useNavigate()




    useEffect(() => {
        async function loadLivros() {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    navigate("/")
                    return
                }

                console.log("TOKEN:", localStorage.getItem("token"))

                const { data: livros } = await api.get("/livros", {
                    headers: { Authorization: `Bearer ${token}` }
                })

                console.log(livros)


                setLivros(Array.isArray(livros) ? livros : [])
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/")
                }
            }
        }
        console.log(l)

        loadLivros()
    }, [])



    return (
        <div>
            <div className="flex justify-between items-center mb-4">

                <h2 className="text-6xl font-bold">Biblioteca</h2>

                <Link to={"/biblioteca/adicionar-livro"} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer transition">
                    + Adicionar Livro
                </Link>
            </div>

            <div className="max-w-3/4 max-h-5xl mt-20 mx-auto">

                <form className="bg-gray-100 w-full p-2 rounded-md grid grid-cols-5 gap-3">

                    <input value={filtroNumero} onChange={(e) => setFiltroNumero(e.target.value)} className="w-full rounded-md p-2" type="text" placeholder="numero" />

                    <input value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} className="w-full rounded-md p-2" type="text" placeholder="nome" />

                    <input value={filtroGen} onChange={(e) => setFiltroGen(e.target.value)} className="w-full rounded-md p-2" type="text" placeholder="genero" />

                    <input value={filtroAutor} onChange={(e) => setFiltroAutor(e.target.value)} className="w-full rounded-md p-2" type="text" placeholder="autor" />

                    <div className="flex items-center gap-2">
                        <span>Emprestado</span>
                        <input
                            type="checkbox"
                            checked={isEmprestado}
                            onChange={(e) => setIsEmprestado(e.target.checked)}
                        />
                    </div>

                    {isEmprestado && (
                        <input
                            ref={emprestadoRef}
                            value={filtroEmprestado} onChange={(e) => setFiltroEmprestado(e.target.value)}
                            className="w-full rounded-md p-2"
                            type="text"
                            placeholder="quem está com o livro"
                        />
                    )}

                </form>

                <div className="mt-7 w-full bg-gray-300 rounded-2xl h-170 overflow-y-auto p-4">

                    <ul className="grid grid-cols-6 gap-7">
                        {Array.isArray(l) && l.filter((livro) => {
                            return (
                                String(livro.numero || "").toLowerCase().includes(filtroNumero.toLowerCase()) &&
                                (livro.nome || "").toLowerCase().includes(filtroNome.toLowerCase()) &&
                                (livro.autor || "").toLowerCase().includes(filtroAutor.toLowerCase()) &&
                                (livro.gen || "").toLowerCase().includes(filtroGen.toLowerCase()) &&
                                (!isEmprestado || livro.status === true) &&
                                (livro.emprestimo || "").toLowerCase().includes(filtroEmprestado.toLowerCase())
                            )
                        }).map((livro) => (
                            <Link key={livro._id} className="relative w-40 cursor-pointer group" to={`/biblioteca/editar-livro/${livro._id}`}>
                                <li >
                                    {livro.img != "" && (
                                        <img
                                            src={livro?.img.replace("http", "https")}
                                            alt={livro.nome}
                                            className="w-full h-full object-cover rounded-lg"
                                        />)}

                                    <p className="text-center">{livro.nome}</p>

                                    {livro.status && (
                                        <div className="absolute inset-0 bg-red-500/40 rounded-lg flex items-center justify-center text-white font-bold mt-auto">
                                            <p className="text-center">Livro com: {livro.emprestimo}</p>
                                        </div>
                                    )}

                                    {livro.status === false && (
                                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center text-white font-bold">
                                            Livre
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold">
                                        Ver detalhes
                                    </div>

                                </li>
                            </Link>
                        ))}
                    </ul>

                </div>

            </div>


        </div >

    )
}

export default Biblioteca