import express from 'express'
import { prisma } from './database'
import router from './routes'
import 'dotenv/config'
import cors from 'cors'

const app = express()

app.listen(3333, () => console.log('Servidor rodando'))

app.use(express.json());

app.use(cors());

app.use(router)

prisma.$connect()
  .then(() => console.log('Conexão feita com sucesso'))
  .catch((error) => console.log(error))