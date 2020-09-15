let cpuData = []

setInterval(()=>{
    fetch("http://localhost:8085/data.json").then((response) => {
        return response.json();
    }).then((data) => {
        cpuData = data["Children"][0]["Children"][1]["Children"][1]["Children"]; //Disgusting
        console.log(cpuData)
    }).catch((err)=>{
        console.error(err)
    })
},1000)

let cpuIntervalID = setInterval(()=>{
    $("#entry").empty()
    cpuData.forEach((element) => {
        $("#entry").append(
        `<tr>
            <th scope="row">${element.Text}</th>
            <td>${element.Min}</td>
            <td>${element.Value}</td>
            <td>${element.Max}</td>: 
        </tr`)
    });
},)