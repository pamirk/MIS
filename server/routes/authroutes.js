'use strict';
const mysql = require("mysql");
const express = require('express');
const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/*const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pk',
});*/

const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b4dd17c9cc2562',
    password: 'dbff6ed9',
    database: 'heroku_28e8ad4c0632e52',
});

// This array is used to keep track of user records
// as they are created.
const users = [];

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

// Construct a router instance.
const router = express.Router();

router.post('/getConsumer', (req, res) => {
    const credentials = {
        cnic: req.body.cnic.trim(),
        password: req.body.password.trim(),
    };
    const querySting = `SELECT * from user_registration_table where user_cnic = ?;`;
    connection.query(querySting, [credentials.cnic], (err, rows, fields) => {
        if (err || rows[0] === undefined) {
            console.log("database error could't find consumer:  ");
            return res.status(401).json({message: 'message with cnic not found'});
        }

        const consumer = rows[0];
        console.log("success consumer: cnic is ", consumer.user_cnic);

        const authenticated = (consumer.user_password === credentials.password);

        if (authenticated) {

            console.log(`Authentication successful for cnic: ${consumer.user_cnic}`);


            res.json(consumer);

        } else {
            res.status(401).json({message: 'Authentication failure for username'});
        }

    });
});


const authenticateUser = (req, res, next) => {
    let message = null;

    // Get the user's credentials from the Authorization header.
    const credentials = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    };
    console.log("credentials:  ", credentials);


    const email = credentials.username.trim();
    const querySting = `SELECT *
                        from employees
                        where email = ?;`;
    connection.query(querySting, [email], (err, rows, fields) => {
        if (err || rows[0] === undefined) {
            console.log("database error findEmployee:  ");
            message = "message with email not found";
            return res.status(401).json({message: 'message with email not found'});

        }
        const employee = rows[0];
        console.log("success findEmployee:  ", employee.employee_id);

        const querySting = `SELECT *
                            from employee_login
                            where employee_id = ?;`;

        connection.query(querySting, [employee.employee_id], (err, rows, fields) => {
            if (err) {
                console.log("database error findUser:  ");
                return res.status(401).json({message: 'database error findUser'});
            }
            console.log("2 success findUser:  ", rows);
            const employee_login = rows[0];


            console.log("employee_login credentials:  ", employee_login);

            if (employee_login !== null) {
                // Look for a user whose `username` matches the credentials `name` property.
                console.log("body:  ", req.body.role);

                if (employee_login) {
                    const authenticated = (employee_login.employee_password === req.body.password);
                    if (authenticated) {
                        console.log(`Authentication successful for username: ${employee_login.employee_id}`);

                        // Store the user on the Request object.
                        req.currentUser = {...employee_login, ...employee};
                    } else {
                        message = `Authentication failure for username`;
                    }
                } else {
                    message = `User not found for username`;
                }
            } else {
                message = 'Auth header not found';
            }


            if (message) {
                console.warn(message);
                res.status(401).json({message: 'Access Denied'});
            } else {
                next();
            }
        });
    });


};


// Route that returns the current authenticated user.
router.post('/getusers', authenticateUser, (req, res) => {
    const user = req.currentUser;
    console.debug(user)
    res.json(user);
});


// Route that creates a new user.
router.post('/users', [
    check('name')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "name"'),
    check('username')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "username"'),
    check('password')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "password"'),], (req, res) => {

    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({errors: errorMessages});
    }

    // Get the user from the request body.
    const user = req.body;

    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);

    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the response.
    return res.status(201).end();
});

module.exports = router;
