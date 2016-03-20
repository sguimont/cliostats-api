module.exports = exports = (schema) => {

  schema.add({ updatedBy: String });

  schema.virtual('modifiedBy').set(function (user) {
    this._updatedByCalled = true;
    this.updatedBy = user;
  });
  schema.pre('save', function (next) {
    if (this._updatedByCalled) {
      delete this._updatedByCalled;
      return next();
    }

    next(new Error('Attribute [modifiedBy] has not been set before saving!'));
  });

};
