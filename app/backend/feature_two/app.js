import express from 'express'
import { router } from './routes/medications.routes.js'

const app = express() ;

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use('/api/v2' , router);


export {
    app
}
