const {remote} = require('electron');
const dbInstance = remote.getGlobal('db');

function AddConstraint() {
    var data = $('#AddContraint').serialize();
    dbInstance.create({name : data.contraintType});
    var test = dbInstance.readAll();
    console.log(test);
    return        
}  

$( document ).ready(function() {
    $("#AddContraint").on( "submit", AddConstraint )
});


