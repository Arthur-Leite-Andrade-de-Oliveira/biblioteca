import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next)=>{
    
    const token = req.headers.authorization?.replace("Bearer ","")||""


    if(!token){
        return res.status(404).json({msg: "Acesso Negado"})
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET)

        req._id = decoded.id

    }catch(err){
        return res.status(401).json({ msg: 'Token Expirado' })
    }

    next()
}

export default auth