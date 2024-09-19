const express = require('express')
const app = express()
const router = require('./router/router')
const cors = require('cors')

app.use(cors({
    //origin: 'http://localhost:4200', // Permite apenas essa origem
    methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));
app.use(express.json())
app.use(router)

//servidor rodando
app.listen(3333, () => {
    console.log("Servidor rodando...")
})