var http = require('http');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(session({
	secret: 'project1', 
	cookie:{maxAge: 15*60*1000}, 
	resave: true,
	rolling:true,
	saveUninitialized:true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var con = mysql.createConnection({
  host: "mysql-instance1.cejcrxrmql06.us-east-1.rds.amazonaws.com",
  user: "abhignabatchu",
  password: "admin123",
  database: "edissdb",
  port:3306
});

con.connect(function(err) {
	//callback
  if (err) throw err;
});


app.post('/login',function(req,res){
	
	var username = req.body.username;
	var password = req.body.password;
	
	con.query("select * from login where username=? and password=?",[username,password],function(err, rows){
		//call back
		if (err) { console.error(err); return; }
		else if(rows.length>0){
			req.session.username = req.body.username;
			
			console.log(" Successful login "+req.body.username);
			   
			   res.json({'message':'Welcome '+rows[0].firstname});		   
		}
		else{
			
			   res.json({'message':'There seems to be an issue with the username/password combination that you entered'});
		   
		}
	});
	
});

app.post('/logout',function(req,res){
	if(req.session.username)
	{
		req.session.destroy();
	    res.json({'message':'You have been successfully logged out'});
	}
	
	else
	{
		res.json({'message':'You are not currently logged in'});
	}
});

app.post('/add',function(req,res){
	
	var num1 = req.body.num1;
	var num2 = req.body.num2;
	if(req.session.username){
	
		if (isNaN(num1) && isNaN(num2)) {
			return res.json({'message':'The numbers you entered are not valid'});	
		
			 
		} else {
			var sum = num1 + num2;
			return res.json({'message': 'The action was successful', 'result': sum}); 
		}	
	}
	else{
		return res.json({'message': 'You are not currently logged in'});
	}
});

app.post('/divide',function(req,res){
	
	var num1 = req.body.num1;
	var num2 = req.body.num2;
	if(req.session.username){
	
	if (isNaN(num1) && isNaN(num2)) {
			 return res.json({'message':'The numbers you entered are not valid'});	
		} else {
			var div = num1 / num2;
			return res.json({'message': 'The action was successful', 'result': div}); 
			
			
		}
	}
	else{
		return res.json({'message': 'You are not currently logged in'});
	}
});

app.post('/multiply',function(req,res){
	
	var num1 = req.body.num1;
	var num2 = req.body.num2;
	if(req.session.username){
	
	if (isNaN(num1) && isNaN(num2)) {
			return res.json({'message':'The numbers you entered are not valid'});	 
		} else {
			var mul = num1 * num2;
			return res.json({'message': 'The action was successful', 'result': mul}); 
			
			
		}
	}
	else{
		return res.json({'message': 'You are not currently logged in'});
	}
});




app.listen(9000, function () {
    console.log('Listening to port 9000');
});