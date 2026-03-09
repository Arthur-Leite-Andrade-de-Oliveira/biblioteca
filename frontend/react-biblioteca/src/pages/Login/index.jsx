import { useRef } from "react"
import api from "../../services/api.js"
import { useNavigate } from "react-router-dom"

function Login() {
    const nameRef = useRef()
    const senhaRef = useRef()
    const navigate = useNavigate()

    async function handleSubmit(event) {

        event.preventDefault()

        try {
            const { data: {token:token} } = await api.post("/login", {
                nome: nameRef.current.value,
                senha: senhaRef.current.value
            })
            console.log(token)

            localStorage.setItem("token", token)
            console.log(localStorage.getItem("token"))

            console.log("API URL:", import.meta.env.API_URL)

            alert("")
            navigate("/biblioteca")

        } catch (err) {
            if (err.response.status === 400) {
                return alert(err.response.data.msg)
            }
            if (err.response.status === 404) {
                return alert(err.response.data.msg)
            }
        }
    }

    return (
        <div className="max-w-md mx-auto mt-50 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input ref={nameRef} type="text" placeholder="nome" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                <input ref={senhaRef} type="password" placeholder="senha" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400">Logar</button>
            </form>
        </div>
    )
}

export default Login