# UndercoverDucks
Repository for PSA codesprint 2023 submission.

[https://undercover-ducks.fly.dev/](https://undercover-ducks.fly.dev/)

Public account:

Username: `test`

Password: `test`

## About

PSA has implemented mechanisms to predict the changes in incoming and outgoing ships in Singapore ports. 
However, manual prediction is required when a sudden change of events happens. 
This means that the translation of actual events to impacts on Singapore ports are evaluated manually, which are prone to errors.

In our web app, UndercoverDucks, we introduce the capability to quantify the impacts of real world events on Singapore. 
Given the knowledge on current worldwide ship movements, our algorithm can predict the changes in ship volume in Singapore 
within the subsequent weeks in the event of a major disruption. 
This is achieved via a Markov chain model, where the volume at a point of time in future can be predicted 
using the current volumes of ship and knowledge on worldwide ship movements.

This prediction allows PSA to scale up or scale down its operation based on the predicted volume of ships arriving in Singapore, thereby minimising costs.

We also provide a web user interface where authenticated users can adjust the current knowledge on ship movements, 
as well as port details, subsequently simulate the changes to ship volumes to ports worldwide in future weeks.

## Features

### List all ports

Our web app lists the current ports in our database, and provides a focus view in the dashboard with ports relevant to the user.
We allow users to add new ports to the database.

### Display details of each port

Details include name, country and current ship volume. 
We also provide predictions of ship volume of the port within the next 10 weeks.

### Display details of traffic between each pair of ports

Details include, in both directions, proportion index, which is the proportion of ships arriving at port B that is from port A,
and diversion index, which represents the likelihood of a ship from port A not being able to reach its destination to be diverted to port B.

### Simulate events

The user can edit the data between any two ports, or shut down a port, so as to simulate a real event.
The predictions of future ship volumes at ports are adjusted according to the new insights and information.

## Development

### Frontend
1. In the terminal, redirect to the `dashboard` folder, `cd dashboard`.
1. Run `npm i` to install the necessary libraries. Libraries installed include:
  * `node-sass`
  * `react-router-dom`
  * `bootstrap`
1. Run `npm start` to start the React development server.

Folder organisation:
1. `router` contains the router and the children elements.
1. `compoenents` contains reusable components.
1. `page` contains the main simulation page.

### Backend
1. In the terminal, redirect to the `backend` folder, `cd backend`.
1. Make sure that you have the correct `.env` file in the folder.
1. Run `python index.py` to start the development server.

Folder organisation:
1. `db` contains models to be migrated by `sqlalchemy`.
1. `markov` contains Markov model for prediction.
1. `routes` contains the routes for the respective apps.
1. `data` contains python scripts to populate the db upon first launch.

### Markov model
1. Redirect to the markov model folder, `cd backend/markov`.
