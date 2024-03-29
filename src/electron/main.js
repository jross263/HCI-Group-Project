// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs')
const SystemData = require('./sysinfo');
const DB = require("./dbsetup")
const cpuStressTest = require("./cpuStressTest")
const gpuStressTest = require("./gpuStressTest")
const exportToExcel = require('./excel').exportToExcel

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            worldSafeExecuteJavaScript: true,
            sandbox: true,
        }
    })
    if(process.env.DEV){
        fs.watch(path.join(__dirname, '../site/html'),()=>{
            mainWindow.reload()
        })
        fs.watch(path.join(__dirname, '../site/js'),()=>{
            mainWindow.reload()
        })
        mainWindow.webContents.openDevTools()
    }
    DB.Setup(ipcMain,mainWindow)
    cpuStressTest.cpuStressTestSetup(ipcMain,mainWindow)
    gpuStressTest.gpuStressTestSetup(ipcMain,mainWindow)
    const customMenu = new Menu()
    Menu.setApplicationMenu(customMenu)

    function wait(){
        SystemData.WaitForWebserver().then((status)=>{
            //console.log(status)
            if(status === "ready"){

                const exportToCSVClick = (menuItem, browserWindow, event) => {
                    dialog.showSaveDialog({ 
                        filters: [
                            { name: 'Excel workbook', extensions: ['xlsx'] }
                          ] 
                    }).then((file)=>{
                        if(!file.canceled){
                            exportToExcel(SystemData.getSystemDataBackend(),file)
                        }
                    })
                }
                
                const menuTemplate = [
                    {
                        label: "File",
                        submenu: [
                            {
                                label : "Export All Devices to Excel",
                                click : exportToCSVClick
                            },
                            {
                                role: "close"
                            }
                        ]
                    },
                ];
                
                const customMenu = Menu.buildFromTemplate(menuTemplate)
                Menu.setApplicationMenu(customMenu)
                
                mainWindow.loadFile(path.join(__dirname,"..","site","html", "index.html"))
                SystemData.Setup(ipcMain,mainWindow);
            }
        }).catch((err)=>{
            //console.log(err)
            wait()
        })
    }
    wait()
    mainWindow.loadFile(path.join(__dirname,"..","site","html", "loading.html"))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    //console.log(__dirname)
    let pathName = process.resourcesPath;
    if(process.env.DEV){
        pathName = path.join(__dirname, "..","..");
    }
    const OpenHardwareMonitor = spawn(path.join(pathName,"OHM-Modified/OpenHardwareMonitor.exe"));
    //when OHM outputs to std out create browser window
    OpenHardwareMonitor.stdout.on('data', () => {
        createWindow()
    });
    
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
process.on("uncaughtException",(err)=>{
    console.log(err)
})
