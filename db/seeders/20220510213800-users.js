'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkInsert('Users', [{
        username: 'test',
        email: 'test@test.com',
        hashedPassword: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jujube',
        email: 'jujube@test.com',
        hashedPassword: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'darthvader42069',
        email: 'darthvader42069@test.com',
        hashedPassword: 'password',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    
    
    
    ], {});
  
  },

  down: (queryInterface, Sequelize) => {
  
      Example:
      return queryInterface.bulkDelete('Users', null, {});
  
  }
};
