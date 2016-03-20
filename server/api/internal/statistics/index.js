var controllers = {
  stats: require('./controllers/stats.controller'),
  summary: require('./controllers/summary.controller'),
  latest: require('./controllers/latest.controller')
};

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Internal/Statistics] Module');

  server.route({
    path: '/stats/{projectId}',
    method: 'GET',
    handler: controllers.stats.handler,
    config: controllers.stats.config
  });

  server.route({
    path: '/stats/{projectId}/summary',
    method: 'GET',
    handler: controllers.summary.handler,
    config: controllers.summary.config
  });

  server.route({
    path: '/stats/{projectId}/latest',
    method: 'GET',
    handler: controllers.latest.handler,
    config: controllers.latest.config
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
