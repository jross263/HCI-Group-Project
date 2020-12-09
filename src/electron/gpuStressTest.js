const path = require('path');
currentPid = 0;
const spawn = require('child_process').spawn;
var pyshell =  require('python-shell');

function gpuStressTestSetup(ipcMain,mainWindow){
    //console.log("outside gpu: ");

    let runGPUTest = true;

    let pathName = process.resourcesPath;
        if(process.env.DEV){
            pathName = path.join(__dirname);
        }
    const testPath = path.join(pathName,"test.py");
    pyshell.PythonShell.run(testPath, null, function (err, results) {
        if(results[0] === "Not Compatible"){
            runGPUTest = false;
        }
    })

    ipcMain.on("gpu-Stress-Test-Start",(event,args)=>{
        //console.log("inside gpu: ");

        let pathName = process.resourcesPath;
        if(process.env.DEV){
            pathName = path.join(__dirname);
        }
        const realPath = path.join(pathName,"stressGPU.py");

        pyshell.PythonShell.run(realPath, null, function (err, results) {});


    })
    ipcMain.on("gpu-Stress-Test-Stop",(event,args)=>{

    })
    ipcMain.on("test-gpu",(event,args)=>{
        mainWindow.webContents.send("test-gpu-result",runGPUTest)
        
    })

};
exports.gpuStressTestSetup = gpuStressTestSetup
