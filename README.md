# Emily-bot
A discord administration bot, currently under development

A live version of this bot is available at http://dev.emi.gg

## Installation

`npm install` on both front/ and emily-backend
`npm run build` on front/
`npm run start` on emily-backend/

Will serve the built React App at http://localhost:80 by default


## Env files
The React App uses the environment variable `REACT_APP_API_URI` to determine where to send API requests, by default it is to http://localhost:80
However for production via a .env.production you should point it to the website domain, eg. http://emi.gg:3000

The back-end also uses a .env file with the following:

`CLIENT_ID` - The Client ID of the Discord Application, you can obtain this at https://discordapp.com/developers/applications/
`CLIENT_SECRET` - The Client Secret of the Discord Application
`BOT_TOKEN` - The token of the Discord Application that authorizes API requests
`PORT` - The port of which you wish the server to run on, by default if not specified this is set to 80
`ROOT_URI` - The root URI used for redirect URIs from Discord's OAuth2, by default this is set to http://localhost
`MONGO_DB` - The connection string used to connect to the MongoDB database

Note: You will need to add an authorized redirect_uri to the Discord Application for the OAuth2 requests to work properly.
E.g. http://emi.gg:3000/api/oauth2/callback

