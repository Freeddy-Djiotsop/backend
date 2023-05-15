'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pokemon.init({
    name: DataTypes.STRING,
    power: DataTypes.INTEGER,
    life: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    types: {
      type: DataTypes.STRING,
      get: function() {
        return this.getDataValue('types').split(',');
      },
      set: function(x) {
        return this.setDataValue('types', x.join());
      }
    }
  }, {
    sequelize,
    modelName: 'Pokemon',
  });
  return Pokemon;
};