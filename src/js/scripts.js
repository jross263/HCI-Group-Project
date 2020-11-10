api.send("cpu-info-subscribe", 1000)

api.receive("cpu-info", (msg) => {
    $("#entry").empty()
    msg[0].temperature.forEach((element) => {
        $("#entry").append(
            `<tr>
            <th scope="row">${element.Text}</th>
            <td>${element.Min}</td>
            <td>${element.Value}</td>
            <td>${element.Max}</td>: 
        </tr`)
    });
})