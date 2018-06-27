const ministracaoConstroller = require('./ministracao-controller')
var express = require('express')
	, router = express.Router()

// Cria ministração
router.post('/criarMinistracao', ministracaoConstroller.criar);

// Recupera ministério por token
router.post('/buscarMinistracoes', ministracaoConstroller.buscarMinistracoes);

router.post('/buscarPessoaPorIgreja', ministracaoConstroller.buscarPessoaPorIgreja);

module.exports = router
