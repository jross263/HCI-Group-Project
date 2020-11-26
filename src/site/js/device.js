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

    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
        console.log(info)
        $("#device-info").empty()
        $("#device-info").append(`<b>Device : ${info[0].Text}<br> <b>`)
    })

});

