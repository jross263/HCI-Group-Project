const Setup = (ipcMain,mainWindow) => {
    const db = require('./db/stores/hardware');
    const data = require("./sysinfo").getSystemDataBackend
    
    
    ipcMain.on("db-create",(event,args)=>{
        db.create(args)
    })

    ipcMain.on("db-delete",(event,args)=>{
        db.delete(args)
    })

    ipcMain.on("db-update",(event,args)=>{
        db.update(args)
        
    })
    
    ipcMain.on("db-constraint-get",(event,args)=>{        
        db.read(args).then(record => {
            mainWindow.webContents.send("receive-one",record);
        })
    })
    ipcMain.on("db-get",(event,args)=>{        
        db.readAll(args).then(allTodolists => {
            mainWindow.webContents.send("receive-db",allTodolists);
        })
    })
    
    ipcMain.on("start-report-listener",(event,args)=>{      
        setInterval(function(){
            function AddReport(DBItem, HardwareReport){
                var ReportsArray = DBItem.Reports
                var date = new Date()        
                HardwareReport.ReportDate = date.toLocaleString()
                ReportsArray.push(HardwareReport) 
                var updateArray = [DBItem._id, { $set: { Reports: ReportsArray } } ]
                db.update(updateArray)
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
            let  DevicesForReports = data()
            db.readAll(args).then(info => {
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
        },10000)  
        

    })

}   
exports.Setup = Setup