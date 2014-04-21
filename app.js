// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    http       = require('http'),
    ejs        = require('ejs'),
    path       = require('path');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'ndanos',
        password : '2604438'
    });
    
var app = express();
var server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.set('subtitle', 'Lab 18'); 

// Database setup
//connection.query('DROP DATABASE IF EXISTS test', function(err) {
//	if (err) throw err;
	connection.query('CREATE DATABASE IF NOT EXISTS ndanos', function (err) {
	    if (err) throw err;
	    connection.query('USE ndanos', function (err) {
	        if (err) throw err;
        	connection.query('CREATE TABLE IF NOT EXISTS users('
	            + 'id INT NOT NULL AUTO_INCREMENT,'
	            + 'PRIMARY KEY(id),'
        	    + 'username VARCHAR(30),'
		    + 'password VARCHAR(30)'
	            +  ')', function (err) {
        	        if (err) throw err;
	            });
	    });
	});
//});

// Configuration

app.use(express.bodyParser());


// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/2-selectexample.html', function(req, res) {
  res.sendfile(__dirname + '/2-selectexample.html');
});

app.get('/createuser', function(req, res) {
  res.sendfile(__dirname + '/createuser.html');
});

app.get('/getuser', function(req, res) {
  res.sendfile(__dirname + '/getuser.html');
});

app.get('/lab18', function(req, res) { 
 res.render('lab18'); 
 } 
); 



// Update MySQL database

// get user via POST
app.post('/getuser', function (req, res) {
    console.log(req.body);
    
    // get user by id
    if(typeof req.body.id != 'undefined') {
        connection.query('select * from users where id = ?', req.body.id, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<table class="users"><tr><th>ID</th><th>Username</th><th>Password</th></tr>';
                    responseHTML += '<tr><td>' + result[0].id + '</td>' + 
                                    '<td>' + result[0].username + '</td>' +
                                    '<td>' + result[0].password + '</td>' +
                                    '</tr></table>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );     
    }
    //get user by username    
    else if( typeof req.body.username != 'undefined') {
        connection.query('select username, password from users where username = ?', req.body.username, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
  	              res.send('Username: ' + result[0].username + '<br />' +
		  	       'Password: ' + result[0].password
                );
            }
            else
                res.send('User does not exist.');
		});
    }
});


//not for getuser.html
app.post('/user', function (req, res) {
    console.log(req.body);

    // get user by id
    if(typeof req.body.id != 'undefined') {
        connection.query('select * from users where id = ?', req.body.id,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<table class="users"><tr><th>ID</th><th>Username</th><th>Password</th></tr>';
                    responseHTML += '<tr><td>' + result[0].id + '</td>' +
                                    '<td>' + result[0].username + '</td>' +
                                    '<td>' + result[0].password + '</td>' +
                                    '</tr></table>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );
    }
    //get user by username
    else if( typeof req.body.username != 'undefined') {
        connection.query('select username, password from users where username = ?', req.body.username,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                      res.send('Username: ' + result[0].username + '<br />' +
                               'Password: ' + result[0].password
                );
            }
            else
                res.send('User does not exist.');
                });
    }
});


// get user via GET (same code as app.post('/user') above)
app.get('/user', function (req, res) {
    
    // get user by id
    if(typeof req.query.id != 'undefined') {
        connection.query('select * from users where id = ?', req.query.id, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<html><head><title>All Users</title><link href="CS355-Lab14.css" rel="stylesheet"></head><body>';
                    responseHTML += '<div class="header">All Users and Information</div>';
                    responseHTML += '<table class="users"><tr><th>ID</th><th>Username</th><th>Password</th></tr>';
                    responseHTML += '<tr><td>' + result[0].id + '</td>' + 
                                    '<td>' + result[0].username + '</td>' +
                                    '<td>' + result[0].password + '</td>' +
                                    '</tr></table>';
                    responseHTML += '</body></html>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );     
    }
    //get user by username    
    else if( typeof req.query.username != 'undefined') {
        connection.query('select username, password from users where username = ?', req.query.username, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
  	              res.send('Username: ' + result[0].username + '<br />' +
		  	       'Password: ' + result[0].password
                );
            }
            else
                res.send('User does not exist.');
		});
    }
    else {
        res.send('no data for user in request');
    }
});

// return all users
/*
app.get('/users', function (req, res) {
    connection.query('select * from users',
		function (err, result) {
            return result;
		}
	);        
});
*/

//lab 18
app.get('/users', function(req, res){
    connection.query('SELECT * FROM users',
function(err, result) {
res.render('displayUserTable.ejs', {rs: result});
});
});




// get all users in a <table>
app.get('/users/table', function (req, res) {
    connection.query('select * from users',
		function (err, result) {
            if(result.length > 0) {
                var responseHTML = '<html><head><title>All Users</title><link href="/CS355-Lab14.css" rel="stylesheet"></head><body>';
                responseHTML += '<div class="header">All Users</div>';
                responseHTML += '<table class="users"><tr><th class="rightalign">ID</th><th>Username</th><th>Password</th></tr>';
                for (var i=0; result.length > i; i++) {
                    responseHTML += '<tr>' +
                                    '<td><a href="/user/?id=' + result[i].id + '">' + result[i].id + '</a></td>' +
                                    '</tr>';
                }
                responseHTML += '</table>';
                responseHTML += '</body></html>';
                res.send(responseHTML);	
			}
			else
			  res.send('No users exist.');
		}
	);        
});


// get all users in a <select>
app.post('/users/select', function (req, res) {
    console.log(req.body);
	connection.query('select * from users', 
		function (err, result) {
			console.log(result);
			var responseHTML = '<select id="user-list">';
			for (var i=0; result.length > i; i++) {
				var option = '<option value="' + result[i].id + '">' + result[i].username + '</option>';
				console.log(option);
				responseHTML += option;
			}
            responseHTML += '</select>';
			res.send(responseHTML);			
		});
});

// Create a user
app.post('/createuser', function (req, res) {
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select username, password from users where username = ?', req.body.username, 
				function (err, result) {
                    if(result.length > 0) {
						res.send('Username: ' + result[0].username + '<br />' +
								 'Password: ' + result[0].password
						);
                    }
                    else
                      res.send('User was not inserted.');
				}
			);
		}
    );
});


// Static Content Directory

app.use(express.static(path.join(__dirname, 'public')));


// Begin listening
server.listen(8004);
console.log("Express server listening on port %s", server.address().port);
