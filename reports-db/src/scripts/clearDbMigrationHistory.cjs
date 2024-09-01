const path = require('path');
const Sequelize = require('sequelize');
// const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../sequelize.config.js'));

const sequelize = new Sequelize(config);

sequelize.query('DROP TABLE IF EXISTS public."SequelizeMeta"')
  .then(function() {
    console.log('Query executed successfully');
  })
  .catch(function(err) {
    console.error(err);
  });