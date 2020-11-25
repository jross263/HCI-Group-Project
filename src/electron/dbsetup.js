const Setup = (ipcMain,mainWindow) => {
    const db = require('./db/stores/hardware');

    ipcMain.on("db-create",(event,args)=>{
        db.create(args)
    })

    ipcMain.on("db-get",(event,args)=>{
        db.readAll().then(allTodolists => {
            mainWindow.webContents.send("receive-db",allTodolists);
        })
    })
}   
exports.Setup = Setup