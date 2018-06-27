const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment'),
      db = require('./db').db,
      relationship = require("mongoose-relationships"),
      uniqueValidator = require('mongoose-unique-validator');
      autoIncrement.initialize(db);
      mongoose.Promise= Promise;

module.exports = {
    mongoose : mongoose,
    Schema : Schema,
    autoIncrement : autoIncrement,
    db : db,
    uniqueValidator : uniqueValidator,
    relationship:relationship
}