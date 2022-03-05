const Passes = require("../models/passes.models.js");

exports.getPassesCost = (req, res) => {
    Passes.getPassesCost(req.params.op1_ID, req.params.op2_ID, req.params.date_from, req.params.date_to, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `There are not any such passes`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Passes"
          });
        }
      } 
      else res.send(data);
    });
  };
  