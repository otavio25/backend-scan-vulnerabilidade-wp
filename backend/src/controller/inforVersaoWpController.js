const axios = require("axios");
const mongoose = require("mongoose");
const obterVersaoWordPress = require("../obterVersaoWP");
const model = require("../model/versaoWpSchemaModel");

module.exports = {
    postInforVersaoWordPress : async (req, res)=>{
        try {
            const {url, versaoWp} = req.body
            console.log("url: ", url)
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
                    status: dadosApi[versao]
                    },
                    files: hashFile
                }
                await model.updateOne({'version.number': versaoExistente.version.number}, versaoExistente, {upsert: true})
            }
            resultado = {
                version: {
                    number: versaoExistente.version.number,
                    status: versaoExistente.version.status,
                },
            };
            console.log("resultado: ", resultado)
            return res.status(200).json(resultado)
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
}