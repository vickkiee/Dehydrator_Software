const express          = require('express');
const bodyParser       = require('body-parser');
const tools            = require("./tools/tool");
const getOperationData = require("./tools/operationData");
const cmd              =require('node-cmd');
const { exec }         = require('child_process');
const operationData    = require('./models/operationData');



const app = express();
const port = process.env.PORT || 8080;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var freshStart = true
var currentOperationData = {};
var activeAlarmList = [];
var keepSavingData;
var startDrying;
var theDateTime = false;


if (freshStart) {
  //tools.stopOperation()

  startDrying = false;
  freshStart = false;
}

cmd.get(
  'sudo ./logo.sh',
  function(err, data, stderr){
      console.log('Logo is Displaying',data)
  }
);

setTimeout(() => {
  cmd.get(
    'sudo pkill feh',
    function(err, data, stderr){
        console.log('Turning Off the logo',data)
    }
  ); 
}, 6000);



setInterval(() => {
  getOperationData.getOperationData()
    .then(data1 => {
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + ' ' + time;
      currentOperationData = data1;
      currentOperationData.startDrying = startDrying;
      currentOperationData.serverTime = dateTime;
      currentOperationData.alarms = activeAlarmList;
      currentOperationData.comConnected = true;
        // console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        // console.log(currentOperationData);
        // console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

        if(currentOperationData.endDryingDuration === true){
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        console.log("A drying operation has been completed");
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
            clearInterval(keepSavingData);
            startDrying = false;
        }

        getOperationData.getAlarms()
          .then(data2 => {
            activeAlarmList = data2;
            //console.log("Current Active Alarms :" + JSON.stringify(data2));
            // console.log("PLC data Read Successfull!")
          })
          .catch(e => {
            console.log("Failed to get current active alarms : " + err);
          })

          if (theDateTime === false){
            let dateNow = getOperationData.dateTime;
            console.log(dateNow);
            cmd.get(
              `sudo date ${dateNow.month}${dateNow.day}${dateNow.hour}${dateNow.minute}${dateNow.year}.${dateNow.second}`,
              function(err, data, stderr){
                  if(err){
                    console.log("Failed to set Pi date: ",err)
                  }
                  console.log('DateSet',data)
              }
            );
            theDateTime = true;  
          }
    })
    .catch(err => {
      console.log("Failed to get current operation data : " + err);
      currentOperationData.comConnected = false;
    })

}, 1000)



function saveData() {
  console.log("I am here to save data");
  keepSavingData = setInterval(() => {
    tools.saveOperationData(currentOperationData.operationName, currentOperationData)
      .then(data => {
        console.log("NOT SEt operation data saved");
        tools.saveAlarmHistory(currentOperationData.operationName, activeAlarmList)
          .then(data => {
            console.log("NOT SEt operation Alarm saved");
          })
          .catch(e => {
            console.log("Error in saving alarm: ", e);
          })
      })
      .catch(e => {
        console.log("Error in saving data: ", e);
      })
  }, 10000);
}



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/home.html')
  //  res.json(activeAlarmList);
});

app.get('/dashboard', function (req, res) {
  res.sendFile(__dirname + '/views/dashboard.html')
  //  res.json(activeAlarmList);
});

app.get('/trendlines', function (req, res) {
  res.sendFile(__dirname + '/views/trendlines.html')
  //  res.json(activeAlarmList);
});

app.get('/api/shutdown', function (req, res) {
  getOperationData.stopOperation()
  .then(data => {
    console.log("I stop saving data");
    startDrying = false;
    var shutdownScript = exec('sh shutdown.sh', 
                       (error, stdout, stderr) => {
                       console.log("the stdout: ", stdout);
                       console.log("the stderr: ", stderr);
                       if (error !== null){
                           console.log(`exec error: ${error}`);
                           res.json({shutdown: false, error: error})
                       }else {
                        res.json ({shutdown: true, error: null})  
                       }         
               });
  })
  .catch(e => {
    // res.json("Failed to Stop Operation and Shutdown: ", e);
    var shutdownScript = exec('sh shutdown.sh', 
        (error, stdout, stderr) => {
        console.log("the stdout: ", stdout);
        console.log("the stderr: ", stderr);
        if (error !== null){
           console.log(`exec error: ${error}`);
           res.json({shutdown: false, error: error})
        }else {
           res.json ({shutdown: true, error: null})  
        }         
    });
   })  
});

