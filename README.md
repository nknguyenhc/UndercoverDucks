# UndercoverDucks
Repository for PSA codesprint 2023 submission.

## Development

### Frontend
1. In the terminal, redirect to the `dashboard` folder, `cd dashboard`.
1. Run `npm i` to install the necessary libraries. Libraries installed include:
  * `node-sass`
  * `react-router-dom`
1. Run `npm start` to start the React development server.

Folder organisation:
1. `router` contains the router and the children elements.
1. `compoenents` contains reusable components.

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
