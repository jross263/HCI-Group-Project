const path = require('path');
currentPid = 0;
const spawn = require('child_process').spawn;
var pyshell =  require('python-shell');

function gpuStressTestSetup(ipcMain,mainWindow){
    //console.log("outside gpu: ");

    ipcMain.on("gpu-Stress-Test-Start",(event,args)=>{
        //console.log("inside gpu: ");

        let pathName = process.resourcesPath;
        if(process.env.DEV){
            pathName = path.join(__dirname);
        }
        const realPath = path.join(pathName,"stressGPU.py");

        pyshell.PythonShell.run(realPath, null, function (err, results) {
            if (err) throw err;
            //console.log('finished');
            //console.log(results);
//            document.getElementById("myButton2").innerHTML = "Start"

          });


//          pyshell.PythonShell.run("C:/Users/Dallas Blaney/PycharmProjects/Python/School/4474-Group-Project/src/electron/stressGPU.py", null, function (err, results) {
//                if (err) throw err;
//                    //console.log('finished');
//                    //console.log(results);
//                    $(this).css('background-color', 'green');
//                      document.getElementById("myButton2").innerHTML = "Start"
//                      $(".myButton2").prop('enabled',true);
//                      clicked  = true;
//                      });



//        document.getElementById("myButton2").innerHTML = "Start"
        //console.log("after gpu: ");
    })
    ipcMain.on("gpu-Stress-Test-Stop",(event,args)=>{

    })

};
exports.gpuStressTestSetup = gpuStressTestSetup
