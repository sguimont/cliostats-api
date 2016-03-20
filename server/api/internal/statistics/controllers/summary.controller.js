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

  Statistic.find({ project_id: request.params.projectId }).then((statistics) => {
    var junit = {
      tests: 0
    };

    _.each(statistics, function (entry) {
      junit.tests += entry.junit.tests;
    });

    junit.tests = statistics.length ? junit.tests / statistics.length : 0;

    reply({ count: statistics.length, junit: junit })
  }).catch((err) => {
    console.log(err);
    return reply(Boom.internal('Cannot get stats for project'));
  })
};
