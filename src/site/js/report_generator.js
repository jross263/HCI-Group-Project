$(function() {
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")   
  
    //report object
    // var Json = {ConstraintID: 'string',
    //   CpuInfo:'string2',
    //   GpuInfo:'string3',
    //   HddInfo:'string4',
    //   RamInfo:'string5',
    //   BigNG:'string',      
    //   MainBoard:'string',      
    //   Chip:'string'
    // }

    setInterval(function(){
        api.send('db-get')
        // Send call to  get all hardware data
    }, 10000);

    //how to update a record
    // var updateArray = ["InksmJ5GJrVGs39T", { $set: { Operator: "=" } } ]
    // api.send('db-update',updateArray)
    
    api.receive('receive-db',(info)=>{     
        info.forEach(function(item){
            //use hardware data and comapre with contraitns to see if broken then create a report 
            console.log("10 Sec Passed")
        });
    })
});
