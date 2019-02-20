const { TE, to } = require("../services/util.service");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define("Comodo", {
    name: DataTypes.STRING
  });

  Model.associate = function(models) {
    this.Users = this.belongsToMany(models.User, { through: "UserComodo" });
  };

  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
