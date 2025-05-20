import express from "express";
import { router } from "./routes/index.js"
import { updateTokenRouter } from "./routes/updateToken.route.js"
import rateLimit from "express-rate-limit" 
const app = express() ;


const limitedReq = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limitedReq);
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