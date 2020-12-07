$(function(){
    const params = new URLSearchParams(window.location.search)
    const ReportID = params.get("ReportID")
    const group = params.get("group")
    const ConstraintID = params.get("ConstraintID")
    api.send("db-constraint-get",ConstraintID)
    
    
    $("#back-btn").on("click",()=>{        
        let newURL = window.location.href.split("/")
        newURL.pop()
        newURL.push("deviceTemplate.html?group="+group)
        newURL = newURL.join("/")
        window.location.href = newURL
    })

    api.receive("receive-one",(info)=>{
        var report = info.Reports[ReportID]
        console.log(report)
        $("h3").append(`Report Created: ${report.ReportDate}<br>`) 
        $("h3").append(`${report.Category}: ${report.Text}<br>`)
        $("h3").append(`Report Number: ${ReportID}<br><br>`)     
        if(report.hasOwnProperty("temperature")) {
            $(".row").append(`<div class="col temp"><h5>Temperature</h5>`)
            report.temperature.forEach(function(item){
                $(".temp").append(`${item.Text}: ${item.Value} <br>`)
            });
            $(".temp").append(`</div>`)
        } 
        if(report.hasOwnProperty("level")) {
            $(".row").append(`<div class="col level"><h5>Level</h5>`)
            $(".level").append(`${report.level[0].Text}: ${report.level[0].Value} <br>`)
            $(".level").append(`</div>`)
        } 
        if(report.hasOwnProperty("load")) {
            $(".row").append(`<div class="col load"><h5>Load</h5>`)
            $(".load").append(`${report.load[0].Text}: ${report.load[0].Value} <br>`)
            $(".load").append(`</div>`)
        } 
        if(report.hasOwnProperty("power")) {
            $(".row").append(`<div class="col power"><h5>Power</h5>`)
            report.power.forEach(function(item){
                $(".power").append(`Power${item.Text}: ${item.Value} <br>`)
            });
            $(".power").append(`</div>`)
           
        } 
        if(report.hasOwnProperty("clock")) {
            $(".row").append(`<div class="col clock"><h5>Clock</h5>`)
            report.clock.forEach(function(item){
                $(".clock").append(`Clock${item.Text}: ${item.Value} <br>`)
            });  
            $(".clock").append(`</div>`)         
        } 
        })   
});