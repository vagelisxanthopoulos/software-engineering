const db = require ("../models/db.js");
const path = require('path');
const fs = require('fs');

exports.resetstations = (req, res) => {
    const stations_sql = fs.readFileSync(path.join(__dirname, '../../database/stations-data.sql')).toString();
    const dataArr = stations_sql.toString().split('\n');
    dataArr.forEach(element => {
        db.query(element, (err, rows) => {
            if (err) {
                console.log("error : ", err)
                res.status(500).send({status : "failed"});
                result(err, null);
                throw err;
            }
        });
    });
    console.log(`reset completed, stations inserted`);
    res.status(200).send({status : "OK"});
};
