const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var Musica = new Schema({
    idIntegrante:{
        type: Number,
        required: true,
        unique: false
    },
    nmeMusica: {
        type: String,
        required: true,
        unique: false
    },
    nmeAutor:{
        type: String,
        required: true,
        unique: false
    }, 
    dthAtualizacao:{
        type:Date,
        required:true,
        default: Date.now
    }
});

Musica.plugin(autoIncrement.plugin, {
    model: 'ministracao',
    field: '_id'
});
Musica.plugin(uniqueValidator);

Musica.statics = {
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

module.exports = mongoose.model('musica', Musica);
