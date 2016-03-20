var Promise = require('bluebird');
var Joi = require('joi');
var Boom = require('boom');
var nJwt = require('nJwt');

module.exports.config = {
  state: {
    parse: true,
    failAction: 'log'
  },
  validate: {
    payload: {
      'git': Joi.object(),
      'run_at': Joi.string(),
      'junit': Joi.object(),
      'lcov': Joi.object()
    }
  },
  plugins: {
    sanitizer: {
      payload: {}
    }
  },
  auth: false
};

module.exports.handler = function (request, reply) {
  var Statistic = request.server.plugins.mongoose.Statistic;

  var statistic = new Statistic(request.payload);

  statistic.modifiedBy = 'test';
  statistic.project_id = 'test';

  statistic.save().then((statistic) => {
    reply({
      statistic_id: statistic.id
    });
  }).catch((err) => {
    console.log(err);
    return reply(Boom.internal('Cannot save stats'));
  })
};
