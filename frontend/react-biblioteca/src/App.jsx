import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Biblioteca from "./pages/Biblioteca"
import AdicionarLivros from "./pages/AdicionarLivros"
import EditarLivro from "./pages/EditarLivro"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/biblioteca" element={<Biblioteca />}/>
          <Route path="/biblioteca/adicionar-livro" element={<AdicionarLivros />}/>
          <Route path="/biblioteca/editar-livro/:id" element={<EditarLivro />}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
