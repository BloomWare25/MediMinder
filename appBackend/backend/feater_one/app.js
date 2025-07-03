import express from "express";
import { router } from "./routes/index.js"
import { updateTokenRouter } from "./routes/updateToken.route.js"
import compression  from "compression" ;
import helmet  from "helmet" ;
import rateLimit from 'express-rate-limit'; 

const app = express() ;


// security middlewares added 
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity, adjust as needed
    crossOriginEmbedderPolicy: false, // Disable COEP for simplicity, adjust as needed
}))
app.use(compression({ threshold: 3072 })) ;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

app.use(limiter); // Apply globally



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