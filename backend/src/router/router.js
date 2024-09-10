const express = require('express')
const infoPluginsController = require('../controller/infoPluginsController')
const inforVersaoWpController = require('../controller/inforVersaoWpController')
const infoTemaController = require('../controller/infoTemaController')
const cveController = require('../controller/cveController')
const router = express('router')

router.post("/infoplugins", infoPluginsController.postInfoPlugins)
router.post("/infoversaowp", inforVersaoWpController.postInforVersaoWordPress)
router.post("/infotema", infoTemaController.postObterInforTema)
router.get("/cve", cveController.buscaCve)
router.post("/dataload", cveController.dataLoad)
router.post("/update/data", cveController.updateData)

module.exports = router