const axios = require("axios");

const url = process.argv[2];

async function informacaoTema() {
  try {
    const resposta = await axios.get(url);
    const html = resposta.data;

    const nomeTemaRegex1 = /\/themes\/([^\/]+)\/style.css/i;
    const nomeTemaMatch1 = html.match(nomeTemaRegex1);

    if (nomeTemaMatch1) {
      const nomeTema = nomeTemaMatch1[1];
      let apiResposta = await axios.get(
        `${url}/wp-content/themes/${nomeTema}/style.css`
      );
      const regexVersao = /Version:\s*([0-9.]+)/i;
      const match = apiResposta.data.match(regexVersao);

      const versaoTema = match ? match[1] : null;

      return { nomeTema, versaoTema };
    }

    const nomeTemaRegex2 = /\/themes\/([^\/]+)\/?/i;
    const nomeTemaMatch2 = html.match(nomeTemaRegex2);

    if (nomeTemaMatch2) {
      const nomeTema = nomeTemaMatch2[1];
      let apiResposta = await axios.get(
        `${url}/wp-content/themes/${nomeTema}/style.css`
      );
      const regexVersao = /Version:\s*([0-9.]+)/i;
      const match = apiResposta.data.match(regexVersao);

      const versaoTema = match ? match[1] : null;

      return { nomeTema, versaoTema };
    } else {
      return { erro: "Não foi encontrado nenhum tema no momento" };
    }
  } catch (error) {
    throw error;
  }
}

module.exports = informacaoTema;

if (require.main === module) {
  informacaoTema()
    .then((resultado) => {
      if (resultado.erro) {
        console.log(resultado.erro);
      } else {
        console.log(
          `Nome do tema: ${
            resultado.nomeTema || "Não encontrado"
          } \nVersão do tema: ${resultado.versaoTema || "Não encontrada"}`
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
