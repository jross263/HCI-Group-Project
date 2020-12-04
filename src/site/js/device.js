$(function() {
    const STRESS_TESTABLE = ['cpu','gpu']
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")
    const updateLineGraph = 20
    var keepData = 25
    var updateCount = 0 
   
    $("#back-btn").on("click",()=>{
        api.send(`${group}-info-unsubscribe`)
        let newURL = window.location.href.split("/")
        newURL.pop()
        newURL.push("index.html")
        newURL = newURL.join("/")
        window.location.href = newURL
    })

    if(!STRESS_TESTABLE.includes(group)){
        $("#stress-test-tab").parent().hide()
    }
    clicked = true;
    $(document).ready(function(){
      $("button").click(function(){
            if(clicked){
                $(this).css('background-color', 'red');
                document.getElementById("myButton2").innerHTML = "Stop"
                clicked  = false;
                api.send("cpu-Stress-Test-Start")
                  //Start stress test
                } 
            else {
                $(this).css('background-color', 'green');  
                document.getElementById("myButton2").innerHTML = "Start"
                clicked  = true;
                api.send("cpu-Stress-Test-Stop")
                //if stress test is running stop
              }   
        });
    });

    // EXAMPLE
    
    var myCanvas = document.getElementById("myGauge");
    var a = new Gauge({
        canvas : myCanvas,
        width_height : 300,
        font : "20px Arial",
        centerText : "Utilization:",
        metricSymbol : "%"
    }) 

    var graphOptions = {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true, 
                    labelString : "Time",
                    fontSize : 20,
                  },
                  type: "time",
                  time: {
                    unit: "second",
                    displayFormats: {
                      second: "hh:mm:ss"
                    }
                  },
                  position: "bottom"
            }], 
            yAxes: [{
                ticks:{
                    beginAtZero : true
                },
                scaleLabel: {
                    display: true, 
                    labelString : "Value",
                    fontSize : 20,
                },
            }]
        }, 
        legend:{
            display: true 
        }, 
        tooltips: {
            enabled:false
        }
    }

    const myChart = document.getElementById('myChart').getContext('2d');
    const myLineChart = new Chart(myChart, {
        type: 'line',
        data: {
            datasets: [{
                label: group.toUpperCase() + ' value',
                fontSize : 20,
                backgroundColor: 'rgb(0, 99, 132)',
                borderColor: 'rgb(0, 99, 132)',
                fill : false,
                data: 0
            }]
        },
        options: Object.assign({}, graphOptions, {
            title:{
                display : true, 
                text: group.toUpperCase(),
                fontSize : 25
            }
        })
    });

    function loadData(data) {
        if (data) {
            myLineChart.data.labels.push(new Date()); //idk what this does
            myLineChart.data.datasets.forEach((dataset) =>{dataset.data.push(data)});
            if (updateCount > keepData) {
                myLineChart.data.labels.shift();
                myLineChart.data.datasets[0].data.shift();
            } else {
                updateCount++
            }
            myLineChart.update();
        }
    }

    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
        console.log(info)
        a.draw(info[0].load[0].Value.split(" ")[0])
        for (let i = 0; i < 100; i++) {
            loadData(info[i].load[0].Value.split(" ")[0])
            setTimeout(loadData, updateLineGraph)
        }
        $("#device-stats").empty()
        $("#device-stats").append(`Device : ${info[0].Text}<br>`)
    })
});

