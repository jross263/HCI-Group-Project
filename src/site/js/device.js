$(async function() {
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

    $("#showAdvancedView").on("click",()=>{
        $("#device-info").removeClass("show active")
        $("#advancedView").addClass("show active")
    })

    $("#showBasicView").on("click",()=>{
        $("#advancedView").removeClass("show active")
        $("#device-info").addClass("show active")
    })

    if(!STRESS_TESTABLE.includes(group)){
        $("#stress-test-tab").parent().hide()
    }

    console.log(group);

    clicked = true;
    $(document).ready(function(){
      $("#myButton2").click(function(){
            if(clicked && (!group.localeCompare("cpu"))){
                $(this).css('background-color', 'red');
                document.getElementById("myButton2").innerHTML = "Stop"
                clicked  = false;
                api.send("cpu-Stress-Test-Start")
                  //Start stress test
                } 
            else if (!clicked && (!group.localeCompare("cpu"))){
                $(this).css('background-color', 'green');  
                document.getElementById("myButton2").innerHTML = "Start"
                clicked  = true;
                api.send("cpu-Stress-Test-Stop")
                //if stress test is running stop
              }
              else if(clicked && (!group.localeCompare("gpu"))){
                  $(this).css('background-color', 'red');
                  document.getElementById("myButton2").innerHTML = "In Progress"
                  $(".myButton2").prop('disabled',true);
                  clicked  = false;
                i = 8
                var elem = document.getElementById("loadingBarGPUID");
                var widthAdd = i / 10;
                var width = i / 10;

                var id = setInterval(frame, 100);


                function frame() {
                console.log('in fucn', widthAdd);
                  if (width >= 100) {
                    elem.style.width = 100 + "%";
                    elem.innerHTML = 100 + "%";
                    clearInterval(id);
                  } else {
                    width += widthAdd;
                    elem.style.width = Number((width).toFixed(0)) + "%";
                    elem.innerHTML = Number((width).toFixed(0)) + "%";
                  }
                }

                  api.send("gpu-Stress-Test-Start")





                  //Start stress test
              }
              else if (!clicked && (!group.localeCompare("gpu"))){
                  $(this).css('background-color', 'green');
                  document.getElementById("myButton2").innerHTML = "Start"
                  $(".myButton2").prop('enabled',true);
                  clicked  = true;
                  document.getElementById("loadingBarGPUID").style.width = 0 + "%";
                  document.getElementById("loadingBarGPUID").innerHTML = 0 + "%";

                  api.send("gpu-Stress-Test-Stop")
                  //if stress test is running stop
          }
      });
    });

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
        },
        responsive: true
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


    const advancedViewChart1 = document.getElementById('advancedViewChart1').getContext('2d');
    const advancedViewChart11 = new Chart(advancedViewChart1, {
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

    function loadData(data,chart) {
        if (data) {
            chart.data.labels.push(new Date()); //idk what this does
            chart.data.datasets.forEach((dataset) =>{dataset.data.push(data)});
            if (updateCount > keepData) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            } else {
                updateCount++
            }
            chart.update();
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
        loadData(info[0].load[0].Value.split(" ")[0],myLineChart)
        loadData(info[0].load[0].Value.split(" ")[0],advancedViewChart11)
        setTimeout(loadData, updateLineGraph)
        $("#device-stats").empty()
        $("#device-stats").append(`Device : ${info[0].Text}<br>`)
    })
});
