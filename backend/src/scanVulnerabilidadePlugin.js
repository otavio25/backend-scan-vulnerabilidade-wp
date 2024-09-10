const model = require('./model/cveSchema')

async function scanVulnerabilidadePlugin(infoPlugin){
    try {
        let cve = []
        dataLancamento = new Date(infoPlugin.added)
        cve = await model.find({
            $and:[
                {
                    $or:[
                        {"containers.cna.affected.packageName": infoPlugin.slug},
                        {"containers.cna.affected.product": infoPlugin.slug},
                        {"containers.cna.descriptions.value": {
                            $regex: new RegExp(infoPlugin.slug, "i")
                        }},
                        {"containers.cna.affected.packageName": infoPlugin.name},
                        {"containers.cna.affected.product": infoPlugin.name},
                        {"containers.cna.descriptions.value": {
                            $regex: new RegExp(infoPlugin.name, "i")
                        }}
                    ],
                },
                {
                    $or: [
                        {
                            $and: [
                                { 'containers.cna.affected.versions.version': infoPlugin.version.number },
                                { 'containers.cna.affected.versions.status': 'affected' },
                                { 'containers.cna.affected.versions.lessThanOrEqual': { $exists: false }}
                            ]
                        },
                        {
                            $and: [
                                { 'containers.cna.affected.versions.lessThanOrEqual': { $gte: infoPlugin.version.number }},
                                { 'containers.cna.affected.versions.status': 'affected' },
                                { 'containers.cna.affected.versions.version': { $exists: false } }
                            ]
                        },
                        {
                            $and: [
                                { 'containers.cna.affected.versions.lessThanOrEqual': { $gte: infoPlugin.version.number }},
                                { 'containers.cna.affected.versions.version': 'n/a' },
                                { 'containers.cna.affected.versions.status': 'affected' }
                            ]
                        },
                        {
                            $and: [
                                { 'containers.cna.affected.versions.lessThanOrEqual': { $gte: infoPlugin.version.number }},
                                { 'containers.cna.affected.versions.version': { $lte: infoPlugin.version.number } },
                                { 'containers.cna.affected.versions.status': 'affected' }
                            ]
                        }
                    ]
                },
                {
                    $expr: {
                        $gte: [
                            {
                                $dateFromString: {
                                    dateString: "$cveMetadata.datePublished",
                                    format: {
                                        $cond: {
                                            if: {$gte: [{ $indexOfBytes: ["$cveMetadata.datePublished", "."] }, 0]},
                                            then: "%Y-%m-%dT%H:%M:%S.%LZ",
                                            else: "%Y-%m-%dT%H:%M:%S"
                                        }
                                    }
                                }
                            },
                            dataLancamento
                        ]
                    }
                }
            ]
        })
        return cve
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = scanVulnerabilidadePlugin