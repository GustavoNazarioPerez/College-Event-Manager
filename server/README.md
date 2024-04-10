# install dependencies
cd server
npm install

# configure mysql connection in server > config > config.json
create database 'EventManagerDB' in mysql first
ensure "username", "password", and "host" are set correctly

if not, you will get "Failed to sync db" message in console

# run server
npm run dev

will update on any save

