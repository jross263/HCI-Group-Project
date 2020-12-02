$(function() {
    const STRESS_TESTABLE = ['cpu','gpu']
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")
   
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

    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
        Gauges.forEach((gauge)=>{
            let type = gauge.getText();
            if(type == "Temperature:"){
                gauge.draw(info[0].temperature[info[0].temperature.length-1].Value.split(" ")[0])
            }
            else if(type == "Utilization:"){
                gauge.draw(info[0].load[0].Value.split(" ")[0])
            }
        })
        $("#device-stats").empty()
        $("#device-stats").append(`Device : ${info[0].Text}<br>`)
    })
});

