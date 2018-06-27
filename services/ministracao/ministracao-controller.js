
const constants = require('./../utils/constants');
const async = require('async');
const igrejaPessoaModel = require('../igreja/igreja-pessoa-model')
const pessoaModel = require('./../pessoa/pessoa-model')


exports.criar = (req, res) => {


}

exports.buscarMinistracoes = (req, res) => {


}

exports.buscarPessoaPorIgreja = (req, res) => {

    var retorno = {};
    igrejaPessoaModel.findByQuery({ idIgreja: req.body.idIgreja },
        (err, lstMinInt) => {

            var equipes = [];
            if (lstMinInt.length == 1) {
                var idPessoa = lstMinInt[0].idPessoa;

                pessoaModel.findPessoa({ _id: idPessoa },
                    (err, pessoa) => {

                        var obj = {
                            idPessoa: idPessoa,
                            nome: pessoa.name
                        }

                        equipes.push(obj);
                        retorno = {
                            obj: equipes,
                            ok: !err,
                            error: err
                        }
                        return res.json(retorno);

                    });
            } else {

                async.each(lstMinInt, function (minPessoa, callback) {

                    pessoaModel.findPessoa({ _id: minPessoa.idPessoa },
                        (err, pessoa) => {
                            var obj = {
                                idPessoa: minPessoa.idPessoa,
                                nome: pessoa.name
                            }

                            equipes.push(obj);
                            if (lstMinInt.length == equipes.length) {
                                callback('t');
                            }
                        });
                }, function (obj) {

                    retorno = {
                        obj: equipes,
                        ok: !err,
                        error: err
                    }
                    return res.json(retorno);
                });
            };
        });
}

