const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var LinkMusica = new Schema({
    idMusica:{
        type: Number,
        required: true,
        unique: false
    },

    url:{
        type:String, 
        required: true
    },

    tipoLinkMusica:{
        type: Number,
        required:true
    }
});

LinkMusica.plugin(autoIncrement.plugin, {
    model: 'linkMusica',
    field: '_id'
});
LinkMusica.plugin(uniqueValidator);

LinkMusica.statics = {
    criar: function (requestData, callback) {
        this.create(requestData, callback);
    },
    findMinisterioUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },
   
    findbyToken: function (token, callback) {
        this.findOne({ 'token': token}, callback);
    },
    update: function (ministerio, callback) {
        ministerio.save(callback);
    },
}

var linkMusica = mongoose.model('linkMusica', LinkMusica);

/** export schema */
module.exports = {
    LinkMusica: linkMusica
};