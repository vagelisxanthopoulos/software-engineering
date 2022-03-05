const db = require ("../models/db.js");
const dbconfig = require("../config/db.config.js");


exports.healthcheck = (req, res) => {
    if(db.state === 'disconnected'){
      const respond = { status: 'failed', message: 'server down'};
      res.status(500).send(respond);
    }
    else {
      respond = { status : 'OK',
                  dbconnection : { Server : dbconfig.host, Database : dbconfig.database, Uid : dbconfig.user, Pwd : dbconfig.password } 
                };
      res.status(200).send(respond);
    }
  };  

