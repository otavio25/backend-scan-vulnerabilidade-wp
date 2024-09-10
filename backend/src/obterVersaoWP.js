const axios = require("axios");
const model = require("./model/versaoWpSchemaModel");
const crypto = require("crypto");
const url = process.argv[2];

async function obterVersaoWordPress(url) {
  try {
    const resposta = await axios.get(url);
    const html = resposta.data;
    const metaRegex = /<meta\s+name\s*=\s*"generator"\s+content\s*=\s*"WordPress\s+(\d+\.\d+(\.\d+)?)"/;
    const scriptRegex = /wp-emoji-release\.min\.js\?ver=([\d.]+)/;
    const styleRegex = /<link[^>]*?rel\s*=\s*["']stylesheet["'][^>]*?href\s*=\s*["'][^"']*?ver=([0-9.]+)[^"']*?["']/i;
    let arquivoCustomizeJs = await axios.get(`${url}/wp-admin/js/customize-controls.min.js`);
    arquivoCustomizeJs = arquivoCustomizeJs.data;
    const arquivoHash = calcularHashMD5(arquivoCustomizeJs);
    
    let hashExisteBanco = await model.findOne({ "files.hashMD5": arquivoHash });
    if (hashExisteBanco) {
      let versaoWp = hashExisteBanco.version.number;
      return { versaoWp };
    } else {
      let resultado;
      if ((resultado = html.match(metaRegex))) {
        return { versaoWp: resultado[1] };
      } else if ((resultado = html.match(scriptRegex))) {
        return { versaoWp: resultado[1] };
      } else if ((resultado = html.match(styleRegex))) {
        return { versaoWp: resultado[1] };
      } else {
        return { erro: "Versão não encontrada" };
      }
    }
  } catch (error) {
    return { erro: error.message };
  }
}
function calcularHashMD5(dados) {
  const hash = crypto.createHash("md5");
  hash.update(dados);
  const hashHex = hash.digest("hex");
  return hashHex;
}

module.exports = obterVersaoWordPress;
