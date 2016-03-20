var Promise = require('bluebird');
var mongoose = require('mongoose');

var Glob = Promise.promisify(require('glob'));

var loadModels = function (server) {
  var lookupPath = server.settings.app.mongo.models;

  return Glob(lookupPath).then((files) => {
    return Promise.each(files, (file) => {
      var model = require(file);

      if (model.hasOwnProperty('register') && typeof(model.register) === 'function') {
        model = model.register(server);
      }

      if (model.schema instanceof mongoose.Schema) {
        server.expose(model.modelName, model);
        server.log([ 'info', 'registration', 'model' ], 'Registering [' + model.modelName + '] Model');
      }
      else {
        server.log([ 'error', 'registration', 'mode;' ], 'File [' + file + '] does not contain a mongoose model, ignored');
      }
    });
  });
};

exports.register = function (server, options, next) {
  server.log([ 'info', 'registration', 'module' ], 'Registering [Mongoose] Module');

  mongoose.Promise = require('bluebird');
  mongoose.plugin(require('mongoose-timestamp'));
  mongoose.plugin(require('mongoose-hidden')({
    defaultHidden: {
      _id: true,
      __v: true
    }
  }));

  var uri = server.settings.app.mongo.uri;
  var opts = server.settings.app.mongo.options;

  mongoose.connection.on('open', () => server.log([ 'info', 'database', 'mongodb' ], 'Open to MongoDB @ ' + uri));
  mongoose.connection.on('connected', () => server.log([ 'info', 'database', 'mongodb' ], 'Connected to MongoDB @ ' + uri));
  mongoose.connection.on('error', (e) => server.log([ 'error', 'database', 'mongodb' ], 'MongoDB ' + e.message));
  mongoose.connection.on('disconnected', () => server.log([ 'warn', 'database', 'mongodb' ], 'MongoDB was disconnected'));

  mongoose.connect(uri, opts).then(() => {
    return loadModels(server)
      .then(() => next())
      .catch((e) => server.log([ 'error', 'database', 'mongoose' ], 'Unable to load models: ' + e));

  }).catch((e) => {
    server.log([ 'error', 'database', 'mongodb' ], 'Unable to connect to MongoDB: ' + e.message);
    process.exit();
  });

};

exports.register.attributes = {
  pkg: require('./package.json')
};
