$(function(){
    api.send("fetch-all-devices")
    api.receive("all-devices",(devices)=>{
        console.log(devices)
        Object.keys(devices).forEach(deviceGroup => {
            if(devices[deviceGroup].length){
                var name = "";

                if (!deviceGroup.localeCompare("cpu")){
                    name = "Processing-Unit";
                }else if (!deviceGroup.localeCompare("gpu")){
                    name = "Graphics"
                }else if (!deviceGroup.localeCompare("mainboard")){
                    name = "Device-Info"
                }else if (!deviceGroup.localeCompare("ram")){
                    name = "Memory"
                }else if (!deviceGroup.localeCompare("hdd")){
                    name = "Storage"
                }

                var path = "../images/".concat(name).concat(".png");
                var id = "#".concat(name).concat("-Home");

                let newURL = window.location.href.split("/")
                newURL.pop()
                newURL.push("deviceTemplate.html?group="+deviceGroup)
                newURL = newURL.join("/")
                $(id).append(`<a href="${newURL}"> <img src="${path}" width="200" height="200"/> </a>`)

            }
        });
    })
    console.log('aaa')
});

