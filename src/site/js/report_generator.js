$(function() {
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")   
  
    //Create, Delete and Get Reports works.
    // var Json = {ConstraintID: 'string',
    //   CpuInfo:'string2',
    //   GpuInfo:'string3',
    //   HddInfo:'string4',
    //   RamInfo:'string5',
    //   BigNG:'string',      
    //   MainBoard:'string',      
    //   Chip:'string'
    // }
    // api.send('create-report', Json)
    // api.send('get-reports', Json)
    // api.receive("receive-reports",(info)=>{     
    //     info.forEach(function(item){
    //         console.log(item)
    //     });
    // });
    //
    setInterval(function(){
        api.send('db-get')
        // Send call to  get all hardware data
    }, 10000);
    
    api.receive('receive-db',(info)=>{     
        info.forEach(function(item){
            //use hardware data and comapre with contraitns to see if broken then create a report 
            console.log("10 Sec Passed")
        });
    })
});
