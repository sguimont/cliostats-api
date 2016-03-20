const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Boom = require('boom')
const Server = require(process.env.PWD + '/server')
const User = require(process.env.PWD + '/server/models/user')

lab.experiment('Security', () => {
  var server

  var TEST_USER = {
    email: 'user@test.com',
    password: 'test',
    name: 'test',
    modifiedBy: 'test'
  }

  lab.before((done) => {
    Server
      .then((instance) => {
        server = instance
      })
      .then(() => {
        return User.remove({}).then(() => {
          var u = new User(TEST_USER)
          return u.save()
        })
      })
      .then(() => done())
      .catch(done)
  })

  lab.experiment('Login', () => {
    lab.test('should failed when parameters are missing', (done) => {
      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {}
      }).then((response) => {
        Code.expect(response.statusCode).to.equal(Boom.badRequest().output.statusCode)
      }).then(done)
        .catch(done)
    })

    lab.test('should failed when email is not valid', (done) => {
      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          email: 'non-email'
        }
      }).then((response) => {
        Code.expect(response.statusCode).to.equal(Boom.badRequest().output.statusCode)
      }).then(done)
        .catch(done)
    })

    lab.test('should authenticate', (done) => {
      server.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          email: TEST_USER.email,
          password: TEST_USER.password
        }
      }).then((response) => {
        Code.expect(response.statusCode).to.equal(200)
      }).then(done)
        .catch(done)
    })
  })
})
