import { NextFunction, Request, Response } from "express";
import { prisma } from "../database";
import jwt from 'jsonwebtoken'

type JwtPayload = {
  user: number
}

export async function authMiddlware(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ message: "Informe seu token" })

    const token = authorization.split(" ")[1]
    const { user: id } = jwt.verify(token, process.env.JWT_PASSWORD ?? '') as JwtPayload
    
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(400).json({ message: "E-mail ou senha inválidos" })
    
    const { password: _, ...userLogged } = user
    req.user = userLogged

    next()
  } catch (error) {
   return res.status(401).json({ message: "Informe um token válido" }) 
  }
}