const ministerioPessoaModel = require('./ministerio-pessoa-model')
const pessoaModel = require('./../pessoa/pessoa-model')
const constants = require('./../utils/constants');
const async = require('async')


// Cria pessoa minsitério tipo pendendete
exports.solicitarEntrada = (req, res) => {

    var minPessoa = {
        idIgrejaPessoa: req.body.idIgrejaPessoa,
        idIgreja: req.body.idIgreja,
        idPessoa: req.body.idPessoa,
        tipoMinisterio: req.body.tipoMinisterio,
        tipoPessoaMinisterio: constants.tipoPessoa.Pendente,
        dthCadastro: new Date()
    };
    ministerioPessoaModel.criar(minPessoa,
        (err, ministerioPessoa) => {

            retorno = {
                obj: ministerioPessoa,
                ok: !err,
                error: err
            }
            return res.json(retorno);

        });

}

// Recupera todos os ministérios vinculados a pessoa.
exports.recuperaMinisterioPorPessoa = (req, res) => {
    var retorno = {};
    var obj = {
        idIgrejaPessoa: req.body.idIgrejaPessoa
    };
    ministerioPessoaModel.findByQuery(obj,
        (err, lstMinInt) => {

            var ministerios = []

            lstMinInt.map(function (value) {
                ministerios.push({
                    idMinisterioPessoa: value._id,
                    tipoPessoaMinisterio: value.tipoPessoaMinisterio,
                    tipoMinisterio: value.tipoMinisterio
                });
            });

            retorno = {
                obj: ministerios,
                ok: !err,
                error: err
            }
            return res.json(retorno);

        });
}

// Atulaiza ministério favorito
exports.atualizaMinisterioFavorito = (req, res) => {
    var retorno = {};

    ministerioPessoaModel.removeTodosFavoritos(req.body.idPessoa,
        (err, ministerio) => {

            ministerioPessoaModel.update({ _id: req.body.idMinisterioIgreja },
                { ehFavorito: req.body.ehFavorito },
                (err, ministeriott) => {

                    ministerioPessoaModel.findById(req.body.idMinisterioIgreja,
                        (err, ministeriott) => {

                            retorno = {
                                ok: !err,
                                error: err
                            }
                            return res.json(retorno);
                        })
                }
            )
        })
}

// buscar solicitações pendentes 
// solicitações pendentes de confirmações de entradas no ministério 
exports.buscarSolicitacoesPendentes = (req, res) => {

    var retorno = {};
    var obj = { idIgreja: req.body.idIgreja };
    ministerioPessoaModel.recuperaPessoasPendentes(obj, (err, pessoas) => {

        retorno = {
            ok: !err,
            error: err
        }
        return res.json(retorno);
    });
}

// Permitir acesso de pessoa ao ministério
exports.permitirAcessoPessoaAoMinisterio = (req, res) => {
    var retorno = {};

    var obj = {
        tipoPessoa: req.body.permite
            ? constants.tipoPessoa.Pessoa : constants.tipoPessoa.NaoAceito,
    };

    ministerioPessoaModel.findByIdAndUpdate(req.body.idMinisterioIgreja, obj,
        (err, result) => {

            retorno = {
                ok: !err,
                error: err
            }
            return res.json(retorno);

        });

}

// Atualiza ministérios vinculados à pessoa
exports.atualizaMinisteriosDePessoa = (req, res) => {
    var retorno = {};
    var obj = {
        idIgrejaPessoa: req.body.idIgrejaPessoa,
        idPessoa: req.body.idPessoa,
        idIgreja: req.body.idIgreja,
        tipoMinisterio: req.body.tipoMinisterio,
        tipoPessoaMinisterio: constants.tipoPessoaMinisterio.Admin
    }
    ministerioPessoaModel.findByQuery({ _id: req.body.idMinisterioPessoa },
        (err, result) => {
            console.log('idMinisterioPessoa ' + req.body.idMinisterioPessoa);
            console.log(result);

            if (result.length == 1) {
                console.log('update');

                ministerioPessoaModel.findUpdate(req.body.idMinisterioPessoa, obj,
                    (err2, result2) => {

                        retorno = {
                            obj: result2,
                            ok: !err,
                            error: err
                        }
                        return res.json(retorno);

                    })

            } else {
                ministerioPessoaModel.criar(obj, (err2, result2) => {

                    retorno = {
                        obj: result2,
                        ok: !err,
                        error: err
                    }
                    return res.json(retorno);

                })
            }
        });

}

exports.buscaPessoasPorMinisterio = (req, res) => {

    var retorno = {};
    var obj = {
        idIgreja: req.body.idIgreja,
        tipoMinisterio: req.body.tipoMinisterio,
    };

    console.log(req.body.solicitacaoPendente)
    if(req.body.solicitacaoPendente){
        obj.tipoPessoaMinisterio = constants.tipoPessoaMinisterio.Pendente;
    }

    ministerioPessoaModel.findByQuery(obj, (err, lstministeriosPessoa) => {
        var pessoas = [];
        async.each(lstministeriosPessoa, function (ministerioPessoa, callback2) {
            pessoaModel.findById(ministerioPessoa.idPessoa, function (err, pessoa) {

                pessoas.push({
                    idPessoa: ministerioPessoa.idPessoa,
                    nome: pessoa.name
                });

                if (pessoas.length == lstministeriosPessoa.length) {
                    callback2('sucesso.');
                }

            });
        }, function (obj) {

            retorno = {
                obj: pessoas,
                ok: !err,
                error: err
            }
            return res.json(retorno);
        });
    });
}