import { Router } from 'express'
import { controllers } from '../controllers'
import { authMiddlware } from '../middlewares/authMiddlware'

const router = Router()
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/users', controllers.getUser)
router.delete('/users/:id', controllers.deleteUser)
router.put('/users/:id', controllers.updateUser)

router.get('/system', authMiddlware, controllers.system)
router.get('/user', authMiddlware, controllers.user)

export default router