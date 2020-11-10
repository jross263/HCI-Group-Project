const http = require('http');

const Setup = (ipcMain,mainWindow) => {

    //These are the categories returned from OHM.
    let SYSTEM_DATA = {
        "cpu" : [],
        "gpu" : [],
        "hdd" : [],
        "bigng" : [],
        "mainboard" : [],
        "chip" : [],
        "ram" : []
    }

    //Dict of current subscriptions from the browser
    let subscriptions = {}

    //Lookup set of hardware and sensor categories from OHM
    const HARDWARE_CATEGORIES = new Set(["cpu","gpu","hdd","bigng","mainboard","chip","ram"]);
    const SENSOR_TYPES = new Set(["voltage","clock","load","temperature","fan","flow","control","level","power"])
    
    //Gets the data from OHM webserver
    const fetchData = () => {
        http.get("http://localhost:8085/data.json", (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            //Clear out the current system data
            for(key in SYSTEM_DATA){
                SYSTEM_DATA[key] = []
            }
            //This is to clean up the data, I could have rewrote the C# code for OHM but this was less work
            let preProcessedData = JSON.parse(data);
            //For every device, add it to the respective category
            preProcessedData.Children[0].Children.forEach(device =>{
                //For each hardware device, add its sensor properties as key in the JSON object
                device.Children.forEach(sensorType =>{
                    //in the case of the motherboard there is a hardware as a child so add its sensors as keys to it
                    if(HARDWARE_CATEGORIES.has(sensorType.Category)){
                        device[sensorType.Category] = sensorType
                        device[sensorType.Category].Children.forEach(a=>{
                            device[sensorType.Category][a.Category] = a.Children
                        })
                        delete device[sensorType.Category].Children
                    }else{
                        device[sensorType.Category] = sensorType.Children
                    }
                })
                delete device.Children
                SYSTEM_DATA[device.Category].push(device)
            })
            
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    
    fetchData()
    setInterval(fetchData,1000)

    HARDWARE_CATEGORIES.forEach(category => {
        ipcMain.on(category + "-info-subscribe",(event,args)=>{
            let subscription = setInterval(()=>{
                if(SYSTEM_DATA[category].length){
                    response = SYSTEM_DATA[category]
                    mainWindow.webContents.send(category + "-info",response);
                }
            },args)
            if(subscriptions[category]){
                clearInterval(subscriptions[category])
            }
            subscriptions[category] = subscription        
        })

        ipcMain.on(category + "-info-unsubscribe",(event,args)=>{
            if(subscriptions[category]){
                clearInterval(subscriptions[category])
            }
        })
    })
}

exports.Setup = Setup;