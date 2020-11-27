const Setup = (ipcMain,mainWindow) => {
    const db = require('./db/stores/hardware');
    const reports = require('./db/stores/reports')
    
    
    ipcMain.on("create-report",(event,args)=>{
        reports.create(args)
    })
    
    ipcMain.on("delete-report",(event,args)=>{
        reports.delete(args)
    })

    ipcMain.on("get-reports",(event,args)=>{        
        reports.readAll(args).then(allReports => {
            mainWindow.webContents.send("receive-reports",allReports);
        })
    })
    
    ipcMain.on("db-create",(event,args)=>{
        db.create(args)
    })

    ipcMain.on("db-delete",(event,args)=>{
        db.delete(args)
    })

    ipcMain.on("db-get",(event,args)=>{        
        db.readAll(args).then(allTodolists => {
            mainWindow.webContents.send("receive-db",allTodolists);
        })
    })
}   
exports.Setup = Setup