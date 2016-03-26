var Hapi = require('hapi');
var Joi = require('joi');
var Boom = require('boom');
var nJwt = require('njwt');

module.exports.config = {
  state: {
    parse: true,
    failAction: 'log'
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().alphanum().min(3).max(30).required(),
      firstname: Joi.string(),
      lastname: Joi.string()
    }
  },
  plugins: {
    sanitizer: {
      payload: {
        email: 'escape|normalize_email',
        firstname: 'escape',
        lastname: 'escape'
      }
    }
  },
  auth: false
};

module.exports.handler = function (request, reply) {
  var data = {
    email: request.payload.email,
    name: request.payload.firstname + ' ' + request.payload.lastname,
    password: request.payload.password,
    modifiedBy: 'public'
  };

  var User = request.server.plugins.mongoose.User;
  new User(data).save().then((user) => {
    reply(user);
  }).catch((e) => {
    if (e.code === 11000) {
      return reply(Boom.conflict('User already exists'));
    }
    reply(Boom.badImplementation(e));
  });
};
