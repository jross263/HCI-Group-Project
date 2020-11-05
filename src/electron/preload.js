//https://medium.com/@gracespletzer/disabling-node-integration-for-electron-applications-8b45f0fa0fd9

const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld("api",{
    send: (channel, ...data) =>{
        const ALLOWED_CHANNELS = ["cpu-info-subscribe","cpu-info-unsubscribe"];
        if(ALLOWED_CHANNELS.includes(channel)){
            ipcRenderer.send(channel,...data);
        }
    },
    receive: (channel, cb) => {
        const ALLOWED_CHANNELS = ["cpu-info"];
        if(ALLOWED_CHANNELS.includes(channel)){
            ipcRenderer.on(channel, (event,...args) => cb(...args));
        }
    }
})
