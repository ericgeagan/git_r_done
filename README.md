# Git R Done

## Git R Done at a Glance

Git R Done is a full stack application that allows users to keep track of all their daily and future tasks, helping them organize their workflow and increase productivity. Logged in users can create a list of tasks, give each task a priority, a due date, and add notes to them. Currently, only the default user has seeded data with preset lists and tasks.

## Application Architecture
Git R Done is built on a basic html frontend with an express backend, using PostgreSQL as a database.

## Backend Overview

Git R Done uses an Express server with a PostgreSQL database.

### Backend Technologies Used

**ExpressJS**

Express was an easy choice to make for the Git R Done server. The simple data flow from the frontend to the backend with JavaScript at the core of both made for quick, easy development, with little worry about the data types being sent and received.

**PostgreSQL**

PostgreSQL was the database of choice because it is simple to work with, and is easily manipulable using Sequelize.

**Sequelize**

Sequelize was the ORM of choice for Git R Done because of how nicely it integrates with PostgreSQL. All table management and data seeding was handled neatly and simply by way of Sequelize.

## Conclusion and Next Steps

I think we are mostly happy with Git r' Done's functionality, but we'd like to add the ability to add tags to tasks and add more options to filter the tasks the user can view on the page. The main page with all the tasks listed could be formatted and stylized much better, but that would take a lot more time and experience that we don't necessarily have right now (a lot more DOM manipulation, spend a day or two fully stylizing the entire page better, adding dynamic editing, etc). However, every other page is stylized for modern design, we are proud of our work on the site so far. 
