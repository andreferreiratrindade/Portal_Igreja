const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;


var Pessoa = new Schema({


    // Nome do usuário
    name: {
        type: String,
        required: true,
        unique: false
    },

    login: {
        type: String,
        unique: [true, "E-mail já cadastrado para outro usuário. Favor selecionar outro e-mail."],
        required: true,
        uniqueCaseInsensitive: true,
        index: true,
    },

    password: {
        type: String,
        required: true,
        unique: false

    },

});

Pessoa.plugin(autoIncrement.plugin, {
    model: 'Pessoa',
    field: '_id'
});
Pessoa.plugin(uniqueValidator);

Pessoa.statics = {
    savePessoa: function (requestData, callback) {

        this.create(requestData, callback);
    },
    findPessoaUpdate: function (query, pessoa, callback) {
        this.findOneAndUpdate(query, pessoa, callback);
    },
    updatePessoa: function (pessoa, callback) {
        pessoa.save(callback);
    },

    findPessoa: function (query, callback) {
        this.findOne(query, callback);
    },

    findIntegranteByIdAndIntegranteName: function (id, pessoaname, callback) {
        this.findOne({_id: id }, callback);
    }
}

module.exports = mongoose.model('Pessoa', Pessoa);

