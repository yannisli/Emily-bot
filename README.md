# Emily-bot
A discord administration bot, currently under development

A live version of this bot is available at https://emi.gg

## Installation

`npm install` on both front/ and emily-backend

`npm run build` on front/

`npm run start` on emily-backend/

This will serve the built React App at http://localhost:80 by default


### Optional

You can have the application run via HTTPS by providing the following files in emily-backend:

Private Key filename - `PRIVATE_KEY`
Certificate filename - `CERTIFICATE`
CA Certificate filename - `CA_CERTIFICATE`

Please point to these via a .env file in emily-backend/

## Env files
The React App uses the environment variable `REACT_APP_API_URI` to determine where to send API requests, by default it is to http://localhost:80

However for production via a .env.production you should point it to where the website is hosted, eg. https://emi.gg:3000

The back-end also uses a .env file with the following:

`CLIENT_ID` - The Client ID of the Discord Application, you can obtain this at https://discordapp.com/developers/applications/

`CLIENT_SECRET` - The Client Secret of the Discord Application

`BOT_TOKEN` - The token of the Discord Application that authorizes API requests

`PORT` - The port of which you wish the server to run on, by default if not specified this is set to 80

`ROOT_URI` - The root URI used for redirect URIs from Discord's OAuth2, by default this is set to http://localhost:80

`MONGO_DB` - The connection string used to connect to the MongoDB database


Note: You will need to add an authorized redirect_uri to the Discord Application for the OAuth2 requests to work properly.
E.g. https://emi.gg:443/api/oauth2/callback

