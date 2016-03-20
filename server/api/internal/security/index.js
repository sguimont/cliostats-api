var controller = require('./controller');

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Internal/Security] Module');

  server.route({
    path: '/me',
    method: 'GET',
    handler: controller.me.handler
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
