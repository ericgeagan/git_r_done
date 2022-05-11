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

