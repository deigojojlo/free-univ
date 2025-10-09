
import express from 'express';
const app = express();
import get from './src/main/network/free.js';

app.listen(8080, () => {console.log("coucou")})

app.get('/free' , async (req,res) => {
    res.send(await get());
} )
