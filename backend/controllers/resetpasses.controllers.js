const db = require ("../models/db.js");

exports.resetpasses = (req, res) => {
    db.query( `DELETE FROM passes`, function(err, rows) {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({status : "failed"});
            result(err, null);
            return;
          }
        else {
            console.log(`reset completed, '${rows.affectedRows}' passes deleted`);
            res.status(200).send({status : "OK"});
            return;
        }
    });
};
