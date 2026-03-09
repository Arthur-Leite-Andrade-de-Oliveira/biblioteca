import api from "../../services/api"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

function EditarLivro() {

    const [livro, setLivro] = useState()

    const [isEmprestado, setIsEmprestado] = useState(false)

    const emprestadoRef = useRef("")

    const numeroRef = useRef("")
    const nomeRef = useRef("")
    const genRef = useRef("")
    const autorRef = useRef("")

    const { id } = useParams()


    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)

    async function deletar() {
        try {
            const token = localStorage.getItem("token")

            await api.delete(`/livros/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            navigate("/biblioteca")

        } catch (err) {
            return alert(err.response.data.msg)
            setShowModal(false)
        }
    }


    useEffect(() => {
        async function getLivro() {

            try {
                const token = localStorage.getItem("token")

                const { data: l } = await api.get(`/livros/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setLivro(l)
                console.log(l.emprestimo)

                setIsEmprestado(l.status)
                emprestadoRef.current.value = l.emprestimo
                
            } catch (err) {
                if (err.response.status == 404) {
                    return alert(err.response.data.msg)
                }
                if (err.status == 401) {
                    navigate("/")
                }
            }
        }

        getLivro()
    }, [])

    async function handleSubmit(event) {

        event.preventDefault()
        try {
            const token = localStorage.getItem("token")

            await api.put(`/livros/${id}`, {
                numero: numeroRef.current.value,
                nome: nomeRef.current.value,
                gen: genRef.current.value,
                autor: autorRef.current.value,
                status: isEmprestado,
                emprestimo: isEmprestado ? emprestadoRef.current.value : "",
                img: livro.img
            }, { headers: { Authorization: `Bearer ${token}` } })

            navigate("/biblioteca")

        } catch (err) {
            return alert(err)
            navigate("/biblioteca")
        }

    }

    return (
        <div>

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-6xl font-bold">Biblioteca</h2>

                <Link to={"/biblioteca"} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer transition">
                    Retornar
                </Link>

            </div>

            <div className="max-w-md mx-auto mt-30 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Editar Livro</h2>
                <img
                    src={livro?.img.replace("http", "https") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsydjDBSfJ5Fc-Y1IXpDs_UVCmwDn9n5DNZw&s"}
                    alt={livro?.nome || "livro"}

                    className="w-36 h-full object-cover rounded-lg mx-auto"
                />

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input ref={numeroRef} defaultValue={livro?.numero || ""} className="w-full rounded-md p-2" type="text" placeholder="numero" />

                    <input ref={nomeRef} defaultValue={livro?.nome || ""} className="w-full rounded-md p-2" type="text" placeholder="nome" />

                    <input ref={genRef} defaultValue={livro?.gen || ""} className="w-full rounded-md p-2" type="text" placeholder="genero" />

                    <input ref={autorRef} defaultValue={livro?.autor || ""} className="w-full rounded-md p-2" type="text" placeholder="autor" />

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
                            className="w-full rounded-md p-2"
                            type="text"
                            placeholder="quem está com o livro"
                        />
                    )}

                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer transition">
                        Editar
                    </button>
                </form>

                <div className="py-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer transition"
                    >
                        Deletar
                    </button>

                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-lg font-bold mb-4">
                                    Deseja mesmo deletar?
                                </h2>

                                <div className="flex gap-4">
                                    <button
                                        onClick={deletar}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer transition"
                                    >
                                        Sim
                                    </button>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div >

    )
}

export default EditarLivro