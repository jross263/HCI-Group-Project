$(function() {
    const STRESS_TESTABLE = ['cpu','gpu']
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")
    console.log(group)
    $("#back-btn").on("click",()=>{
        api.send(`${group}-info-unsubscribe`)
        let newURL = window.location.href.split("/")
        newURL.pop()
        newURL.push("index.html")
        newURL = newURL.join("/")
        window.location.href = newURL
    })
    console.log("how often")
    if(!STRESS_TESTABLE.includes(group)){
        $("#stress-test-tab").parent().hide()
    }
    clicked = true;
    $("button").click(function(){
        if(clicked){
              $(this).css('background-color', 'red');
              $(this).text("Stop")
              clicked  = false;
              //Start stress test
            } 
        else {
            $(this).css('background-color', 'green');  
            $(this).text("Start")
            clicked  = true;
            //if stress test is running stop
            }   
        });
    api.send(`${group}-info-subscribe`, 1000)
    
    api.receive(`${group}-info`,(info)=>{
        console.log(info)
        $("#device-info").empty()
        $("#device-info").append(`<b>Device : ${info[0].Text}<br> <b>`)
    })

});

