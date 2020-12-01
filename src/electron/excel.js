const ExcelJS = require('exceljs');


async function exportToExcel(systemData, file) {

    let sheetLookup = {}

    const workbook = new ExcelJS.Workbook();

    workbook.eachSheet(function(worksheet, sheetId) {
        workbook.removeWorksheet(sheetId)
    });

    Object.keys(systemData).forEach(deviceGroup => {
        if(systemData[deviceGroup].length){
            systemData[deviceGroup].forEach((device) => {
                let worksheet = workbook.getWorksheet(device.Text);
                if(worksheet){
                    sheetLookup[device.Text]++;
                    worksheet = workbook.addWorksheet(device.Text + ` (${sheetLookup[device.Text]})`)
                }else{
                    sheetLookup[device.Text] = 0
                    worksheet = workbook.addWorksheet(device.Text)
                }
                worksheet.addRow(["Sensor Type", "Sensor Description", "Min", "Value", "Max"]);
                Object.keys(device).forEach(deviceSensor => {
                    if(deviceSensor != "Text" && deviceSensor != "Category"){
                        if(Array.isArray(device[deviceSensor])){
                            device[deviceSensor].forEach((metric)=>{
                                out = [deviceSensor]
                                Object.keys(metric).forEach((value)=>{
                                    if(value !== "Children"){
                                        out.push(metric[value])
                                    }
                                })
                                worksheet.addRow(out)
                            })
                        }else{
                            Object.keys(device[deviceSensor]).forEach(nestedSensor => {
                                if(nestedSensor != "Text" && nestedSensor != "Category"){
                                    console.log(device[deviceSensor][nestedSensor])
                                    if(Array.isArray(device[deviceSensor][nestedSensor])){
                                        device[deviceSensor][nestedSensor].forEach((metric)=>{
                                            out = [nestedSensor]
                                            Object.keys(metric).forEach((value)=>{
                                                if(value !== "Children"){
                                                    out.push(metric[value])
                                                }
                                            })
                                            worksheet.addRow(out)
                                        })
                                    }
                                    
                                }
                            })
                        }
                        
                    }
                })

            })
        }
    });
    await workbook.xlsx.writeFile(file.filePath);
}

exports.exportToExcel = exportToExcel;