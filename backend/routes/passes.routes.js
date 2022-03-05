module.exports = app => {
    const passesByStation = require("../controllers/passesByStation.controllers.js");
    const passesAnalysis = require("../controllers/passesAnalysis.controllers.js");
    const chargesBy = require("../controllers/chargesBy.controllers.js");
    const passesPerStat = require("../controllers/passesPerStat.controllers.js");
    const passesCost = require("../controllers/passesCost.controllers.js");
    const healthcheck  = require("../controllers/healthcheck.controllers.js");
    const resetpasses = require("../controllers/resetpasses.controllers.js");
    const resetstations = require("../controllers/resetstations.controllers.js");
    const resetvehicles = require("../controllers/resetvehicles.controllers.js");
  
    var router = require("express").Router();
    
    // Retrieve PassesAnalysis
    router.get("/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to", passesAnalysis.getPasses);
  
    // Retrieve passesByStationID
    router.get("/", passesByStation.getAll);

    // Retrieve ChargesBy
    router.get("/ChargesBy/:op_ID/:date_from/:date_to", chargesBy.getChargesBy);

    // Retrieve passes per station in a specific time frame
    router.get("/PassesPerStation/:stationID/:date_from/:date_to", passesPerStat.getPasses);

    // Retrieve PassesCost
    router.get("/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to", passesCost.getPassesCost);

    // check end to end connectivity
    router.get("/admin/healthcheck", healthcheck.healthcheck);

    // reset passes records
    router.post("/admin/resetpasses", resetpasses.resetpasses);
    
    // reset stations 
    router.post("/admin/resetstations", resetstations.resetstations);

    // reset vehicles 
    router.post("/admin/resetvehicles", resetvehicles.resetvehicles);

    app.use('/interoperability/api', router);
  };