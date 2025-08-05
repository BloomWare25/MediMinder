import express from 'express'
import { authUser } from '../middleware/authUser.js'
import { addmeedication } from '../controller/index.js'
const router = express.Router() ;

router.route('/medications')
.post(
    authUser,
    addmeedication
)

export {
    router
}