app.get('/api/connection', function (req, res) {
  var shutdownScript = exec('sh internet.sh', 
                     (error, stdout, stderr) => {
                     console.log("the stdout: ", stdout);
                     console.log("the stderr: ", stderr);
                     if (error !== null){
                         console.log(`exec error: ${error}`);
                         res.json({internet: false, error: error})
                     }else {
                      res.json ({internet: true, error: null})  
                     }         
             });   
});

app.get("/api/dashboard", (req, res) => {
  // console.log("Boot Data: " + JSON.stringify(tools.bootDataRead));
  // console.log("Dashboard Data: " + currentOperationData);
  res.json(currentOperationData);
});

app.get("/api/dashboardchart", (req, res) => {
  // console.log("Boot Data: " + JSON.stringify(tools.bootDataRead));
  tools.getDashboardChartsData()
    .then(data => {
      console.log("Dashboard Charts Data: " + data);
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
});

app.post("/api/createoperation", (req, res) => {
  tools.createOperation(req.body)
    .then(data => {
      res.redirect("/configOperation")
    })
    .catch(e => {
      res.json(e)
    });

});

app.get("/api/operations", (req, res) => {
  console.log("I am here to get operations")
  tools.getOperations()
    .then(data => {
      console.log("Operation: " + data);
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
});

app.get("/configOperation", (req, res) => {
  tools.getOperations()
    .then(data => {
      console.log("Operation: " + data);
      res.render("config", { operationsArray: data });
    })
    .catch(err => {
      res.json(err);
    })
})
// app.get("/editOperation/:name", (req, res) =>{
//     res.redirect("/editOperationF/"+req.params.name)
// });


app.get("/editOperation/:name", (req, res) => {
  console.log("You request for edit?")
  tools.getOperations()
    .then(data => {
      data.forEach(operation => {
        if (operation.operationName == req.params.name) {
          var opeData = {
            operationName: operation.operationName,
            extractorMinSpeed: (operation.extractorMinSpeed) * 3 / 4,
            extractorMaxSpeed: (operation.extractorMaxSpeed * 3) / 4,
            heatSources: operation.heatSources,
            durationActive: operation.durationActive,
            durationTime: (operation.durationTime) / 60,
            targetHumi: ((operation.targetHumi) / 40) + 1,
            targetTemp: operation.targetTemp / 25 - 40
          };
          res.render("editoperation", { operationParams: opeData });
          // res.send("Default Operation selected")
        }
      });
    })
    .catch(err => {
      res.json(err);
    })
})

app.post("/editoperation", (req, res) => {
  console.log("UUUUUUUUUUUUUUUUUUUUUUUUUU")
  console.log(req.body);
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYY")
  tools.editOperation(req.body)
    .then(data => {
      console.log(data)
      res.render("config", { operationsArray: data });
    })
    .catch(err => {
      res.json(err);
    })
})

app.post("/deleteoperation/:name", (req, res) => {
  tools.deleteOperation(req.params.name)
    .then(data => {
      console.log(data);
      res.redirect("/configOperation")
    })
    .catch(e => {
      console.log(e)
    })
})

app.post("/api/selectoperation", (req, res) => {
  console.log(req.body);
  let operation = req.body.operationName;
  tools.setOperation(operation)
    .then(data => {
      currentOperationData.startDrying = true;
      currentOperationData.operationName = operation;
      console.log("Operation Start: ", data)
      saveData()
      res.json(currentOperationData);
    })
    .catch(e => {
      res.json(e);
    })
});

app.get("/api/StopOperation", (req, res) => {
  getOperationData.stopOperation()
    .then(data => {
      console.log("I stop saving data");
      startDrying = false;
      clearInterval(keepSavingData);
      res.json("operation stopped");
    })
    .catch(e => {
      res.json(e);
    })
});

app.get("/dataExport", (req, res) => {
  res.sendFile(__dirname + '/views/exportdata.html')
});
app.post("/api/exportData", (req, res) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
  console.log(req.body);
  console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
  tools.exportData(req.body)
    .then(data => {
      console.log(data);
      // res.render("exportdata", {exportData: data});
      res.json(data);
    })
    .catch(e => {
      console.log(e)
      res.json(e)
    })
})

app.get("/dataAlarms", (req, res) => {
  res.sendFile(__dirname + '/views/exportAlarms.html')
});
app.get("/api/activeAlarms", (req, res) => {
  res.json(activeAlarmList);
});
app.post("/api/exportAlarms", (req, res) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
  console.log(req.body);
  console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
  tools.exportAlarms(req.body)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(e => {
      console.log(e)
      res.json(e)
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));