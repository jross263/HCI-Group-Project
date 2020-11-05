const http = require('http');

const Setup = (ipcMain,mainWindow) => {

    let SYSTEM_DATA;

    let subscriptions = {}
    
    const fetchData = () => {
        http.get("http://localhost:8085/data.json", (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            SYSTEM_DATA = JSON.parse(data);
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    
    fetchData()
    setInterval(fetchData,1000)

    ipcMain.on("cpu-info-subscribe",(event,args)=>{
        let cpuSubscription = setInterval(()=>{
            if(SYSTEM_DATA){
                response = SYSTEM_DATA["Children"][0]["Children"][1]["Children"][1]["Children"]
                mainWindow.webContents.send("cpu-info",response);
            }
        },args)
        if(subscriptions.CPU){
            clearInterval(subscriptions.CPU)
        }
        subscriptions.CPU = cpuSubscription        
    })
    
    ipcMain.on("cpu-info-unsubscribe",(event,args)=>{
        if(subscriptions.CPU){
            clearInterval(subscriptions.CPU)
        }
    })
}

exports.Setup = Setup;