const sql = require("./db.js");
const moment = require('moment');
const { json } = require("body-parser");

// constructor
const Passes = function(passes) {
    this.passes_pass_id = passes_pass_id;
    this.passes_timestamp = passes_timestamp; 
    this.passes_station_id = passes_station_id; 
    this.passes_vehicle_id = passes_vehicle_id;
    this.passes_charge = passes_charge;
};

Passes.getPasses = (station_id, date_from, date_to, result) => {
  const dateForm = 'YYYY-MM-DD HH:mm:ss';
  const reqTimestamp = moment().format(dateForm);
  sql.query(`SELECT *
            FROM passes
            INNER JOIN vehicles
            ON passes.passes_vehicle_id = vehicles.vehicles_vehicle_id 
            INNER JOIN stations
            ON passes.passes_station_id = stations.stations_station_id
            WHERE passes_timestamp >= '${date_from}' AND passes_timestamp <= '${date_to}' AND passes_station_id = '${station_id}';`
            , function(err, rows) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var string = JSON.stringify(rows);
    var json_res = JSON.parse(string);
    var where;
    list = new Array();
    for (var i = 0; i < rows.length; i++){
      var temp = i.toString();
      if (json_res[i].vehicles_tag_prov == json_res[i].stations_station_prov) {
        where = "home";
      }
      else
      {
        where = "away";
      }
      list.push({
        PassIndex : temp,
        PassID : json_res[i].passes_pass_id,
        PassTimeStamp : json_res[i].passes_timestamp,
        VehicleID: json_res[i].passes_vehicle_id,
        TagProvider: json_res[i].vehicles_tag_prov,
        PassType: where,
        PassCharge: json_res[i].passes_charge,
      });
    }
    var string_list = JSON.stringify(list)
    var passesList = JSON.parse(string_list) 
    const sendRes = {
      PeriodFrom: moment(date_from).format(dateForm),
      PeriodTo: moment(date_to).format(dateForm),
      NumberOfPasses: JSON.parse(rows.length.toString()),
      PassesList : passesList
    };
    if (rows.length) {
      console.log("found passes: \n", sendRes);
      result(null, sendRes);
      return;
    }

    // not found Passes with the id
    result({ kind: "not_found" }, null);
  });
};

Passes.getPassesCost = (op1_id, op2_id, date_from, date_to, result) => {
  const dateForm = 'YYYY-MM-DD HH:mm:ss';
  const reqTimestamp = moment().format(dateForm);
  sql.query(`SELECT COUNT(passes_pass_id) as no_of_passes, SUM(passes_charge) as dept
            FROM passes
            INNER JOIN vehicles
            ON passes.passes_vehicle_id = vehicles.vehicles_vehicle_id 
            INNER JOIN stations
            ON passes.passes_station_id = stations.stations_station_id
            WHERE passes_timestamp >= '${date_from}' 
              AND passes_timestamp <= '${date_to}' 
              AND LEFT(passes_station_id, 2) = '${op1_id}' 
              AND vehicles_tag_abbr = '${op2_id}';`
            , function(err, rows) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var string = JSON.stringify(rows);
    var json_res = JSON.parse(string);
    const sendRes = {
      op1_ID: op1_id,
      op2_ID: op2_id,
      RequestTimestamp: reqTimestamp,
      PeriodFrom: moment(date_from).format(dateForm),
      PeriodTo: moment(date_to).format(dateForm),
      NumberOfPasses: json_res[0].no_of_passes,
      PassesCost : json_res[0].dept
    };
    if (rows.length) {
      console.log("found passes: \n", sendRes);
      result(null, sendRes);
      return;
    }

    // not found Passes with the id
    result({ kind: "not_found" }, null);
  });
};

Passes.getAll = (passes_station_id, result) => {
  const dateForm = 'YYYY-MM-DD HH:mm:ss';
  const reqTimestamp = moment().format(dateForm);
  let query = "SELECT * FROM passes";

  if (passes_station_id) {
    query += ` WHERE passes.passes_station_id LIKE '${passes_station_id}'`;
  }

  sql.query(query, function (err, rows) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    var string = JSON.stringify(rows)
    var json_res = JSON.parse(string)


    console.log("passes: ", json_res);
    result(null, json_res);
  });
};

