const ministerioConstroller = require('./ministerio-controller')
var express = require('express')
	, router = express.Router()


// Envia uma solicitação de entrada para o ministerio
router.post('/solicitarEntrada', ministerioConstroller.solicitarEntrada);

// Recupera todos os ministério vinculado a pessoa.
router.post('/recuperaMinisterioPorPessoa', ministerioConstroller.recuperaMinisterioPorPessoa);

// Atualiza ministério favorito
router.post('/atualizaMinisterioFavorito', ministerioConstroller.atualizaMinisterioFavorito);

// Atualiza ministerio de pessoa
router.post('/atualizaMinisteriosDePessoa', ministerioConstroller.atualizaMinisteriosDePessoa );

// Recupera pessoas por ministério
router.post('/buscaPessoasPorMinisterio', ministerioConstroller.buscaPessoasPorMinisterio );



module.exports = router
