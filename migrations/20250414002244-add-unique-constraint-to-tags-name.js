'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Tags', {
      fields: ['name'],
      type: 'unique',
      name: 'tags_name_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Tags', 'tags_name_unique');
  }
};