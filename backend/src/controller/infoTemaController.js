const axios = require("axios");
const informacaoTema = require("../obterTema");
const model = require("../model/temaSchema");

module.exports = {
    postObterInforTema : async (req, res, urlFromFunc = null) => {
        try {
            const url = req.body.url || urlFromFunc;
            const obterTema = await informacaoTema(url);
            let temaExistente = await model.findOne({ slug: obterTema.nomeTema });
            let objTema = {};
            try{
                if (!temaExistente) {
                    const respostaApiWordPress = await axios.get(
                        `https://api.wordpress.org/themes/info/1.1/?action=theme_information&request[slug]=${obterTema.nomeTema}`
                    );
                    const dadosTema = respostaApiWordPress.data;
                    const resultado = await model.create(dadosTema);
                    temaExistente = resultado;
                }
                objTema = {
                    style_name: temaExistente.name,
                    slug: obterTema.nomeTema,
                    latest_version: temaExistente.version,
                    outdated: temaExistente.version !== obterTema.versao,
                    version: {
                        number: obterTema.versaoTema,
                    },
                };
            } catch(err){
                if (err.response && err.response.status === 404) {
                    objTema = {
                        style_name: null,
                        slug: obterTema.nomeTema,
                        latest_version: null,
                        outdated: null,
                        version: {
                            number: obterTema.versaoTema,
                        },
                    };
                }
            }
            if (res) {
                return res.status(200).json(objTema)
            }
            return objTema
        } catch (error) {
            if (res) {
                return res.status(500).json({ erro: error.message });
            }
            throw new Error(error.message);
        }
    }
}
