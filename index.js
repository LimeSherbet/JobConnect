var http = require('http');
var fs = require('fs');
url = require('url');
express = require('express');
mysql = require('mysql');
path = require('path');
app = express(); 

var publicFolder = path.join(__dirname, './web/dist/web/browser/')
app.use(express.static(publicFolder))
app.use(express.json());

app.listen(4201, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 4200);
    
})

var con = mysql.createConnection({
    user: "root",
    password: "password",
    database: "mydb"
});

app.get('/view-jobs', (req, res) => {
    con.connect(function(err) {
        if (err) console.log( err);
        con.query("SELECT * FROM Jobs INNER JOIN JobSkills on Jobs.idJobs = JobSkills.Jobs_idJobs INNER JOIN JobQualifications on Jobs.idJobs = JobQualifications.Jobs_idJobs", function (err, result) {
          if (err) {
            console.log("Error: " + err);
            return res.status(500).json("Error: " + err);
          }
          res.json(result);
        });
      });
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/dist/web/browser/index.html')
  })
  



