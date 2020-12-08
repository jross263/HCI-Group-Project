const path = require('path');
currentPid = 0;
const spawn = require('child_process').spawn;
function cpuStressTestSetup(ipcMain,mainWindow){
    //console.log("outside cpu: ");
    ipcMain.on("cpu-Stress-Test-Start",(event,args)=>{
        let pathName = process.resourcesPath;
        if(process.env.DEV){
            pathName = path.join(__dirname, "..","..");
        }
        const cpuStressTest = spawn(path.join(pathName,"StressTest/CPUStressTest.exe"));
        currentPid = cpuStressTest.pid
    })
    ipcMain.on("cpu-Stress-Test-Stop",(event,args)=>{
        process.kill(currentPid);
    })

};
exports.cpuStressTestSetup = cpuStressTestSetup