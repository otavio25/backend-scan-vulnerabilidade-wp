const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({  
    rejectUnauthorized: false
});

const instancia = axios.create({  
    httpsAgent
});

async function obterVersaoPluginsWp(url) {
    try {
        const resposta = await instancia.get(url);
        const html = resposta.data;

        const pluginsMap = new Map();
        const scriptTags = html.match(/<script[^>]*>[\s\S]*?<\/script>/g);

        if (scriptTags) {
            await Promise.all(
                scriptTags.map(async (scriptTag) => {
                    if (scriptTag.includes('wp-content/plugins')) {
                        let nomePluginMatch = scriptTag.match(/\/plugins\/([^/]+)\//);
                        if (nomePluginMatch) {
                            let nomePlugin = nomePluginMatch[1];
                            try {
                                let readmePlugin = await instancia.get(`${url}/wp-content/plugins/${nomePlugin}/readme.txt`);
                                readmePlugin = readmePlugin.data;
                                let versaoMatch = readmePlugin.match(/Stable tag: (.+)/);
                                let versaoPlugin = versaoMatch ? versaoMatch[1].trim() : null;
                                pluginsMap.set(nomePlugin, { nomePlugin: nomePlugin, versaoPlugin: versaoPlugin });
                            } catch (err) {
                                if (err.response && err.response.status === 404) {
                                    console.log(`Arquivo readme.txt não encontrado para o plugin: ${nomePlugin}`);
                                } else {
                                    console.error(`Erro ao obter o readme.txt do plugin ${nomePlugin}: ${err.message}`);
                                }
                            }
                        }
                    }
                })
            );
        } else {
            console.log("Não existem plugins");
        }

        let plugins = Array.from(pluginsMap.values());
        return plugins;
    } catch (error) {
        console.error(`Erro ao obter a versão dos plugins: ${error.message}`);
        return []; // Retorna um array vazio em caso de erro
    }
}

module.exports = obterVersaoPluginsWp;

async function main() {
    let plugins = await obterVersaoPluginsWp();
    if (Array.isArray(plugins)) {
        plugins.map((plugin) => {
            console.log('Plugin: ', plugin.nomePlugin + ' - ' + 'Versão: ', plugin.versaoPlugin);
        });
    } else {
        console.log("Nenhum plugin encontrado.");
    }
}

if (require.main === module) {
    main();
}