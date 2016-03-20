var Promise = require('bluebird');

module.exports.me = {

  handler: function (request, reply) {
    reply('ME called:\n' + JSON.stringify(request.pre.user));
  }

};
