
import express from 'express';
import cors from 'cors';
const app = express();
import get from './src/main/network/free.js';

app.use(cors());

app.listen(8080, () => {console.log("coucou")})

app.get('/free' , async (req,res) => {
    res.send(await get());
} )
