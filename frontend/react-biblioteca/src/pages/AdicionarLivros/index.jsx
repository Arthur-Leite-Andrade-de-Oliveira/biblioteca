import { Link, useNavigate } from "react-router-dom"
import { useRef } from "react"
import api from "../../services/api.js"

function AdicionarLivros() {

    const numeroRef = useRef()
    const nomeRef = useRef()
    const genRef = useRef()
    const autorRef = useRef()
    const quantidadeRef = useRef()
    const navigate = useNavigate()



    async function handleSubmit(event) {

        event.preventDefault()

        try {
            const token = localStorage.getItem("token")

            const resp = await api.post("/livros",
                {
                    numero: numeroRef.current.value,
                    nome: nomeRef.current.value,
                    gen: genRef.current.value,
                    autor: autorRef.current.value,
                    qtd: quantidadeRef.current.value,
                }
                , {
                    headers: { Authorization: `Bearer ${token}` }
                })

            if (resp.status == 201) {
                alert(resp.data.msg)
            }
            navigate("/biblioteca")

        } catch (err) {
            if (err.response.status == 401) {
                navigate("/")
            }
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
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Adicionar Livro</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input ref={numeroRef} className="w-full rounded-md p-2" type="text" placeholder="numero" />

                    <input ref={nomeRef} className="w-full rounded-md p-2" type="text" placeholder="nome" />

                    <input ref={genRef} className="w-full rounded-md p-2" type="text" placeholder="genero" />

                    <input ref={autorRef} className="w-full rounded-md p-2" type="text" placeholder="autor" />

                    <input ref={quantidadeRef} className="w-full rounded-md p-2" type="text" placeholder="quantidade" />

                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer transition">
                        + Adicionar Livro
                    </button>
                </form>
            </div>
        </div >

    )
}

export default AdicionarLivros