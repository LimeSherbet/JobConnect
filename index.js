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

app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3000);
    
})

var con = mysql.createConnection({
    user: "root",
    password: "password",
    database: "mydb"
});

app.get('/get-jobs', (req, res) => {
    con.connect(function(err) {
        if (err) console.log( err);
        con.query("SELECT Jobs.idJobs, Jobs.Company_CompanyName, Jobs.jobDescription, Jobs.payRangeLower, Jobs.jobTitle, Jobs.minimumExperience, Jobs.payRangeUpper, JSON_ARRAYAGG(JobSkills.Skill) AS skills, JSON_ARRAYAGG(JobQualifications.idJobQualifications) AS qualifications FROM Jobs INNER JOIN JobSkills ON Jobs.idJobs = JobSkills.Jobs_idJobs INNER JOIN JobQualifications ON Jobs.idJobs = JobQualifications.Jobs_idJobs GROUP BY Jobs.idJobs;", function (err, result) {
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
  



