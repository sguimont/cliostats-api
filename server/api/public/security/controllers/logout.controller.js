var Hapi = require('hapi');
var Joi = require('joi');
var Boom = require('boom');
var nJwt = require('njwt');

/**
 * Logout
 */
module.exports.config = {
  auth: false
};

module.exports.handler = function (request, reply) {
  var payload = request.state[ request.server.settings.app.security.cookie.name ];
  request.server.app.cache.session.drop(payload.jti);
  reply('Logout').unstate(request.server.settings.app.security.cookie.name);
};
