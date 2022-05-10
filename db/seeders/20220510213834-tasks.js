'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    
     return queryInterface.bulkInsert('Tasks', [
       {
      
      name: "Do Coding Homework",
      priority: 2,
      createdAt: new Date(),
      repeating: true,
      completed: true,
      estimatedTime: 5,
      note: null,
      listId: 1 ,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Make dinner",
      priority: 3,
      createdAt: new Date(),   
      repeating: true,
      completed: false,
      estimatedTime: 3,
      note: "Up-sized client-driven model",
      listId: 2,
      dueDate: new Date(),   
      updatedAt: new Date()   
    }, {
      
      name: "Do laundry",
      priority: 2,
      createdAt: new Date(),    
      repeating: false,
      completed: true,
      estimatedTime: 2,
      note: "Total holistic hub",
      listId: 5,
      dueDate: new Date(),
      updatedAt: new Date()   
    }, {
      
      name: "Buy flight",
      priority: 3,
      createdAt: new Date(), 
      repeating: false,
      completed: false,
      estimatedTime: 5,
      note: "Open-architected next generation strategy",
      listId: 4,
      dueDate: new Date(), 
      updatedAt: new Date()
    }, {
      
      name: "Go swimming",
      priority: 1,
      createdAt: new Date(),
      repeating: true,
      completed: true,
      estimatedTime: 1,
      note: "Down-sized reciprocal monitoring",
      listId: 3,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Plan out the week",
      priority: 1,
      createdAt: new Date(),
      repeating: false,
      completed: false,
      estimatedTime: 3,
      note: "Pre-emptive multimedia toolset",
      listId: 4,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Remember the milk",
      priority: 1,
      createdAt: new Date(),
      repeating: true,
      completed: true,
      estimatedTime: 6,
      note: "Reactive tangible initiative",
      listId: 1,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Recycle the plastic",
      priority: 1,
      createdAt: new Date(),
      repeating: false,
      completed: true,
      estimatedTime: 5,
      note: "Open-architected 4th generation structure",
      listId: 4,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Go listen to some music",
      priority: 2,
      createdAt: new Date(),
      repeating: false,
      completed: false,
      estimatedTime: 2,
      note: "Focused leading edge local area network",
      listId: 1,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Get a girlfriend",
      priority: 3,
      createdAt: new Date(),
      repeating: false,
      completed: false,
      estimatedTime: 6,
      note: "Team-oriented optimizing structure",
      listId: 2,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Request vacation days",
      priority: 1,
      createdAt: new Date(),
      repeating: true,
      completed: true,
      estimatedTime: 2,
      note: "Centralized motivating hierarchy",
      listId: 2,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Find a job",
      priority: 3,
      createdAt: "09/21/2021",
      repeating: false,
      completed: true,
      estimatedTime: 3,
      note: "Sharable eco-centric productivity",
      listId: 2,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
      
      name: "Clean the bathroom",
      priority: 1,
      createdAt: new Date(),
      repeating: true,
      completed: true,
      estimatedTime: 4,
      note: null,
      listId: 3,
      dueDate: null,
      updatedAt: new Date()
    }, {
      
      name: "Learn to code",
      priority: 1,
      createdAt: new Date(),
      repeating: false,
      completed: true,
      estimatedTime: 4,
      note: null,
      listId: 2,
      dueDate: new Date(),
      updatedAt: new Date()
    }, {
    
      name: "Put pictures on wall",
      priority: 1,
      createdAt: new Date(),
      repeating: true,
      completed: false,
      estimatedTime: 2,
      note: "Re-engineered coherent flexibility",
      listId: 2,
      dueDate: new Date(),
      updatedAt: new Date()
    }
  ]
      , {});
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Tasks', null, {});
    
  }
};
