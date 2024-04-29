//Initally we include all the required modules
//This includes Express.js to help simplify the creation of the server
//mysql to help interact with the database
//util to help with debugging
//cors to help with cross origin requests
express = require('express');
mysql = require('mysql');
util = require('util');
cors = require('cors');
app = express(); 


//Here we define the connection configuration for the database
var connectionConfig = {
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
  database        : 'mydb'
}


//Here we create a connection pool to help with the connection to the database
var pool  = mysql.createPool(connectionConfig);
//Then we allow the application to use cors for cross origin requests to the 
//server as our angular app and the node.js server are on different ports
app.use(cors());
//We also allow the application to use json as the data format
app.use(express.json());


//Here we start the server on port 3000
//In the callback function we check if there is an error in setting up the server
app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3000);
    
});

//Here we define a get request to get all the jobs from the database
app.get('/get-jobs', (req, res) => {
  //We get a connection from the pool
    pool.getConnection(function(err, connection) {
      //If there is an error we log the error
        if (err) console.log( err);
        //We then query the database to get all the jobs
        connection.query("SELECT Jobs.idJobs, Jobs.Company_CompanyName, Jobs.jobDescription,"+
        " Jobs.payRangeLower, Jobs.jobTitle, Jobs.minimumExperience," + 
        "Jobs.payRangeUpper, (SELECT JSON_ARRAYAGG(JobSkills.Skill) from JobSkills "+
        " where JobSkills.Jobs_idJobs = Jobs.idJobs) AS skills, "+
        "(SELECT JSON_ARRAYAGG(JobQualifications.idJobQualifications)" +
        "from jobqualifications where jobqualifications.Jobs_idJobs = Jobs.idJobs) AS qualifications "+
        " FROM Jobs GROUP BY Jobs.idJobs;", function (err, result) {
          if (err) {
            //If there is an error we log the error and send a 500 status code with the error message
            console.log("Error: " + err);
            connection.release();
            return res.status(500).json("Error: " + err);
          }
          //If there is no error we send a 200 status code with the result
          res.status(200).json(result);
          connection.release();
        });
      });
});

//Here we define a get request to get a specific job from the database
app.get('/get-job', (req, res) => {
  //We get a connection from the pool
  pool.getConnection(function(err, connection) {
    //If there is an error we log the error
      if (err) console.log( err);
      //We then query the database to get the job with the id that was sent in the request
      connection.query("SELECT Jobs.idJobs, Jobs.Company_CompanyName, Jobs.jobDescription, Jobs.payRangeLower, "+
      " Jobs.jobTitle, Jobs.minimumExperience, Jobs.payRangeUpper," + 
      "(SELECT JSON_ARRAYAGG(JobSkills.Skill) from JobSkills where JobSkills.Jobs_idJobs = Jobs.idJobs) AS skills,"+
      " (SELECT JSON_ARRAYAGG(JobQualifications.idJobQualifications) " + 
      "from jobqualifications where jobqualifications.Jobs_idJobs = Jobs.idJobs) AS qualifications FROM Jobs WHERE "+
      ` Jobs.idJobs = ${req.body.idJobs} GROUP BY Jobs.idJobs;`, function (err, result) {
        if (err) {
          //If there is an error we log the error and send a 500 status code with the error message
          console.log("Error: " + err);
          connection.release();
          return res.status(500).json("Error: " + err);
        }
        //If there is no error we send a 200 status code with the result
        res.status(200).json(result);
        connection.release();
      });
    });
});



//Here we define a post request to create a job in the database
app.post('/create-job', (req, res) => {
  //We get a connection from the pool

  pool.getConnection(function(err, connection) {
      if (err){
        //If there is an error we log the error and send a 500 status code with the error message
        console.log( err);
        connection.release();
        return res.status(500).json("Error: " + err);
      } 
      
      var idJobsFromInput = 0;
      //Here we then define queryies to check if the company exists in the database
      //we also define a query for inserting the company into the database
      var sqlSelectCompanyQuery = `SELECT CompanyName FROM Company WHERE CompanyName = '${req.body.Company_CompanyName}';`

      var sqlInsertCompanyQuery = `INSERT INTO Company VALUES ('${req.body.Company_CompanyName}');`
      //Initially we query for the company
      connection.query(sqlSelectCompanyQuery, function (err, result) {
        //If there is an error we log the error and send a 500 status code with the error message
        if (err) {
          console.log("Error: " + err);
          connection.release();
          return res.status(500).json("Error: " + err);
        }
        //If the company does not exist we insert the company into the database
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
        //We then finish by inserting the job into the database
      });
    });

//Here we have a function that we have defined that takes a database connection
//As well as the request and response objects of the calling method.
function insertJob(connection, req, res){
  //Initially we define the query for inserting the job into the database
  var sqlInsertJobQuery = "INSERT INTO Jobs (Company_CompanyName, jobDescription, payRangeLower, "+
  "jobTitle, minimumExperience, payRangeUpper) VALUES " +
  `('${req.body.Company_CompanyName}', '${req.body.jobDescription}', ${req.body.payRangeLower}, `+
  `'${req.body.jobTitle}', '${req.body.minimumExperience}', ${req.body.payRangeUpper});`

  //we then execute the query to instert the job into the database
  connection.query(sqlInsertJobQuery, function (err, result) {
    if (err) {
      console.log("Error: " + err);
      connection.release();
      return res.status(500).json("Error: " + err);
    }

    //We then get the auto incremented ID of the job that was inserted
    idJobsFromInput = result.insertId;

    //We then parse the skills and qualifications from the request body
        var skills = JSON.parse(req.body.skills);
        var qualifications = JSON.parse(req.body.qualifications);
        //then we iterate through the skills and qualifications and insert them into the database
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
          var sqlInsertJobQualificationsQuery = `INSERT INTO JobQualifications (Jobs_idJobs, idJobQualifications) "+
          "VALUES (${idJobsFromInput}, '${qualification}');`

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
