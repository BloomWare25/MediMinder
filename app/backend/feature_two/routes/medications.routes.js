import express from 'express'
import multer from 'multer';
import { authUser } from '../middleware/authUser.js'
import { addmeedication } from '../controller/index.js'
const router = express.Router() ;

const upload = multer()
router.route('/medications')
.post(
    upload.none(),
    authUser,
    addmeedication
)

export {
    router
}