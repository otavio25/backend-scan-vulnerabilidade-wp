const axios = require('axios')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const model = require('../model/pluginSchemaModel')
const obterVersaoPluginsWp = require('../obterVersaoPluginsWp')
const scanVulnerabilidadePlugin = require('../scanVulnerabilidadePlugin')
dotenv.config({path: '.env' })

module.exports = {
    postInfoPlugins : async(req, res, urlFromFunc = null)=>{
        try {
            const {url} = req.body
            let plugins = await obterVersaoPluginsWp(url)
            let objetoInfoPlugins = {}
            await Promise.all(
                plugins.map(async(plugin) => {
                    try {
                        let infoPlugin = await model.findOne({"slug": plugin.nomePlugin, "version": plugin.versaoPlugin})
                        if(!infoPlugin){
                            const repostaApi = await axios.get(`https://api.wordpress.org/plugins/info/1.0/${plugin.nomePlugin}.json`)
                            const documento = repostaApi.data
                            await model.updateOne({slug: plugin.nomePlugin}, documento, { upsert: true})
                            infoPlugin = documento
                        }
                        const propriedadesDesejadas = propriedadesDesejadasPlugins(infoPlugin, plugin)
                        const vulnerabilidadePlugin = await scanVulnerabilidadePlugin(propriedadesDesejadas)
                        propriedadesDesejadas.vulnerabilities = vulnerabilidadePlugin
                        objetoInfoPlugins[plugin.nomePlugin] = propriedadesDesejadas
                    } catch (err) {
                        if (err.response && err.response.status === 404) {
                            // Ignorar o erro 404 silenciosamente
                            console.log(`Plugin não encontrado: ${plugin.nomePlugin} (Erro 404)`);
                            infoPlugin = null;
                        } else {
                            // Caso seja outro tipo de erro, pode logar ou tratar de outra forma
                            console.error(`Erro ao buscar informações do plugin ${plugin.nomePlugin}: ${err.message}`);
                        }
                    }
                })
            )
            console.log({plugins: objetoInfoPlugins})
            return res.status(200).json({plugins: objetoInfoPlugins})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("Erro no servidor: ", error.message)
        }
    }
}

function propriedadesDesejadasPlugins(infoPlugin, plugin){
    const desatualizado = plugin.versaoPlugin != infoPlugin.version

    if(desatualizado){
        if (require.main === module) {
            console.log(`Plugin ${plugin.nomePlugin} (${plugin.versaoPlugin}) está desatualizada, assim que possível atualizar para a ${infoPlugin.version} sendo ${infoPlugin.version} a versão latest`)
        }
    }
    return {
        name: infoPlugin.name,
        slug: infoPlugin.slug,
        last_updated: infoPlugin.last_updated,
        version: {
            number: plugin.versaoPlugin
        },
        added: infoPlugin.added,
        outdated: desatualizado,
        latest_version: infoPlugin.version
    }
}