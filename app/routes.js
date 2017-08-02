// app/routes.js
module.exports = function(app, passport, connection) {

	// headers middleware =================================================
	app.use(function (req, res, next) {

	    // Website you wish to allow to connect
	    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

	    // Request methods you wish to allow
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	    // Request headers you wish to allow
	    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

	    // Set to true if you need the website to include cookies in the requests sent
	    // to the API (e.g. in case you use sessions)
	    res.setHeader('Access-Control-Allow-Credentials', true);
	    // Pass to next layer of middleware
	    next();
	});

	// =====================================
	// LOGIN ===============================
	// =====================================

	//custom callback
	app.post('/login',
		function(req, res, next) {
			passport.authenticate('local-login',function(err, user, info) {

				if (req.body.remember) {
					req.session.cookie.maxAge = 1000 * 60 * 3;

				} else {
					req.session.cookie.expires = false;
				}

				if (err) { return next(err);}
				if (!user) {
					res.statusCode = 401;
					return res.json(info);
				}

				req.logIn(user, function(err) {
      				if (err) { return next(err); }
      				return res.json(user);
    			});
			})(req,res,next);
		}
	);

	// process the login
	// app.post('/login', passport.authenticate('local-login'),
    //     function(req, res) {

    //         if (req.body.remember) {
	// 		  req.session.cookie.maxAge = 1000 * 60 * 3;

    //         } else {
    //           req.session.cookie.expires = false;
	// 		}

	// 		res.json(req.user);
	// 	}
	// );

	// =====================================
	// SIGNUP ==============================
	// =====================================
	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {

			if (err) { return next(err);}
			if (!user) {
				return res.json(info);
			}

			req.logIn(user, function(err) {
      			if (err) { return next(err); }
      			return res.json(user);
    		});
		})(req,res,next);
	});

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.json(req.user);
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.json({data: {message: "User Logged out"}});
	});

	// =====================================
	// TASKS SECTION =========================
	// =====================================

	//return all the register tasks for the logged user
	app.get('/tasks', isLoggedIn, function(req, res) {

		connection.executeQuery("SELECT * FROM tasks WHERE user_id = ?",[req.user.id], function(err, rows) {
			if (err) { throw err; }

			return res.json(rows);
		});
    });

		//retrieve the given task
		app.get('/tasks/:id', isLoggedIn, function(req, res) {
			connection.executeQuery("SELECT * FROM tasks WHERE id = ?",[req.params.id], function(err, rows) {
				if (err) { throw err; }

				return res.json(rows);
			});
		});

	//register a new task for the logged user
    app.post('/tasks/register', isLoggedIn, function(req, res) {

		var newTaskMysql = {
            title: req.body.title,
            message: req.body.message,
			done: req.body.done,
			user_id: req.user.id
		};

		var insertQuery = "INSERT INTO tasks ( title, message, done, user_id ) values (?,?,?,?)";
		connection.executeQuery(insertQuery,[newTaskMysql.title, newTaskMysql.message, newTaskMysql.done, newTaskMysql.user_id],function(err, result) {
			if (err) { throw err; }

			newTaskMysql.id = result.insertId;
            return res.json(newTaskMysql);
        });
	});

	//delete the given task
	app.delete('/tasks/:id', isLoggedIn, function(req, res) {

		connection.executeQuery("DELETE FROM tasks WHERE id = ?", [req.params.id], function(err, result) {
			if (err) { throw err; }

			if(result.affectedRows == 0) { return res.json({error: {code: 106, message: 'There is no tasks with the given ID'}}); }

			return res.json( {data: {code: 200, message: 'tasks succesfully deleted'}} );
		});
	});

	//update the given task
	app.put('/tasks', isLoggedIn, function(req, res) {

		var updateTaskMysql = {
			id: req.body.id,
            title: req.body.title,
            message: req.body.message,
			done: req.body.done,
			user_id: req.user.id
		};

		connection.executeQuery("UPDATE tasks SET title = ?,message = ?,done = ? WHERE id = ?", [updateTaskMysql.title, updateTaskMysql.message, updateTaskMysql.done, updateTaskMysql.id], function(err, result) {
			if (err) { throw err; }

			if(result.affectedRows == 0) { return res.json({error: {code: 106, message: 'There is no tasks to update'}}); }
			return res.json(updateTaskMysql);
		});
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't
	res.json({error: {code: 104, message: 'The user is not logged in'}});
}
