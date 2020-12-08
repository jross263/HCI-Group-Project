$(async function () {
    const STRESS_TESTABLE = ['cpu']
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")
    const updateLineGraph = 20
    var keepData = 25
    var updateCount = 0

    let CurrCore = 0
    let isAdvancedView = false

    $("#back-btn").on("click", () => {
        api.send(`${group}-info-unsubscribe`)
        let newURL = window.location.href.split("/")
        newURL.pop()
        newURL.push("index.html")
        newURL = newURL.join("/")
        window.location.href = newURL
    })

    $("#showAdvancedView").on("click", () => {
        $("#device-info").removeClass("show active")
        $("#advancedView").addClass("show active")
        isAdvancedView = true
    })

    $("#showBasicView").on("click", () => {
        $("#advancedView").removeClass("show active")
        $("#device-info").addClass("show active")
        isAdvancedView = false
        CurrCore = 0
    })

    if (!STRESS_TESTABLE.includes(group)) {
        $("#stress-test-tab").parent().hide()
    }

    let ranOnce = false
    const buildAdvanced = (info) => {
        if (group === "cpu" && !ranOnce) {
            ranOnce = true
            $("#core-entry").append(`<nav aria-label="breadcrumb"><ol class="breadcrumb" id="corelist"><li id="core-0"class="breadcrumb-item active pretend-link">All Cores</li></ol></nav>`)
            $("#core-0").on("click", (e) => {
                $(".breadcrumb-item.active.pretend-link").removeClass("active")
                $("#core-0").addClass("active")
                CurrCore = 0
            })
            info[0].load.forEach((ele, i) => {
                if (i !== 0) {
                    let pre_core = ele.Text.split(" ")
                    pre_core.shift()
                    let core = pre_core.join(" ")
                    $("#corelist").append(`<li class="breadcrumb-item pretend-link" core="${i}" id="core-${i}">${core}</li>`)
                    $("#core-" + i).on("click", (e) => {
                        $(".breadcrumb-item.active.pretend-link").removeClass("active")
                        $("#core-" + i).addClass("active")
                        CurrCore = i
                    })
                }
            })
        }
    }


    clicked = true;
    $(document).ready(function () {
        $("#myButton2").click(function () {
            if (clicked && (!group.localeCompare("cpu"))) {
                $(this).css('background-color', 'red');
                document.getElementById("myButton2").innerHTML = "Stop"
                clicked = false;
                api.send("cpu-Stress-Test-Start")
                //Start stress test
            }
            else if (!clicked && (!group.localeCompare("cpu"))) {
                $(this).css('background-color', 'green');
                document.getElementById("myButton2").innerHTML = "Start"
                clicked = true;
                api.send("cpu-Stress-Test-Stop")
                //if stress test is running stop
            }
            else if (clicked && (!group.localeCompare("gpu"))) {
                $(this).css('background-color', 'red');
                document.getElementById("myButton2").innerHTML = "In Progress"
                $(".myButton2").prop('disabled', true);
                clicked = false;
                i = 8
                var elem = document.getElementById("loadingBarGPUID");
                var widthAdd = i / 10;
                var width = i / 10;

                var id = setInterval(frame, 100);


                function frame() {
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
            else if (!clicked && (!group.localeCompare("gpu"))) {
                $(this).css('background-color', 'green');
                document.getElementById("myButton2").innerHTML = "Start"
                $(".myButton2").prop('enabled', true);
                clicked = true;
                document.getElementById("loadingBarGPUID").style.width = 0 + "%";
                document.getElementById("loadingBarGPUID").innerHTML = 0 + "%";

                api.send("gpu-Stress-Test-Stop")
                //if stress test is running stop
            }
        });
    });

    clicked = true;
    $("#startCPUStressTest").click(function () {
        if (clicked) {
            $(this).css('background-color', 'red');
            document.getElementById("startCPUStressTest").innerHTML = "Stop"
            clicked = false;
            api.send("cpu-Stress-Test-Start")
            //Start stress test
        }
        else {
            $(this).css('background-color', 'green');
            document.getElementById("startCPUStressTest").innerHTML = "Start"
            clicked = true;
            api.send("cpu-Stress-Test-Stop")
            //if stress test is running stop
        }
    });

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
            width_height: $(window).width() * (2 / 12) - 30,
            font: ($(window).width() * (2 / 12) -30) * .10 + "px Arial",
            centerText: name[0].charAt(0).toUpperCase() + name[0].slice(1) + ":",
            metricSymbol: symbol
        })
    })

    $(window).resize(function () {
        let width = $(window).width() * (2 / 12) - 30;
        Object.keys(Gauges).forEach(key => {
            Gauges[key].updateWidthHeight(width)
            Gauges[key].updateFont(width * .10 + "px Arial")
        })
    });


    function loadData(data, chart) {
        if (data) {
            chart.data.labels.push(new Date()); //idk what this does
            chart.data.datasets.forEach((dataset) => { dataset.data.push(data) });
            if (updateCount > keepData) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            } else {
                updateCount++
            }
            chart.update();
        }
    }

    var graphOptionsUtil = {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Time",
                    fontSize: 20,
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
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100
                },
                scaleLabel: {
                    display: true,
                    labelString: "Utilization",
                    fontSize: 20,
                },
            }]
        },
        legend: {
            display: true
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false
    }
    var graphOptionsTemp = {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Time",
                    fontSize: 20,
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
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100
                },
                scaleLabel: {
                    display: true,
                    labelString: "Temperature",
                    fontSize: 20,
                },
            }]
        },
        legend: {
            display: true
        },
        tooltips: {
            enabled: false
        },
        responsive: true
    }
    let basicViewChartUtil, advancedViewChartUtil, advancedViewChartTemp;
    let buildGraphsOnce = false

    const processGraphs = (info) => {
        if (!buildGraphsOnce) {
            buildGraphsOnce = true
            if (info[0].load) {
                const basicViewChartUtilCanvas = document.getElementById('myChart').getContext('2d');
                basicViewChartUtil = new Chart(basicViewChartUtilCanvas, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: group.toUpperCase() + ' value',
                            fontSize: 20,
                            backgroundColor: 'rgb(0, 99, 132)',
                            borderColor: 'rgb(0, 99, 132)',
                            fill: false,
                            data: 0
                        }]
                    },
                    options: Object.assign({}, graphOptionsUtil, {
                        title: {
                            display: true,
                            text: group.toUpperCase(),
                            fontSize: 25
                        }
                    })
                });
                const advancedViewChartUtilCanvas = document.getElementById('advancedViewChartUtil').getContext('2d');
                advancedViewChartUtil = new Chart(advancedViewChartUtilCanvas, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: group.toUpperCase() + ' value',
                            fontSize: 20,
                            backgroundColor: 'rgb(0, 99, 132)',
                            borderColor: 'rgb(0, 99, 132)',
                            fill: false,
                            data: 0
                        }]
                    },
                    options: Object.assign({}, graphOptionsUtil, {
                        title: {
                            display: true,
                            text: group.toUpperCase(),
                            fontSize: 25
                        }
                    })
                });
                const cpuStressTestChartCanvas = document.getElementById('cpuStressTestChart').getContext('2d');
                cpuStressTestChart = new Chart(cpuStressTestChartCanvas, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: group.toUpperCase() + ' value',
                            fontSize: 20,
                            backgroundColor: 'rgb(0, 99, 132)',
                            borderColor: 'rgb(0, 99, 132)',
                            fill: false,
                            data: 0
                        }]
                    },
                    options: Object.assign({}, graphOptionsUtil, {
                        title: {
                            display: true,
                            text: group.toUpperCase(),
                            fontSize: 25
                        }
                    })
                });
            }
            if (info[0].temperature) {
                const advancedViewChartTempCanvas = document.getElementById('advancedViewChartTemp').getContext('2d');
                advancedViewChartTemp = new Chart(advancedViewChartTempCanvas, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: group.toUpperCase() + ' value',
                            fontSize: 20,
                            backgroundColor: 'rgb(0, 99, 132)',
                            borderColor: 'rgb(0, 99, 132)',
                            fill: false,
                            data: 0
                        }]
                    },
                    options: Object.assign({}, graphOptionsTemp, {
                        title: {
                            display: true,
                            text: group.toUpperCase(),
                            fontSize: 25
                        }
                    })
                });
            }


        }
        if (info[0].load) {
            loadData(info[0].load[CurrCore].Value.split(" ")[0], basicViewChartUtil)
            loadData(info[0].load[CurrCore].Value.split(" ")[0], advancedViewChartUtil)
            loadData(info[0].load[CurrCore].Value.split(" ")[0], cpuStressTestChart)
        }
        if (info[0].temperature) {
            loadData(info[0].temperature[info[0].temperature.length - 1].Value.split(" ")[0], advancedViewChartTemp)
        }
        setTimeout(loadData, updateLineGraph)
    }

    api.send(`${group}-info-subscribe`, 1000)

    api.receive(`${group}-info`, (info) => {
        //console.log(info)
        processGraphs(info)
        buildAdvanced(info)
        if (info[0].load) {
            Gauges["utilizationbasic"].draw(info[0].load[CurrCore].Value.split(" ")[0])
            Gauges["utilizationadvanced"].draw(info[0].load[CurrCore].Value.split(" ")[0])
            Gauges["utilizationStressTest"].draw(info[0].load[CurrCore].Value.split(" ")[0])
        }
        if (info[0].temperature) {
            Gauges["temperaturebasic"].draw(info[0].temperature[info[0].temperature.length - 1].Value.split(" ")[0])
            Gauges["temperatureadvanced"].draw(info[0].temperature[info[0].temperature.length - 1].Value.split(" ")[0])
            Gauges["temperatureStressTest"].draw(info[0].temperature[info[0].temperature.length - 1].Value.split(" ")[0])
        }
        if (info[0].load && info[0].temperature) {
            let util = info[0].load[CurrCore].Value.split(" ")[0]
            let temp = info[0].temperature[info[0].temperature.length - 1].Value.split(" ")[0]
            Gauges["healthbasic"].healthDraw(util, temp)
            Gauges["healthadvanced"].healthDraw(util, temp)
        }
        if(isAdvancedView){
            $("#advancedViewStats").empty()
            if(info[0].hasOwnProperty("temperature")) {
                $("#advancedViewStats").append(`<div class="col temp"><h5>Temperature</h5>`)
                info[0].temperature.forEach(function(item){
                    $(".temp").append(`${item.Text}: ${item.Value} <br>`)
                });
                $(".temp").append(`</div>`)
            } 
            if(info[0].hasOwnProperty("level")) {
                $("#advancedViewStats").append(`<div class="col level"><h5>Level</h5>`)
                $(".level").append(`${info[0].level[0].Text}: ${info[0].level[0].Value} <br>`)
                $(".level").append(`</div>`)
            } 
            if(info[0].hasOwnProperty("load")) {
                $("#advancedViewStats").append(`<div class="col load"><h5>Load</h5>`)
                $(".load").append(`${info[0].load[0].Text}: ${info[0].load[0].Value} <br>`)
                $(".load").append(`</div>`)
            } 
            if(info[0].hasOwnProperty("power")) {
                $("#advancedViewStats").append(`<div class="col power"><h5>Power</h5>`)
                info[0].power.forEach(function(item){
                    $(".power").append(`${item.Text}: ${item.Value} <br>`)
                });
                $(".power").append(`</div>`)
               
            } 
            if(info[0].hasOwnProperty("clock")) {
                $("#advancedViewStats").append(`<div class="col clock"><h5>Clock</h5>`)
                info[0].clock.forEach(function(item){
                    $(".clock").append(`${item.Text}: ${item.Value} <br>`)
                });  
                $(".clock").append(`</div>`)         
            }
        }
    })
});
