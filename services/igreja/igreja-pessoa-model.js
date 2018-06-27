const modelService = require('../../config/modelService');
var relationship = modelService.relationship;
var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var IgrejaPessoa = new Schema({
    // Nome da igreja
    idIgreja: {
        type: Number,
        require: true,
    },
    idPessoa: {
        type: Number,
        require: true,
    },
    tipoPessoa: {
        type: Number, // 0 - Administrador Principal; 1 - Adminsitrador Secundario; 2 - Integrante; 3 - Solicitante
        require: true
    },
    dthCadastro: {
        type: Date,
        require: true,
        default: Date.now
    },
    ehFavorito: {
        type: Boolean,
        default: false,
        required: true
    },
});

IgrejaPessoa.plugin(autoIncrement.plugin, {
    model: 'IgrejaPessoa',
    field: '_id'
});
IgrejaPessoa.plugin(uniqueValidator);

IgrejaPessoa.statics = {
    criar: function (requestData, callback) {

        this.create(requestData, callback);
    },
    findUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },

    findbyToken: function (token, callback) {
        this.findOne({ token: token }, callback);
    },
    findByQuery: function (query, callback) {

        this.find(query).exec(callback);
    },

    findByIgrejaAndPessoa: function (query, callback) {

        this.findOne(query, callback);
    },

    removeTodosFavoritos: function (idPessoa, callback) {
        this.where('idPessoa').equals(idPessoa)
            .update({ ehFavorito: false }, callback)
    },
    findBy: function (query, callback) {
        this.find(query)
            .exec(callback);
    }
}

module.exports = mongoose.model('IgrejaPessoa', IgrejaPessoa);
