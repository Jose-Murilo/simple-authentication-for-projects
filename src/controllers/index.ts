import { Request, Response } from "express";
import { prisma } from "../database";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const controllers = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ message: "Preencha todos os dados" })

      const findUserByEmail = await prisma.user.findUnique({ where: { email } })
      if (findUserByEmail) return res.status(400).json({ message: "Esse e-mail já está em uso" })

      const hashPassword = await bcrypt.hash(password, 10)
      const createUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword
        }
      })

      const { password:_, ...user } = createUser
      return res.status(201).json(user)
    } catch (error) {
      console.log(error)
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ message: "Preencha todos os dados" })

      const findUserByEmail = await prisma.user.findUnique({ where: { email } })
      if (!findUserByEmail) return res.status(400).json({ message: "Email ou senha inválidos" })

      const verifyPassword = await bcrypt.compare(password, findUserByEmail.password)
      if (!verifyPassword)return res.status(400).json({ message: "Email ou senha inválidos" })

      const token = jwt.sign({ user: findUserByEmail.id }, process.env.JWT_PASSWORD ?? '', {
        expiresIn: 60
      })

      return res.json({
        user: findUserByEmail.id,
        token,
      })
    } catch (error) {
      console.log(error)
    }
    
  },

  async getUser(req: Request, res: Response) {
    const { id } = req.query

    if (id) {
      const listUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      })

      return res.json(listUser)
    }
    
    const listUsers = await prisma.user.findMany()
    return res.json(listUsers)
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params

    if (id) {
      await prisma.user.delete({
        where: { id: Number(id) }
      })

      return res.json(`Usuario de id ${id} foi deletado com sucesso`)
    }

    return res.status(400).json({ message: "Informe o id do usuario" })
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: "Preencha todos os dados" }) 

    if (id && email && password) {
      const hashPassword = await bcrypt.hash(password, 10)

      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          email,
          password: hashPassword
        }
      })
      return res.json(`Usuario de id ${id} foi atualizado com sucesso`)
    }

    return res.status(400).json({ message: "Informe o id do usuario" })
  },

  async system(req: Request, res: Response) {
    try {
      console.log(req.user)

      return res.json({ message: "Logado!" })
    } catch (error) {
     console.log(error)
    }
  }, 

  async user(req: Request, res: Response) {
    try {
      console.log(req.user)

      return res.json(req.user)
    } catch (error) {
     console.log(error)
    }
  }
}