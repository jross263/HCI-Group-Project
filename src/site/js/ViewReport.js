$(function(){
    const params = new URLSearchParams(window.location.search)
    const ReportID = params.get("ReportID")
    const group = params.get("group")
    const ConstraintID = params.get("ConstraintID")
    api.send("db-constraint-get",ConstraintID)

    let Gauges = {}

    $("[id$='Gauge']").each((index, ele) => {
        let name = ele.id.split("_")
        let symbol = ""
        if (name[0] == "temperature") {
            symbol = "°C"
        } else if (name[0] === "utilization") {
            symbol = "%"
        }
        Gauges[name[0] + name[1]] = new Gauge({
            canvas: ele,
            width_height: $(window).width() * (2 / 12),
            font: ($(window).width() * (2 / 12)) * .10 + "px Arial",
            centerText: name[0].charAt(0).toUpperCase() + name[0].slice(1) + ":",
            metricSymbol: symbol
        })
    })

    $(window).resize(function () {
        let width = $(window).width() * (2 / 12);
        Object.keys(Gauges).forEach(key => {
            Gauges[key].updateWidthHeight(width)
            Gauges[key].updateFont(width * .10 + "px Arial")
            Gauges[key].draw()
        })
    });
    
    
    $("#back-btn").on("click",()=>{        
        let newURL = window.location.href.split("/")
        newURL.pop()
        newURL.push("deviceTemplate.html?group="+group)
        newURL = newURL.join("/")
        window.location.href = newURL
    })

    api.receive("receive-one",(info)=>{
        var report = info.Reports[ReportID]
        //console.log(report)
        $("h3").append(`Report Created: ${report.ReportDate}<br>`) 
        $("h3").append(`${report.Category}: ${report.Text}<br>`)
        $("h3").append(`Report Number: ${ReportID}<br><br>`)     
        if(report.hasOwnProperty("temperature")) {
            $("#Stat-Entry").append(`<div class="col temp"><h5>Temperature</h5>`)
            Gauges["temperatureReport"].draw(report.temperature[report.temperature.length-1].Value.split(" ")[0])
            report.temperature.forEach(function(item){
                $(".temp").append(`${item.Text}: ${item.Value} <br>`)
            });
            $(".temp").append(`</div>`)

        } 
        if(report.hasOwnProperty("level")) {
            $("#Stat-Entry").append(`<div class="col level"><h5>Level</h5>`)
            $(".level").append(`${report.level[0].Text}: ${report.level[0].Value} <br>`)
            $(".level").append(`</div>`)
        } 
        if(report.hasOwnProperty("load")) {
            $("#Stat-Entry").append(`<div class="col load"><h5>Load</h5>`)
            $(".load").append(`${report.load[0].Text}: ${report.load[0].Value} <br>`)
            $(".load").append(`</div>`)
            Gauges["utilizationReport"].draw(report.load[0].Value.split(" ")[0])
        } 
        if(report.hasOwnProperty("power")) {
            $("#Stat-Entry").append(`<div class="col power"><h5>Power</h5>`)
            report.power.forEach(function(item){
                $(".power").append(`${item.Text}: ${item.Value} <br>`)
            });
            $(".power").append(`</div>`)
           
        } 
        if(report.hasOwnProperty("clock")) {
            $("#Stat-Entry").append(`<div class="col clock"><h5>Clock</h5>`)
            report.clock.forEach(function(item){
                $(".clock").append(`${item.Text}: ${item.Value} <br>`)
            });  
            $(".clock").append(`</div>`)         
        }
        if(report.hasOwnProperty("load") && report.hasOwnProperty("temperature")) {
            Gauges["healthReport"].healthDraw(report.load[0].Value.split(" ")[0],report.temperature[report.temperature.length-1].Value.split(" ")[0])
        }
        })   
});