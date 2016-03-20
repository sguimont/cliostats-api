var Promise = require('bluebird');
var Joi = require('joi');
var Boom = require('boom');
var nJwt = require('nJwt');

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

  Statistic.find({ project_id: request.params.projectId }).then((statistics) => {
    reply(statistics);
  }).catch((err) => {
    console.log(err);
    return reply(Boom.internal('Cannot get stats for project'));
  })
};
