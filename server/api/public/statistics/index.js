var controllers = {
  stats: require('./controllers/stats.controller')
};

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Public/Statistics] Module');

  server.route({
    path: '/stats',
    method: 'POST',
    handler: controllers.stats.handler,
    config: controllers.stats.config
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
