'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Schools = require('./Schools.js')(sequelize, Sequelize);
db.Users = require('./Users.js')(sequelize, Sequelize);
db.RSOs = require('./RSOs.js')(sequelize, Sequelize);
db.RSO_members = require('./RSO_members.js')(sequelize, Sequelize);
db.Events = require('./Events.js')(sequelize, Sequelize);
db.Event_members = require('./Event_members.js')(sequelize, Sequelize);
db.Comments = require('./Comments.js')(sequelize, Sequelize);

// One school has many users
db.Schools.hasMany(db.Users, { 
  foreignKey: 'domain'
});
db.Users.belongsTo(db.Schools, {
  foreignKey: 'domain'
});

// One School has many RSOs
db.Schools.hasMany(db.RSOs, {
  foreignKey: 'domain'
});
db.RSOs.belongsTo(db.Schools, {
  foreignKey: 'domain'
});

// One School has many Events
db.Schools.hasMany(db.Events, {
  foreignKey: 'domain'
});
db.Events.belongsTo(db.Schools, {
  foreignKey: 'domain'
});

// One RSO has many Events 
db.RSOs.hasMany(db.Events, {
  foreignKey: 'rso_id'
});
db.Events.belongsTo(db.RSOs, {
   foreignKey: 'rso_id'
});

// One Event has many Comments
db.Events.hasMany(db.Comments, {
  foreignKey: 'event_id'
});
db.Comments.belongsTo(db.Events, {
   foreignKey: 'event_id'
});

// One User has many Comments
db.Users.hasMany(db.Comments, {
  foreignKey: 'user_id'
});
db.Comments.belongsTo(db.Users, {
   foreignKey: 'user_id'
});

// Many RSOs have many users
db.RSOs.belongsToMany(db.Users, {
  through: 'RSO_members',
  as: 'users',
  foreignKey: 'rso_id'
});
db.Users.belongsToMany(db.RSOs, {
  through: 'RSO_members',
  as: 'RSOs',
  foreignKey: 'user_id'
});

// Many Events have many Users
db.Events.belongsToMany(db.Users, {
  through: 'Event_members',
  as: 'users',
  foreignKey: 'event_id'
});
db.Users.belongsToMany(db.Events, {
  through: 'Event_members',
  as: 'events',
  foreignKey: 'user_id'
});

module.exports = db;
