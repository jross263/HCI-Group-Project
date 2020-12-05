$(async function() {
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

    console.log(group);

    clicked = true;
    $(document).ready(function(){
      $("button").click(function(){
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

    // EXAMPLE
    
    var myCanvas = document.getElementById("myGauge");
    var a = new Gauge({
        canvas : myCanvas,
        width_height : 300,
        font : "30px Arial",
        centerText : "Utilization:",
        metricSymbol : "%"
    }) 

    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
        a.draw(info[0].load[0].Value.split(" ")[0])
        $("#device-stats").empty()
        $("#device-stats").append(`Device : ${info[0].Text}<br>`)
    })
});
