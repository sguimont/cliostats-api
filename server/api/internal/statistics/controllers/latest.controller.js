var Promise = require('bluebird');
var Joi = require('joi');
var Boom = require('boom');
var _ = require('lodash');

module.exports.config = {
  state: {
    parse: true,
    failAction: 'log'
  },
  validate: {},
  plugins: {},
  auth: false
};

module.exports.handler = function (request, reply) {
  var Statistic = request.server.plugins.mongoose.Statistic;

  Statistic.findOne({ project_id: request.params.projectId }, {}, { sort: { 'createdAt': -1 } }).then((statistic) => {
    reply(statistic)
  }).catch((err) => {
    console.log(err);
    return reply(Boom.internal('Cannot get stats for project'));
  })
};
