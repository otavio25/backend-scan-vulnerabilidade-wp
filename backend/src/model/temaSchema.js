const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})

const temaSchema =  new mongoose.Schema({
    name: String,
    slug: String,
    version: String,
    preview_url: String,
    author: String, // Pode ser apenas uma string para o nome do autor
    screenshot_url: String,
    rating: Number,
    num_ratings: Number,
    downloaded: Number,
    last_updated: String,
    homepage: String,
    description: String,
    download_link: String,
    tags: Object,
})

const infoTema = mongoose.model('Temas', temaSchema)

const host = process.env.HOST

const mongoDBURI = `mongodb://root:example@${host}:27017/`

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('TemaWP Conectado com sucesso!')
}).catch((error) => {
    console.error("Problemas de conexão com o banco TemaWP: ", error.message)
})
mongoose.Promise = global.Promise

module.exports = infoTema