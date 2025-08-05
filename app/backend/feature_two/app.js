import express from 'express';
import mongoose from 'mongoose';

const app = express() ;

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));


export {
    app
}
