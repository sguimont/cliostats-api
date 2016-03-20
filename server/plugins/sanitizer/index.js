var _ = require('lodash');
var indicative = require('indicative');
var Boom = require('boom');

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Sanitizer] Module');

  server.ext('onPreHandler', (request, reply) => {
    var options = request.route.settings.plugins.sanitizer;
    if (!options) {
      return reply.continue();
    }

    for (var section of [ 'headers', 'query', 'payload' ]) {
      if (options[ section ]) {
        request[ section ] = _.merge(request[ section ], indicative.sanitize(request[ section ], options[ section ]));
      }
    }
    reply.continue();
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
