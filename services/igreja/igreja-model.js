const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var Igreja = new Schema({

    nome: {
        type: String,
        required: true,
        unique: false
    },
    token: {
        type: String,
    },
    cidade:{
        type: String
    },
    uf:{
        type: String
    }
    
});

Igreja.plugin(autoIncrement.plugin, {
    model: 'Igreja',
    field: '_id'
});
Igreja.plugin(uniqueValidator);

Igreja.statics = {
    criar: function (requestData, callback) {
       
        requestData.token = requestData.idPessoa.toString();
        this.create(requestData, callback);
    },
    findUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },
   
    findbyToken: function (token, callback) {
        this.findOne({ 'token': token}, callback);
    },
    update: function (igreja, callback) {
        igreja.save(callback);
    },

    findBy: function(query, callback){
        this.find(query).exec(callback);
        
    }
}

module.exports = mongoose.model('Igreja', Igreja);
 