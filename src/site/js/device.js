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
    $("#startCPUStressTest").click(function(){
            if(clicked){
                $(this).css('background-color', 'red');
                document.getElementById("startCPUStressTest").innerHTML = "Stop"
                clicked  = false;
                api.send("cpu-Stress-Test-Start")
                  //Start stress test
            } 
            else {
                $(this).css('background-color', 'green');  
                document.getElementById("startCPUStressTest").innerHTML = "Start"
                clicked  = true;
                api.send("cpu-Stress-Test-Stop")
                //if stress test is running stop
            }   
    });

    let Gauges = []
    
    $("[id$='Gauge']").each((index,ele)=>{
        let name = ele.id.substring(0,ele.id.length-5)
        let symbol = name == "temperature" ? "°C" : "%"
        Gauges.push(new Gauge({
            canvas : ele,
            width_height : $(window).width()*(2/12) - 10,
            font : ($(window).width()*(2/12))*.10 + "px Arial",
            centerText : name.charAt(0).toUpperCase() + name.slice(1) + ":",
            metricSymbol : symbol
        }))
    })

    $(window).resize(function () {
        let width = $(window).width()*(2/12) - 10;
        Gauges.forEach((gauge)=>{
            gauge.updateWidthHeight(width)
            gauge.updateFont(width*.10 + "px Arial")
        })
    });

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

    var myCanvas2 = document.getElementById("myGauge2");
    var b = new Gauge({
        canvas : myCanvas2,
        width_height : 200,
        font : "15px Arial",
        centerText : "Utilization:",
        metricSymbol : "%"
    })
    
    var myCanvas3 = document.getElementById("myGauge3");
    var c = new Gauge({
        canvas : myCanvas3,
        width_height : 200,
        font : "15px Arial",
        centerText : "Temperature",
        metricSymbol : " C"
    }) 

    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
    b.draw(info[0].load[0].Value.split(" ")[0])
    c.draw(info[0].temperature[2].Value.split(" ")[0])
    Gauges.forEach((gauge)=>{
        let type = gauge.getText();
        if(type == "Temperature:"){
            gauge.draw(info[0].temperature[info[0].temperature.length-1].Value.split(" ")[0])
        }
        else if(type == "Utilization:"){
            gauge.draw(info[0].load[0].Value.split(" ")[0])
        }
    })
    console.log(info)
    loadData(info[0].load[0].Value.split(" ")[0])
    setTimeout(loadData, updateLineGraph)
    $("#device-stats").empty()
    $("#device-stats").append(`Device : ${info[0].Text}<br>`)
    })
});

