var controllers = {
  login: require('./controllers/login.controller'),
  logout: require('./controllers/logout.controller'),
  register: require('./controllers/register.controller')
};

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Public/Security] Module');

  server.route({
    path: '/login',
    method: 'POST',
    handler: controllers.login.handler,
    config: controllers.login.config
  });

  server.route({
    path: '/register',
    method: 'POST',
    handler: controllers.register.handler,
    config: controllers.register.config
  });

  server.route({
    path: '/logout',
    method: 'GET',
    config: controllers.logout.config,
    handler: controllers.logout.handler
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
