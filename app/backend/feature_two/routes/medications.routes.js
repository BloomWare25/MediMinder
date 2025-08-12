import express from 'express'
import multer from 'multer';
import { authUser } from '../middleware/authUser.js'
import { addmedication , getUserMed } from '../controller/index.js'
import { checkCachedData } from '../utils/checkCach.js'
const router = express.Router() ;

const upload = multer()
router.route('/medications')
.post(
    upload.none(),
    authUser,
    addmedication
)
router.route('/getMed')
.get(
    upload.none(),
    authUser,
    checkCachedData,
    getUserMed
)
export {
    router
}