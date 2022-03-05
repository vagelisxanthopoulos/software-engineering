# Backend Server REST API

![NodeJS](https://img.shields.io/badge/nodeJS-v16.13.1+-blue.svg)
![Express](https://img.shields.io/badge/express-v8.1.2+-red.svg)
![mysql](https://img.shields.io/badge/mysql-v2.18.1+-blue.svg)

## Components
- RESTful API backend server.
- MySQL database.

## Dependencies on  package.json
```json
  "dependencies": {
    "body-parser": "^1.19.1",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.2",
    "moment": "^2.29.1",
    "mysql": "^2.18.1"
  }
```
## Database initialisation and configuration
  1. initialize a mySQL server
  2. run TL21-44/database/sqldump.sql file
  5. configure the /backend/config/db.config.js file

## Install and start server 
On your folder :
```bash
git clone https://github.com/ntua/TL21-44
```

Change directory backend : 
```bash
cd backend
node server.js
```
## Make requests
Access the API's endpoints via the base URL -> (http://localhost:9103/interoperability/api/)