Passes.passesAnalysis = (op1_id, op2_id, date_from, date_to, result) => {
  const dateForm = 'YYYY-MM-DD HH:mm:ss';
  const reqTimestamp = moment().format(dateForm);
  sql.query(`SELECT *
            FROM passes 
            LEFT JOIN vehicles 
            ON passes.passes_vehicle_id = vehicles.vehicles_vehicle_id 
            WHERE LEFT(passes_station_id, 2) = '${op1_id}' AND vehicles_tag_abbr = '${op2_id}' AND passes_timestamp > '${date_from}' AND passes_timestamp < '${date_to}';`, function (err, rows)  {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var string = JSON.stringify(rows)
    var json_res = JSON.parse(string)

    list = new Array();
    for (var i = 0; i < rows.length; i++){
      list.push({
        PassIndex : i + 1,
        PassID : json_res[i].passes_pass_id,
        StationID : json_res[i].passes_station_id,
        TimeStamp : moment(json_res[i].passes_timestamp).format(dateForm),
        VehicleID : json_res[i].passes_vehicle_id,
        Charge : json_res[i].passes_charge
      });
    }
    var string_list = JSON.stringify(list)
    var passesList = JSON.parse(string_list) 
    const sendRes = {
      op1_ID : op1_id,
      op2_ID : op2_id,
      requestedTimestamp : reqTimestamp,
      PeriodFrom : moment(date_from).format(dateForm),
      PeriodTo : moment(date_to).format(dateForm),
      NumberOfPasses : rows.length,
      PassesList : passesList
    };
    

    if (rows.length) {
      console.log("found passes: \n", sendRes);
      result(null, sendRes);
      return;
    }

    // not found Passes with the id
    result({ kind: "not_found" }, null);
  });
};

Passes.chargesBy = (op_id, date_from, date_to, result) => {
  const dateForm = 'YYYY-MM-DD HH:mm:ss';
  const reqTimestamp = moment().format(dateForm);
  sql.query(`WITH temp1(no_of_passes, total_charge, vehicles_tag_abbr) AS
	              (SELECT COUNT(passes_pass_id) AS no_of_passes, SUM(passes_charge) AS total_charge, vehicles_tag_abbr
	              FROM passes LEFT JOIN vehicles
	              ON passes.passes_vehicle_id = vehicles.vehicles_vehicle_id
	              WHERE LEFT(passes_station_id, 2) = '${op_id}' AND vehicles_tag_abbr != '${op_id}' AND passes_timestamp > '${date_from}' AND passes_timestamp < '${date_to}'
	              GROUP BY vehicles_tag_abbr
	              ORDER BY vehicles_tag_abbr),
            temp2(dept, passes_station_id) AS 
	              (SELECT SUM(passes_charge) AS dept, LEFT(passes_station_id, 2)
	              FROM passes LEFT JOIN vehicles
	              ON passes.passes_vehicle_id = vehicles.vehicles_vehicle_id
	              WHERE LEFT(passes_station_id, 2) != '${op_id}' AND vehicles_tag_abbr = '${op_id}' AND passes_timestamp > '${date_from}' AND passes_timestamp < '${date_to}'
	              GROUP BY LEFT(passes_station_id, 2)
	              ORDER BY LEFT(passes_station_id, 2))
            SELECT no_of_passes, total_charge, dept, (total_charge - IFNULL(dept,0)) as owe, vehicles_tag_abbr
            FROM temp1 LEFT JOIN temp2 ON temp1.vehicles_tag_abbr = temp2.passes_station_id
            WHERE total_charge > IFNULL(dept,0)`, function (err, rows)  {

    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var string = JSON.stringify(rows)
    var json_res = JSON.parse(string)

    list = new Array();
    for (var i = 0; i < rows.length; i++){
      list.push({
        VisitingOperator : json_res[i].vehicles_tag_abbr,
        NumberOfPasses : json_res[i].no_of_passes,
        PassesCost : json_res[i].owe,
      });
    }
    var string_list = JSON.stringify(list)
    var ppoList = JSON.parse(string_list) 
    const sendRes = {
      op_ID : op_id,
      requestedTimestamp : reqTimestamp,
      PeriodFrom : moment(date_from).format(dateForm),
      PeriodTo : moment(date_to).format(dateForm),
      PPOList : ppoList
    };
    

    if (rows.length) {
      console.log("found passes: \n", sendRes);
      result(null, sendRes);
      return;
    }

    // not found Passes with the id
    result({ kind: "not_found" }, null);
  });
};


module.exports = Passes;