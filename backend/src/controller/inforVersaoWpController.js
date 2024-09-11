const axios = require("axios");
const mongoose = require("mongoose");
const obterVersaoWordPress = require("../obterVersaoWP");
const model = require("../model/versaoWpSchemaModel");

module.exports = {
    postInforVersaoWordPress : async (req, res, urlFromFunc = null)=>{
        try {
            const {versaoWp} = req.body
            const url = req.body.url || urlFromFunc;
            let versao
            let hashFile = []
            let versaoExistente
            if(versaoWp){
                versao = versaoWp.version
                hashFile = [{name: versaoWp.name, hashMD5: versaoWp.hashMD5}]
                versaoExistente = await model.findOne({ 'version.number': versao, 'files.hashMD5':  versaoWp.hashMD5});
            }
            else{
                versao = (await obterVersaoWordPress(url)).versaoWp;
                versaoExistente = await model.findOne({ 'version.number': versao });
            }
            let resultado = {};
            if (!versaoExistente) {
                const apiWp = await axios.get("http://api.wordpress.org/core/stable-check/1.0/");
                const dadosApi = apiWp.data;
                versaoExistente = {
                    version:{
                        number: versao,
                        status: dadosApi[versao] || null
                    },
                    files: hashFile
                }
                await model.updateOne({'version.number': versaoExistente.version.number}, versaoExistente, {upsert: true})
            }
            resultado = {
                version: {
                    number: versaoExistente.version.number,
                    status: versaoExistente.version.status !== undefined ? versaoExistente.version.status : null
                },
            };
            if (res) {
                return res.status(200).json(resultado);
            }
            return resultado
        } catch (error) {
            if (res) {
                return res.status(500).json({ erro: error.message });
            }
            throw new Error(error.message);
        }
    }
}