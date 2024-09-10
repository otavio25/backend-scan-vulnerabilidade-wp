const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})

const pluginSchema = new mongoose.Schema({
    name: String,
    slug: String,
    version: String,
    author: String,
    author_profile: String,
    requires: String,
    tested: String,
    requires_php: String,
    requires_plugins: Array,
    compatibility: Array,
    rating: Number,
    ratings: Object,
    num_ratings: Number,
    support_threads: Number,
    support_threads_resolved: Number,
    downloaded: Number,
    last_updated: String,
    added: String,
    homepage: String,
    sections: Object,
    download_link: String,
    screenshots: Object,
    tags: Object,
    versions: Object,
    donate_link: String,
    contributors: Object
})

const Plugin = mongoose.model('Plugin', pluginSchema)

const host = process.env.HOST

const mongoDBURI = `mongodb://root:example@${host}:27017/`

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('PluginWP Conectado com sucesso!')
}).catch((error) => {
    console.error("Problemas de conexão com o banco PluginWP: ", error.message)
})
mongoose.Promise = global.Promise

module.exports = Plugin