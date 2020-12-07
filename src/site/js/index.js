$(function(){
    var flag = true;
    var DevicesForReports = {}
   
    function AddReport(DBItem, HardwareReport){
        var ReportsArray = DBItem.Reports
        var date = new Date()        
        HardwareReport.ReportDate = date.toLocaleString()
        ReportsArray.push(HardwareReport) 
        var updateArray = [DBItem._id, { $set: { Reports: ReportsArray } } ]
        api.send('db-update',updateArray)
    }
    function CheckConditions(DBItem,HardwareReport,ValuetoTest){
        if(DBItem.Operator == ">"){                                                       
            if( ValuetoTest > DBItem.TestValue){   
                AddReport(DBItem,HardwareReport)                                                             
            }
        }
        else if(DBItem.Operator == "<"){
            if(ValuetoTest < DBItem.TestValue){
                AddReport(DBItem,HardwareReport)
            }
        }
        else if(DBItem.Operator == "="){
            if(ValuetoTest == DBItem.TestValue){
                AddReport(DBItem,HardwareReport)
            }
        }   
    }

    setInterval(function(){
        api.send("fetch-all-devices")
        api.send('db-get')                
    }, 10000);


    api.send("fetch-all-devices")
    api.receive("all-devices",(devices)=>{
        if(flag){
        console.log(devices)
        Object.keys(devices).forEach(deviceGroup => {
            if(devices[deviceGroup].length){
                var name = "";

                if (!deviceGroup.localeCompare("cpu")){
                    name = "Processing-Unit";
                }else if (!deviceGroup.localeCompare("gpu")){
                    name = "Graphics"
                }else if (!deviceGroup.localeCompare("mainboard")){
                    name = "Device-Info"
                }else if (!deviceGroup.localeCompare("ram")){
                    name = "Memory"
                }else if (!deviceGroup.localeCompare("hdd")){
                    name = "Storage"
                }

                var path = "../images/".concat(name).concat(".png");
                var id = "#".concat(name).concat("-Home");

                let newURL = window.location.href.split("/")
                newURL.pop()
                newURL.push("deviceTemplate.html?group="+deviceGroup)
                newURL = newURL.join("/")
                $(id).append(`<a href="${newURL}"> <img src="${path}" class="test" width="200" height="200"/> </a>`)

            }
        });
        flag = false
    }     
    if(!flag){
        DevicesForReports = devices
    }       
    })
    api.receive('receive-db',(info)=>{     
        info.forEach(function(item){
            var hardwareInfo = DevicesForReports[item.Hardware]
            if(!(item.Reports.length > 9)){

                if(item.Hardware == "hdd"){                
                    if(item.ConstraintType == "temp"){
                        var newValue = parseFloat(hardwareInfo[0].temperature[0].Value) 
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)        
                    }
                    else{
                        var newValue = parseFloat(hardwareInfo[0].load[0].Value)
                        console.log(newValue) 
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                }

                else if(item.Hardware == "cpu"){                    
                    if(item.ConstraintType == "temp"){
                        var endIndex = hardwareInfo[0].temperature.length -1
                        var newValue = parseFloat(hardwareInfo[0].temperature[endIndex].Value)                         
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                    else{
                        var newValue = parseFloat(hardwareInfo[0].load[0].Value)                                             
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                }

                else if(item.Hardware == "gpu"){
                    if(item.ConstraintType == "temp"){
                        var newValue = parseFloat(hardwareInfo[0].temperature[0].Value) 
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)   
                    }
                    else{
                        var newValue = parseFloat(hardwareInfo[0].load[0].Value)                                             
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                }

                else if(item.Hardware == "ram"){
                    if(item.ConstraintType == "power"){
                        var newValue = parseFloat(hardwareInfo[0].power[0].Value)
                        console.log(newValue) 
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                    else{
                        var newValue = parseFloat(hardwareInfo[0].load[0].Value)
                        console.log(newValue) 
                        var ReporttoAdd = hardwareInfo[0]
                        CheckConditions(item,ReporttoAdd,newValue)
                    }
                }
            }
           
        });
        
    })
});

