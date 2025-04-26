import express from "express";
import { router } from "./routes/index.js"

const app = express() ;

app.use(express.json(
    {
        limit: '20kb',
    }
)) ;

app.use(express.urlencoded(
    {
        limit: '20kb',
        extended: true,
    }
))

app.use(express.static('./public')) ;

app.use("/api/v1/auth" , router) ;

export {app} ;