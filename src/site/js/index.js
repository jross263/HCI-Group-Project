$(function(){
    api.send("fetch-all-devices", 1000)
    api.receive("all-devices",(devices)=>{
        Object.keys(devices).forEach(deviceGroup => {
            if(devices[deviceGroup].length){
                let newURL = window.location.href.split("/")
                newURL.pop()
                newURL.push("deviceTemplate.html?group="+deviceGroup)
                newURL = newURL.join("/")
                $("#device-entry").append(`<a type="button" href="${newURL}" class="btn btn-primary" id="${deviceGroup}-btn">${deviceGroup}</button>`)
            }
        });
    })    
});

