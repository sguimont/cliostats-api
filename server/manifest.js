var GoodLogentries = require('good-logentries');
var config = require('../config');

module.exports = {

  server: {
    app: config,
    cache: {
      engine: 'catbox-redis',
      host: config.connections.redis.host,
      port: config.connections.redis.port,
      partition: config.connections.redis.partition
    }
  },

  /**
   * Server connections
   * @type {Array}
   */
  connections: [
    config.connections.api
  ],

  /**
   * Server registrations
   * @type {Array}
   */
  registrations: [
    {
      plugin: {
        register: 'good',
        options: {
          opsInterval: 1000,
          reporters: [
            {
              reporter: require('good-console'),
              events: config.logging
            },
            /*{
             reporter: new GoodLogentries(
             config.logEntries.options, {
             token : config.logEntries.token
             })
             }*/
          ]
        }
      }
    },
    {
      plugin: {
        register: 'inert',
      }
    },
    {
      plugin: {
        register: './plugins/security',
      }
    },
    {
      plugin: {
        register: './plugins/sanitizer',
      }
    },
    {
      plugin: {
        register: './plugins/mongoose',
        options: {
          promiseLibrary: require('bluebird')
        }
      },
    },
    {
      plugin: {
        register: './api/public'
      },
      options: {
        routes: {
          prefix: '/api'
        }
      }
    },
    {
      plugin: {
        register: './api/internal'
      },
      options: {
        routes: {
          prefix: '/internal'
        }
      }
    }
  ]
};
