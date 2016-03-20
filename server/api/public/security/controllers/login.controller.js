var Promise = require('bluebird');
var Hapi = require('hapi');
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
      email: Joi.string().email().required(),
      password: Joi.string().alphanum().min(3).max(30).required()
    }
  },
  plugins: {
    sanitizer: {
      payload: {
        email: 'escape|normalize_email'
      }
    }
  },
  auth: false
};

module.exports.handler = function (request, reply) {
  var email = request.payload.email;
  var password = request.payload.password;
  var User = request.server.plugins.mongoose.User;

  User.loadByEmail(email).then((user) => {
    if (!user) {
      return Promise.resolve([ false, null ]);
    }

    return [ Promise.resolve(user).call('authenticate', password), user ];
  }).spread((authenticated, user) => {
    if (!authenticated) {
      return [ false, null ];
    }

    // Authenticated, create the token
    var token = nJwt.create({ sub: user.id }, request.server.settings.app.security.key);

    return request.server.app.cache.session.setAsync(token.body.jti, token.body, 0).return([ authenticated, token ]);
  }).spread((authenticated, token) => {
    if (!authenticated) {
      return reply(Boom.unauthorized('Invalid Login'));
    }

    var tok = token.compact();

    reply({ token: tok }).state(request.server.settings.app.security.cookie.name, {
      jti: token.body.jti,
      token: tok
    });
  });
};
