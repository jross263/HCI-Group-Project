$(function() {
    const params = new URLSearchParams(window.location.search)
    const group = params.get("group")

    function displayConstraints(){
        $(".Constraints").empty()    
        api.send('db-get',{Hardware: group}) 
    }

    function CreateConstraintObject(objectArray){
        var JsonObj = {}
        objectArray.forEach(function(item){
            JsonObj[item.name] = item.value         
        });        
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
            var htmlSetup = `<div class="row"><div class="col">${index}</div><div class="col">${item.Hardware} ${item.ConstraintType} ${item.Operator} ${item.TestValue} <button type="button" class="btn btn-danger DeleteConstraint" data-id="${item._id}">Delete</button></div></div>`            
            $(".Constraints").append(htmlSetup)
        });

        $(".DeleteConstraint").on("click", function(){
            var id = $(this).data("id")
            api.send("db-delete",id)
            displayConstraints()
            $(".AlertSection").empty()
            $(".AlertSection").prepend('<div class="alert alert-danger" role="alert">Constraint Deleted</div>')
        });  
    })      
});

