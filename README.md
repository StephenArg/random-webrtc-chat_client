# CleanChat

###### Online chat website that pairs random users for webcam and text-based conversations.

### Clone and run application

* Run rails back end
  ```bash
  git clone https://github.com/StephenArg/random-webrtc-chat_api.git
  bundle install
  rails db:create
  rails db:migrate
  rails s
  ```
  *** Unfortunatly this project needs environmental values with Twilio account details.
  To prevent the app from breaking, add a file called app_environment_variables.rb into the config folder with the attributes:
  ENV['account_sid'] = ''
  ENV['auth_token'] = ''

* Run react front end
  ```bash
  git clone https://github.com/StephenArg/random-webrtc-chat_client.git
  yarn install
  ```
  After installing packages, create a file called `.env` in the main directory and add this line to it.
  REACT_APP_API_URL=http://localhost:3000/
  REACT_APP_WS_API_URL=ws://localhost:3000/
  After this, run `yarn start`
  
A chat application that pairs its users randomly and allows for websocket-enabled text chat and video conferencing between the participants.

## What's being used:
- React
- Rails
- ActionCable
- OpenTok Video Chat embeds
- PostgreSQL


## Stretch Features:
- Create user profiles and more customizability (Full CRUD).
- Add Redux for better state management.
- Present column alongside chat box to display previous matches with the ability to rate them, attempt to reconnect to them, block them, review past text conversations, and more.
- Create a rating system the determines which individuals a user will match with. 
- Add a nudity sensing api to auto-ban policy breaking users.
- Improve design, rework name, and add routes.