$(function() {
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")
    if(group == "ram"){        
        $("#ConstraintType option")[1].innerHTML = "Power Utilization"
        $("#ConstraintType option")[1].value = "power"
    }
    
    function displayConstraints(){
        $(".Constraints").empty()    
        api.send('db-get',{Hardware: group}) 
    }

    function CreateConstraintObject(objectArray){
        var JsonObj = {}
        objectArray.forEach(function(item){
            JsonObj[item.name] = item.value         
        });        
        JsonObj["Reports"] = []
        return JsonObj
    }

    function AddConstraint() {        
        var data = $('#AddContraint').serializeArray();
        data[0].value = group
        var Json = CreateConstraintObject(data)
        api.send('db-create', Json)
        displayConstraints() 
        $(".AlertSection").empty()        
        $(".AlertSection").prepend('<div class="alert alert-success" role="alert">Constraint Added</div>')     
        return        
    }  

    $( document ).ready(function() {          
        displayConstraints()            
        $("#AddContraint button").on( "click", AddConstraint)                            
    });         
    

    api.receive("receive-db",(info)=>{     
        info.forEach(function(item,index){
            var htmlStart = `<div class="row Constraint-Row">`
            var htmlMiddle = 
            `<div class="col">${index}</div>
            <div class="col Constraint-Col">${item.Hardware} ${item.ConstraintType} ${item.Operator} ${item.TestValue} <button type="button" class="btn btn-danger DeleteConstraint ml-2" data-id="${item._id}">Delete</button></div>
            <div class="col">`
            var htmlreportsStart = 
            `<div class="form-group">        
             <select class="form-control ReportsSelect" >`            
            item.Reports.forEach(function(thing,ind){
                htmlreportsStart += `<option value="${ind}">Report ${ind}</option>`
            });            
            htmlreportsStart += `</select></div>`

            htmlStart += htmlMiddle 
            htmlStart += htmlreportsStart
            var newURL = window.location.href.split("/")            
            newURL.pop()
            newURL.push("reportViewer.html?ConstraintID="+item._id+"&group="+group+"&ReportID=")        
            newURL = newURL.join("/")               
            var htmlEnd = `</div><div class="col"><a href="${newURL}" class="btn btn-primary ViewReport">View Report</a></div></div></div>`
            htmlStart += htmlEnd                        
            $(".Constraints").append(htmlStart)
        });

        $(".DeleteConstraint").on("click", function(){
            var id = $(this).data("id")
            api.send("db-delete",id)
            displayConstraints()
            $(".AlertSection").empty()
            $(".AlertSection").prepend('<div class="alert alert-danger" role="alert">Constraint Deleted</div>')
        });  

        $(".ViewReport").on("click", function(){
            var ReportClicked = $(this).parent().prev().find("select").val()
            var newURL = $(this).attr("href")
            $(this).attr("href", newURL+ReportClicked.toString())           
            //console.log(newURL)        
        });
    })      
});

