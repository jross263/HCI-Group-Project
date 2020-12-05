$(function(){
    api.send("fetch-all-devices")
    api.receive("all-devices",(devices)=>{
        console.log(devices)
        Object.keys(devices).forEach(deviceGroup => {
            if(devices[deviceGroup].length){
                let newURL = window.location.href.split("/")
                newURL.pop()
                newURL.push("deviceTemplate.html?group="+deviceGroup)
                newURL = newURL.join("/")
                $(id).append(`<a href="${newURL}"> <img src="${path}" class="test" width="200" height="200"/> </a>`)

            }
        });
    })    
});

