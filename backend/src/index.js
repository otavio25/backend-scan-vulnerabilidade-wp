const express = require('express')
const app = express()
const router = require('./router/router')
const cors = require('cors')

app.use(cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json())
app.use(router)

//servidor rodando
app.listen(3333, () => {
    console.log("Servidor rodando...")
})