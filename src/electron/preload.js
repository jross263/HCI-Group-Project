//https://medium.com/@gracespletzer/disabling-node-integration-for-electron-applications-8b45f0fa0fd9

const { ipcRenderer, contextBridge} = require('electron');
const HARDWARE_CATEGORIES = new Set(["cpu","gpu","hdd","bigng","mainboard","chip","ram"]);

contextBridge.exposeInMainWorld("api",{
    send: (channel, ...data) =>{
        let ALLOWED_CHANNELS = ["fetch-all-devices","db-create","db-get","db-delete","db-update"];
        HARDWARE_CATEGORIES.forEach(category =>{
            ALLOWED_CHANNELS.push(category+"-info-subscribe")
            ALLOWED_CHANNELS.push(category+"-info-unsubscribe")
        })
        if(ALLOWED_CHANNELS.includes(channel)){
            ipcRenderer.send(channel,...data);
        }
    },
    receive: (channel, cb) => {
        let ALLOWED_CHANNELS = ["all-devices","receive-db"];
        HARDWARE_CATEGORIES.forEach(category =>{
            ALLOWED_CHANNELS.push(category+"-info")
        })
        if(ALLOWED_CHANNELS.includes(channel)){
            ipcRenderer.on(channel, (event,...args) => cb(...args));
        }
    }
})
