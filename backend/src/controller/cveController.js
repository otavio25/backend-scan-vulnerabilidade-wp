const model = require('../model/cveSchema')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: '.env' })

module.exports = {
    buscaCve : async(request, response) => {
        try {
            const {cveId} = request.query
            const resultado = await model.findOne({"cveMetadata.cveId": cveId})
            if(!resultado){
                response.status(404).json({message: 'recurso não encontrado'})
            }
            else{
                return response.status(200).json({resultado})
            }
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    },
    dataLoad : async(request, response) => {
        try {
            let yearDirectory = fs.readdirSync(process.env.DIRECTORY_CVES)
            yearDirectory = yearDirectory.filter((arquive) => !isNaN(Number(arquive)))
            
            console.log("Lendos os arquivos CVE...")
            let data = []
            yearDirectory.map((yearDirectory) => {
                let prefixDirectory = fs.readdirSync(process.env.DIRECTORY_CVES + `${yearDirectory}`)
                prefixDirectory.map((prefixDirectory) => {
                    let filenames = fs.readdirSync(process.env.DIRECTORY_CVES + `${yearDirectory}/${prefixDirectory}`)
                    filenames.map((filename) => {
                        jsonFile = fs.readFileSync(process.env.DIRECTORY_CVES + `${yearDirectory}/${prefixDirectory}/${filename}`)
                        jsonFile = JSON.parse(jsonFile)
                        jsonFile["_id"] = jsonFile.cveMetadata.cveId
                        data.push(jsonFile)
                    })
                })
            })

            console.log("Leitura dos arquivos CVE realizada com sucesso")
            console.log("Começando a inserir os dados no banco....")

            model.insertMany(data).then(() => {
                console.log("Dados inseridos com sucesso")
                return response.status(200).json({message: "Carga de dados realizada com sucesso"})
            }).catch((error) => {
                console.log(error.message)
                return response.status(400).json({error: "Não foi possível popular o banco"})
            })
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    },
    updateData : async(request, response) => {
        try {
            let yearDirectory = fs.readdirSync(process.env.DIRECTORY_CVES)
            yearDirectory = yearDirectory.filter((arquive) => !isNaN(Number(arquive)))
            
            console.log("Lendo os arquivos CVE...")
            let data = []
            yearDirectory.map((yearDirectory) => {
                let prefixDirectory = fs.readdirSync(process.env.DIRECTORY_CVES + `${yearDirectory}`)
                prefixDirectory.map((prefixDirectory) => {
                    let filenames = fs.readdirSync(process.env.DIRECTORY_CVES + `${yearDirectory}/${prefixDirectory}`)
                    filenames.map((filename) => {
                        jsonFile = fs.readFileSync(process.env.DIRECTORY_CVES + `${yearDirectory}/${prefixDirectory}/${filename}`)
                        jsonFile = JSON.parse(jsonFile)
                        jsonFile["_id"] = jsonFile.cveMetadata.cveId
                        data.push(jsonFile)
                    })
                })
            })

            let updateOperation = data.map((item) => ({
                updateOne: {
                    filter: { _id: item.cveMetadata.cveId }, // Filtrar pelo cve_id
                    update: {
                        $set: {
                            containers: item.containers,
                            cveMetadata: item.cveMetadata,
                            dataType: item.dataType,
                            dataVersion: item.dataVersion
                        }
                    },
                    upsert: true // Inserir se não existir
                }
            }))

            console.log("Atualizando e inserindo novos dados no banco...")
            const result = await model.bulkWrite(updateOperation)
            console.log(result)
            return response.status(200).json({message: "Nova carga de dados realizada com sucesso"})
        } catch (error) {
            console.log(error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    }
}