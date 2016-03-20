const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const User = require(process.env.PWD + '/server/models/user')

lab.experiment('Models', () => {
  lab.experiment('User', () => {
    lab.beforeEach((done) => {
      User.remove({})
        .then(() => done())
        .catch(done)
    })

    lab.test('should have a default id', (done) => {
      var u = new User({
        name: 'test',
        email: 'test@test.com',
        modifiedBy: 'test'
      })
      u.save().then((user) => {
        Code.expect(user.id).to.be.a.string
        done()
      })
    })

    lab.test('should have a hashed password', (done) => {
      var data = {
        name: 'test',
        email: 'test@test.com',
        password: 'test',
        modifiedBy: 'test'
      }

      new User(data).save().then((user) => {
        Code.expect(user.password).to.be.a.string
        Code.expect(user.hashed_password).to.not.be.equal(data.password)
        done()
      })
    })

    lab.test('should failed when modifiedBy not specified', (done) => {
      var u = new User({
        name: 'test',
        email: 'test@test.com'
      })

      u.save().then(() => {
        Code.fail('User has been created without modifiedBy attribute')
      }).catch((e) => {
        Code.expect(e).to.be.not.null
        done()
      })
    })

    lab.test('should load an user by email', (done) => {
      var TEST_USERS = [
        {
          name: 'test1',
          email: 'test1@test.com',
          modifiedBy: 'test'
        },
        {
          name: 'test2',
          email: 'test2@test.com',
          modifiedBy: 'test'
        }
      ]

      User.create(TEST_USERS)
        .then(() => {
          return User.loadByEmail()
        })
        .then((user) => {
          Code.expect(user).to.be.null
        })
        .then(() => {
          return User.loadByEmail('test1@test.com')
        })
        .then((user) => {
          Code.expect(user).to.be.not.null
          Code.expect(user).to.be.an.object()
          Code.expect(user.email).to.be.equal(TEST_USERS[ 0 ].email)

          return User.loadByEmail('non-exist')
        })
        .then((user) => {
          Code.expect(user).to.be.null
        })
        .then(() => done())
    })
  })
})
