# Backend

## Authentication
### `/register` : user signup
### `/login` : user login
### `/logout` : user logout
- bcrypt for storing passwords securely
- jwtToken for user authentication
- OAuth 2.0 for google-login

## Movies
### `/movies` : Get all movies
### `/movies/:id` : Get movie by id
- fetching all movies
- fetching movie by id in search

## Search
### `/search/:userInput` : Get results for user input
- employed autocomplete
- employed fuzzy search and semantic search

## Subscription
### `/subscription/` : Get all subscription plans
### `/subscription/:id` : Get details about a subscription plan
- Displaying all subscription plans
- Displaying details for a subscription plan

## User
### `/users/:id` : Get user details
### `/users/:id` : Update user details
### `/users/subscription/` : Get user subscription details
### `/users/subscription/:id` : Get subscription options for user to upgrade
### `/users/:id/movies/watched` : Get all watched movies
### `/users/:id/movies/topPicks` : Get top movie picks for user
### `/users/:id/resetPassword` : Reset password for user
### `/users/:id/photo` : Get user profile picture
### `/users/:id/photo` : Update user profile picture
- Fetch user details
- Fetch user subscription details
- Update user details
- Upgrade subscription
- Watched movies
- Top movie picks

## Video
### `/video/player/:id` : Play video

