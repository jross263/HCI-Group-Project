$(function() {
    function displayConstraints(){
        $(".Constraints").empty()    
        api.send('db-get')                     
    }

    function AddConstraint() {
        var data = $('#AddContraint').serializeArray();
        console.log(data[0].value)
        api.send('db-create', {name: data[0].value})
        console.log("added constraint")  
        displayConstraints()
        return        
    }  

    $( document ).ready(function() {          
        displayConstraints()            
        $("#AddContraint button").on( "click", AddConstraint )
    });         

    api.receive("receive-db",(info)=>{
        console.log(info)
        info.forEach(function(item,index){
            var htmlSetup = `<div class="row"><div class="col">Item: ${index}</div><div class="col">${item.name}</div></div>`            
            $(".Constraints").append(htmlSetup)
        });        
    })  
});

