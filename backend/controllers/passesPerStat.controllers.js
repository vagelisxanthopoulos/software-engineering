const Passes = require("../models/passes.models.js");

exports.getPasses = (req, res) => {
    Passes.getPasses(req.params.stationID, req.params.date_from, req.params.date_to, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Passes with station_id ${req.params.stationID}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Passes from station id " + req.params.stationID
          });
        }
      } 
      else res.send(data);
    });
  };
  