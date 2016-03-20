var crypto = require('crypto');
var shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var updateBy = require('../plugins/mongoose/plugins/updatedby');

var ProjectSchema = new Schema({
  id: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    trim: true
  }
});

ProjectSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = shortid.generate();
  }

  next();
});

ProjectSchema.plugin(updateBy);

module.exports = mongoose.model('Project', ProjectSchema);
