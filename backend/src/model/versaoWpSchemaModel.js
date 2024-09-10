const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})

const versaoSchema =  new mongoose.Schema({
    version:  {
        number: String,
        status: String,
    },
    files: Array
})

const inforVersaoWp = mongoose.model('versaoWp', versaoSchema)

const host = process.env.HOST

const mongoDBURI = `mongodb://root:example@${host}:27017/`

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Versao WP Conectado com sucesso!')
}).catch((error) => {
    console.error("Problemas de conexão com o banco Versao WP: ", error.message)
})
mongoose.Promise = global.Promise

module.exports = inforVersaoWp