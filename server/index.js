// Global
global.ROOT = __dirname;
if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

var Promise = require('bluebird');
var Glue = require('glue');

var manifest = require('./manifest');
var options = {
  relativeTo: __dirname
};

module.exports = Glue.compose(manifest, options).then((server) => {

    // test view: TODO remove this
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply.file(ROOT + '/static/index.html');
      },
      config: { auth: false }
    });

    // init caches
    server.app.cache = {};
    server.app.cache.session = Promise.promisifyAll(server.cache({
      segment: 'sessions',
      expiresIn: server.settings.app.security.ttl
    }));

    return Promise.resolve(server).call('start').return(server);
  })
  .then((server) => {
    server.log([ 'info', 'server' ], 'Server running at:' + server.info.uri);
    return server;
  })
  .catch((e) => console.error(e));
