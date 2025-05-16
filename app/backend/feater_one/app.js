import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes/index.js"
import { updateTokenRouter } from "./routes/updateToken.route.js"
const app = express() ;

app.use(bodyParser.json());
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

// basic terminologies
app.use("/api/v1/auth" , router) ;

// update access and refresh token 
app.use("/api/v1/auth/refresh" , updateTokenRouter ) ;

export {app} ;