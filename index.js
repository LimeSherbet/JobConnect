express = require('express');
mysql = require('mysql');
util = require('util');
app = express(); 

var connectionConfig = {
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'mydb'
}
const cors = require('cors');
app.use(cors());

var pool  = mysql.createPool(connectionConfig);
app.use(express.json());

app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3000);
    
});

app.get('/get-jobs', (req, res) => {
    pool.getConnection(function(err, connection) {
        if (err) console.log( err);
        connection.query("SELECT Jobs.idJobs, Jobs.Company_CompanyName, Jobs.jobDescription, Jobs.payRangeLower, Jobs.jobTitle, Jobs.minimumExperience, Jobs.payRangeUpper, (SELECT JSON_ARRAYAGG(JobSkills.Skill) from JobSkills where JobSkills.Jobs_idJobs = Jobs.idJobs) AS skills, (SELECT JSON_ARRAYAGG(JobQualifications.idJobQualifications) from jobqualifications where jobqualifications.Jobs_idJobs = Jobs.idJobs) AS qualifications FROM Jobs GROUP BY Jobs.idJobs;", function (err, result) {
          if (err) {
            console.log("Error: " + err);
            connection.release();
            return res.status(500).json("Error: " + err);
          }
          res.status(200).json(result);
          connection.release();
        });
      });
});

app.get('/get-job', (req, res) => {
  pool.getConnection(function(err, connection) {
      if (err) console.log( err);
      connection.query(`SELECT Jobs.idJobs, Jobs.Company_CompanyName, Jobs.jobDescription, Jobs.payRangeLower, Jobs.jobTitle, Jobs.minimumExperience, Jobs.payRangeUpper, (SELECT JSON_ARRAYAGG(JobSkills.Skill) from JobSkills where JobSkills.Jobs_idJobs = Jobs.idJobs) AS skills, (SELECT JSON_ARRAYAGG(JobQualifications.idJobQualifications) from jobqualifications where jobqualifications.Jobs_idJobs = Jobs.idJobs) AS qualifications FROM Jobs WHERE Jobs.idJobs = ${req.body.idJobs} GROUP BY Jobs.idJobs;`, function (err, result) {
        if (err) {
          console.log("Error: " + err);
          connection.release();
          return res.status(500).json("Error: " + err);
        }
        res.status(200).json(result);
        connection.release();
      });
    });
});




app.post('/create-job', (req, res) => {

  pool.getConnection(function(err, connection) {
      if (err){
        console.log( err);
        connection.release();
        return res.status(500).json("Error: " + err);
      } 
      var idJobsFromInput = 0;
      var sqlSelectCompanyQuery = `SELECT CompanyName FROM Company WHERE CompanyName = '${req.body.Company_CompanyName}';`

      var sqlInsertCompanyQuery = `INSERT INTO Company VALUES ('${req.body.Company_CompanyName}');`

      connection.query(sqlSelectCompanyQuery, function (err, result) {
        if (err) {
          console.log("Error: " + err);
          connection.release();
          return res.status(500).json("Error: " + err);
        }
        if(result.length == 0){
          connection.query(sqlInsertCompanyQuery, function (err, result) {
            if (err) {
              console.log("Error: " + err);
              connection.release();
              return res.status(500).json("Error: " + err);
            }
            insertJob(connection, req, res);
          });
        }
        else{
          insertJob(connection, req, res);
        }
      });
    });


function insertJob(connection, req, res){
  var sqlInsertJobQuery = `INSERT INTO Jobs (Company_CompanyName, jobDescription, payRangeLower, jobTitle, minimumExperience, payRangeUpper) VALUES ('${req.body.Company_CompanyName}', '${req.body.jobDescription}', ${req.body.payRangeLower}, '${req.body.jobTitle}', '${req.body.minimumExperience}', ${req.body.payRangeUpper});`

  connection.query(sqlInsertJobQuery, function (err, result) {
    if (err) {
      console.log("Error: " + err);
      connection.release();
      return res.status(500).json("Error: " + err);
    }

    idJobsFromInput = result.insertId;
        var skills = JSON.parse(req.body.skills);
        var qualifications = JSON.parse(req.body.qualifications);
        skills.forEach(skill => {
          var sqlInsertJobSkillsQuery = `INSERT INTO JobSkills (Jobs_idJobs, Skill) VALUES (${idJobsFromInput}, '${skill}');`
          connection.query(sqlInsertJobSkillsQuery, function (err, result) {
            if (err) {
              console.log("Error: " + err);
              connection.release();
              return res.status(500).json("Error: " + err);
            }
          });
        });
        qualifications.forEach(qualification => {
          var sqlInsertJobQualificationsQuery = `INSERT INTO JobQualifications (Jobs_idJobs, idJobQualifications) VALUES (${idJobsFromInput}, '${qualification}');`

         connection.query(sqlInsertJobQualificationsQuery, function (err, result) {
            if (err) {
              console.log("Error: " + err);
              connection.release();
              return res.status(500).json("Error: " + err);
            }
          });
        });
        res.status(200).json({idJobs: idJobsFromInput});
        connection.release();
      });
    }});
