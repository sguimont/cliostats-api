var Promise = require('bluebird');
var Boom = require('boom');
var Hoek = require('hoek');
var nJwt = Promise.promisifyAll(require('nJwt'));

var implementation = function (server, options) {

  Hoek.assert(options, 'Missing jwt auth strategy options');
  Hoek.assert(options.key, 'Missing required private key in configuration');

  var getTokenFromCookie = function (request, reply) {
    return request.state[ server.settings.app.security.cookie.name ];
  };

  var getTokenFromBearer = function (request, reply) {
    var req = request.raw.req;
    var authorization = req.headers.authorization;

    if (!authorization) {
      return null;
    }

    var parts = authorization.split(/\s+/);

    if (parts.length !== 2) {
      reply(Boom.badRequest('Bad HTTP authentication header format', 'Bearer'));
      return null;
    }

    if (parts[ 0 ].toLowerCase() !== 'bearer') {
      reply(Boom.unauthorized(null, 'Bearer'));
      return null;
    }

    if (parts[ 1 ].split('.').length !== 3) {
      reply(Boom.badRequest('Bad HTTP authentication header format', 'Bearer'));
      return null;
    }

    return parts[ 1 ];
  };

  var scheme = {
    authenticate: function (request, reply) {
      var payload = getTokenFromCookie(request, reply);
      if (!payload) {
        payload = { token: getTokenFromBearer(request, reply) };
      }

      if (!payload.token) {
        return reply(Boom.unauthorized('No JWT token presents in cookie or Bearer header'), null);
      }

      nJwt.verifyAsync(payload.token, options.key).then((decodedToken) => {
        return Promise.all([
          request.server.app.cache.session.getAsync(decodedToken.body.jti),
          decodedToken
        ]);
      }).spread((cached, decodedToken) => {
        if (!cached) {
          return Promise.resolve(reply(Boom.unauthorized('Error: ' + err), null));
        }
        return Promise.resolve(reply.continue({ credentials: decodedToken.body }));
      }).catch((e) => {
        if (e.name.indexOf('Jwt') > -1) {
          reply(Boom.unauthorized('Error: ' + e), null);
        } else {
          reply(Boom.badImplementation());
        }
      });
    }
  };

  return scheme;
};

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Auth] Module');

  // init session cookie
  server.state(server.settings.app.security.cookie.name, server.settings.app.security.cookie.options);

  // init & register scheme
  server.auth.scheme('jwt', implementation);
  server.auth.strategy('sso', 'jwt', { key: server.settings.app.security.key });

  // setup default auth for all routes
  server.auth.default('sso');

  // On each authenticated request, add the auth user in request.pre object.
  server.ext('onPreHandler', (request, reply) => {
    if (!request.auth.isAuthenticated) {
      return reply.continue();
    }
    var User = server.plugins.mongoose.User;
    User.findOne({ id: request.auth.credentials.sub }).then((user) => {
      if (user) {
        request.pre.user = user;
      } else {
        return reply(Boom.unauthorized('User not found'), null);
      }
      return reply.continue();
    }).catch((e) => {
      return reply(Boom.badImplementation('Error: ' + e), null);
    });

  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
