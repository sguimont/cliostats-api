var crypto = require('crypto');
var shortid = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var updateBy = require('../plugins/mongoose/plugins/updatedby');

var UserSchema = new Schema({
  id: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true }
  },
  hashed_password: { type: String, hide: true },
  salt: { type: String, hide: true }
});

UserSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = shortid.generate();
  }

  this.email = this.email ? this.email.toLowerCase() : this.email;

  next();
});

UserSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get(function () {
  return this._password;
});

UserSchema.plugin(updateBy);

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function (plainText) {
  return this.hashPassword(plainText) === this.hashed_password;
};

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

/**
 * Hash password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
UserSchema.methods.hashPassword = function (password) {
  if (!password || !this.salt) return '';
  var salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

/**
 * Loads a user by email.
 *
 * @param {string} email The email
 * @returns {object} The user with some account information
 */
UserSchema.statics.loadByEmail = function (email) {
  if (!email) {
    email = '';
  }

  return this.findOne({ email: email.toLowerCase() }).exec();
};

module.exports = mongoose.model('User', UserSchema);
