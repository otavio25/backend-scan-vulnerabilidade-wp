const express = require('express')
const app = express()
const router = require('./router/router')

app.use(express.json())
app.use(router)

//servidor rodando
app.listen(3333, () => {
    console.log("Servidor rodando...")
})