var crypto = require('crypto');
var shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var updateBy = require('../plugins/mongoose/plugins/updatedby');

var StatisticSchema = new Schema({
  id: {
    type: String,
    unique: true,
    trim: true
  },
  project_id: {
    type: String,
    required: true,
    trim: true
  },
  git: {
    head: {
      id: { type: String },
      author_name: { type: String },
      author_email: { type: String },
      committer_name: { type: String },
      committer_email: { type: String },
      message: { type: String }
    },
    branch: { type: String },
    remotes: [ String ]
  },
  lcov: {
    coverage_line_percent: { type: Number },
    coverage_branch_percent: { type: Number }
  },
  junit: {
    tests: { type: Number },
    failure: { type: Number },
    skipped: { type: Number }
  }
});

StatisticSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = shortid.generate();
  }

  next();
});

StatisticSchema.plugin(updateBy);

module.exports = mongoose.model('Statistic', StatisticSchema);
