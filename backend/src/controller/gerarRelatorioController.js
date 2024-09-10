const inforVersaoWordPress = require("./inforVersaoWpController");
const informacaoTema = require("./infoTemaController");
const informacaoPlugins = require("./infoPluginsController");

module.exports = {
    postGeraRelatorio : async (req, res) =>  {
        try {
            const {url} = req.body;
            let resultadoVersaoWp = await inforVersaoWordPress(url);
            let resultadoInforTema = await informacaoTema(url);
            let resultadoInforPlugins = await informacaoPlugins(url);
            let relatorio = {
                version: resultadoVersaoWp,
                main_theme: resultadoInforTema,
                plugins: resultadoInforPlugins.plugins,
            };

            return res.status(200).json(relatorio)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ erro: error.message });
        }
    }
}