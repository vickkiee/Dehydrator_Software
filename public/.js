
$("#dataExport").click(function(){
    console.log("You Want to export data");
    let fileName = "flashDryerData"
    $.getJSON("/api/dashboardchart")
    .then(data => {
        exportCSVFile(headers, data, fileName );
    })
    .catch(e =>{

    });
  })

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

var headers = {
    model: 'Phone Model'.replace(/,/g, ''), // remove commas to avoid errors
    createdAt: "TimeStamp",
    operationName: "Operation Name".replace(/,/g, ''),
    heatExchangerTemp: "HeatExchanger Temp".replace(/,/g, ''),
    burnerTemp: "Burner Temp".replace(/,/g, ''),
    dDuctExhaustTemp: "Drying DuctExhaust Temp".replace(/,/g, ''),
    dDuctExhaustHumi: "Drying DuctExhaust Humi".replace(/,/g, ''),
    materialTemp: "Material Temp".replace(/,/g, ''),
    materialHumi: "Material Humi".replace(/,/g, ''),
    dDuctAirVelocity: "Drying Duct AirVelocity".replace(/,/g, ''),
    dDuctAirPressure: "Drying Duct AirPressure".replace(/,/g, ''),
    feederMotorSpeedCommand: "Feeder Motor SpeedCommand".replace(/,/g, ''),
    blowerMotorSpeedCommand: "Blower Motor SpeedCommand".replace(/,/g, ''),
    extractorMotorSpeed: "Extractor MotorSpeed".replace(/,/g, ''),
    panelTemp: "Panel Temp".replace(/,/g, ''),
    materialPresence: "Material Presence".replace(/,/g, ''),
    burnerStart: "Burner Start".replace(/,/g, ''),
    blowerStart: "Blower Start".replace(/,/g, ''),
    feederStart: "Feeder Start".replace(/,/g, ''),
    extractorStart: "Extractor Start".replace(/,/g, ''),
    feederStatus: "Feeder Status".replace(/,/g, ''),
    blowerStatus: "Blower Status".replace(/,/g, ''),
    extractorStatus: "Extractor Status".replace(/,/g, ''),
    burnerStatus: "Burner Status".replace(/,/g, ''),
    feederManOperation: "Feeder Man Operation".replace(/,/g, ''),
    feederAutoOperation: "Feeder Auto Operation".replace(/,/g, ''),
    blowerManOperation: "Blower Man Operation".replace(/,/g, ''),
    blowerAutoOperation: "Blower Auto Operation".replace(/,/g, ''),
    burnerManOperation: "Burner Man Operation".replace(/,/g, ''),
    burnerAutoOperation: "burner Auto Operation".replace(/,/g, ''),
};

        



// exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download