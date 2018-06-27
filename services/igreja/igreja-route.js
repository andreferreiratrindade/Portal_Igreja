const igrejaConstroller = require('./igreja-controller')
var express = require('express')
	, router = express.Router()

// Cria ministério
router.post('/criar', igrejaConstroller.criar);

// Recupera igreja por token
router.post('/buscarIgrejaPorToken', igrejaConstroller.buscarIgrejaPorToken);

// Envia uma solicitação de entrada para a igreja
router.post('/solicitarEntrada', igrejaConstroller.solicitarEntrada);

// Recupera igreja por pessoa
router.post('/recuperaIgrejaPorPessoa', igrejaConstroller.recuperaIgrejaPorPessoa);

// Atualiza ministério favorito
router.post('/atualizaIgrejaFavorito', igrejaConstroller.atualizaIgrejaFavorito);

// Buscar solicitações pendentes
router.post('/buscarSolicitacoesPendentes', igrejaConstroller.buscarSolicitacoesPendentes );

// Permitir acesso de pessoa a igreja
router.post('/permitirAcesso', igrejaConstroller.permitirAcesso );

// Recupera pessoas por igreja
router.post('/recuperaPessoasPorIgreja', igrejaConstroller.recuperaPessoasPorIgreja );

// Recupera pessoas por igreja
router.post('/alterar', igrejaConstroller.alterar );

// Recupera igreja por id
router.post('/encontrarIgrejaPorId', igrejaConstroller.encontrarIgrejaPorId );

module.exports = router
