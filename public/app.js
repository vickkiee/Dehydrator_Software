
$(document).ready(function () {
  let noServerResponse = 0;
  $.getJSON("/api/operations")
    .then(data => {
      console.log(data);
      data.forEach(operation => {
        $('#select').append(`<option value="${operation.operationName}"> 
                                   ${operation.operationName} 
                                  </option>`);
      })
        .catch(e => {
          console.log(e)
        });

    })
  interval(async () => {
    if (noServerResponse == 100){
      location.reload({forcedReload: true});
    }
    $.getJSON("/api/dashboard")
      .then(async (data) => {
        console.log(data);
        extractorSpeedVal(data.extractorMotorSpeedCommand);
        ovenHumidityVal(data.ovenHumi);
        ovenTempVal(data.ovenTemp);
        otherControls(data);
      })
      .catch((err) => {
        noServerResponse = noServerResponse++;
        console.log(err);
      })
  }, 2500);
});


function interval(func, wait, times) {
  var interv = function (w, t) {
    return function () {
      if (typeof t === "undefined" || t-- > 0) {
        setTimeout(interv, w);
        try {
          func.call(null);
        }
        catch (e) {
          t = 0;
          throw e.toString();
        }
      }
    };
  }(wait, times);

  setTimeout(interv, wait);
};

imageBusy = false;



function operationType(opeSelect) {
  axios({
    method: 'post',
    url: "/api/selectoperation",
    crossdomain: true,
    data: { operationName: opeSelect }
  })
    .then((response) => {
      console.log(response.data);

    })
    .catch((error) => {
      console.log(">>>>>.....>>>>: " + error.message)
    });
}

$("#send").click(function () {
  console.log("You Click Me");
  console.log($("#select").val());
  let opeSelect = $("#select").val()
  if (opeSelect != 'Select Operation') {
    operationType(opeSelect)
  }
})

$("#stop").click(function () {
  $.getJSON("/api/StopOperation")
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    })
})


function otherControls(data) {
  let alarmArray = [];
  if (data.startDrying === true) {
    $("#operationState").text(data.operationName);
  } else {
    $("#operationState").text("None");
  }
  $("#fallbackTemp").text((data.fallbackTemp).toString());
  $("#durationTimerCount").text(((data.durationTimerCount/60).toFixed(2)).toString());
  if (data.extractorVFDstart == true){
    $("#extractorState").text("ON");
  }else{
    $("#extractorState").text("OFF");
  } 
    $("#setDuration").text((data.setDuration).toString());

  if (data.heater1Start == true){
    $("#heater1").text("ON");
  }else{
    $("#heater1").text("OFF");
  }
  if (data.heater2Start == true){
    $("#heater2").text("ON");
  }else{
    $("#heater2").text("OFF");
  }
  $("#dateTime").text("SyncTime: "+data.serverTime);

  alarmArray = data.alarms
  if (alarmArray.length > 0){
    let alarmNo = alarmArray.length
    $("#alarmsNum").text(alarmNo.toString())
  }

}