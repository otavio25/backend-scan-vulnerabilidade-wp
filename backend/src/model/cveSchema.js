const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})

const cveSchema = new mongoose.Schema ({
    _id: String,
    containers: Object,
    cveMetadata:Object,
    dataType: String,
    dataVersion: String
})

cveSchema.index({ 'containers.cna.descriptions.value': 'text' })

const cve = mongoose.model('CVE', cveSchema)

const host = process.env.HOST

const mongoDBURI = `mongodb://root:example@${host}:27017/`

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('CVE Conectado com sucesso!')
}).catch((error) => {
    console.error("Problemas de conexão com o banco CVE: ", error.message)
})
mongoose.Promise = global.Promise

module.exports = cve