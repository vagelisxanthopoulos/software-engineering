let barChart_1 = document.getElementById('barChart_1').getContext('2d');
let pieChart_1 = document.getElementById('pieChart_1').getContext('2d');
let barChart_2 = document.getElementById('barChart_2').getContext('2d');
let pieChart_2 = document.getElementById('pieChart_2').getContext('2d');const sb = document.querySelector('btn');
const operator = document.querySelector('#operators');
let init = 0;
let start_date = "2020-06-13%2000:00:00" ;
let end_date = "2022-02-25%2000:00:00" ;

$(function() {
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function(start, end, label) {
    start_date = start.format('YYYY-MM-DD'); 
    start_date = start_date.concat("%2000:00:00");
    end_date = end.format('YYYY-MM-DD');
    end_date = end_date.concat("%2000:00:00");
  });
});

function clickFunction() {

  const Url = `http://localhost:9103/interoperability/api/ChargesBy/${operator.value}/${start_date}/${end_date}`
  async function getRequest() {
      const response = await axios.get(Url);
      return  response;
  }
  let res_data = getRequest();

  var op_id;
  var ppoList;
  var operators = [];
  var passesCost = [];
  var passes = []
  res_data
      .then(function(result) {
          op_id = result.data.op_ID;
          ppoList = result.data.PPOList;
          for (i=0; i < ppoList.length; i++) {
              operators.push(ppoList[i].VisitingOperator)
          }
          for (i=0; i < ppoList.length; i++) {
              passesCost.push(ppoList[i].PassesCost)
              passes.push(ppoList[i].NumberOfPasses)
          }
          console.log(operators);
          console.log(passesCost);
          console.log(result.data);
          console.log(passes);
          console.log(init);
          
          if (init === 0) {
            init = init + 1;
            var barColors = ["red", "green","blue","orange","brown","purple"];
              chart1 = new Chart("barChart_1", {
                type: "bar",
                data: {
                  labels: operators,
                  datasets: [{
                    backgroundColor: barColors,
                    data: passesCost,
                    label: "Charges by Operator"
                  }]
                },
              });
              chart2 = new Chart("pieChart_1", {
                  type: "pie",
                  data: {
                    labels: operators,
                    datasets: [{
                      backgroundColor: barColors,
                      data: passesCost,
                      label: "Charges by Operator"
                    }]
                  }
                });
                chart3 = new Chart("barChart_2", {
                  type: "bar",
                  data: {
                    labels: operators,
                    datasets: [{
                      backgroundColor: barColors,
                      data: passes,
                      label: "Passes by Operator"
                    }]
                  },
                });
                chart4 = new Chart("pieChart_2", {
                  type: "pie",
                  data: {
                    labels: operators,
                    datasets: [{
                      backgroundColor: barColors,
                      data: passes,
                      label: "Passes by Operator"
                    }]
                  },
                });
            }
          else {
            chart1.data.labels = operators;
            chart1.data.datasets[0].data = passesCost;
            chart2.data.labels = operators;
            chart2.data.datasets[0].data = passesCost;
            chart3.data.labels = operators;
            chart3.data.datasets[0].data = passes;
            chart4.data.labels = operators;
            chart4.data.datasets[0].data = passes;
            chart1.update('active');
            chart2.update('active');
            chart3.update('active');
            chart4.update('active');
            
          }
          //table.remove();
          var table = document.getElementById('sum_table');
          var rowCount = table.rows.length;
          for (var i = 1; i < rowCount; i++) {
              table.deleteRow(1);
}
          for (var i = 0; i < operators.length; i++) {
            var row = `<tr>
                        <td>${operators[i]}</td>
                        <td>${passes[i]}</td>
                        <td>${passesCost[i]}</td>
                      </tr>`
            table.innerHTML += row ;
          }
      })

  };