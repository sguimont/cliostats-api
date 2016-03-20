var Promise = require('bluebird');
var Glob = Promise.promisify(require('glob'));

exports.register = function (server, options, next) {

  server.log([ 'info', 'registration', 'module' ], 'Registering [Public] Module');

  Glob(__dirname + '/*/').then((files) => {
    return Promise.each(files, (file) => {
      return new Promise((resolve, reject) => {
        var module = require(file);

        if (module.hasOwnProperty('register') && typeof(module.register) === 'function') {
          module.register(server, options, resolve);
        }
      });
    });
  }).then(() => next());
};

exports.register.attributes = {
  pkg: require('./package.json')
};
