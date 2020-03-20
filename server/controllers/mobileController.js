const Database = require("../utils/PoolDatabase");
const mysql = require("mysql");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const jet_secret = "d,f.1`!@f#$&*()@dnkfndf";
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const database = new Database();

exports.get_employee = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM employees LEFT JOIN employees_designations ON employees_designations.employee_id = employees.employee_id LEFT JOIN designations ON employees_designations.des_id = designations.des_id LEFT JOIN department ON designations.department_id = department.department_id ORDER BY `employees`.`employee_id` ASC';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in m_get_employee routes:  ", error);
                return res.status(401).json({message: 'error in getting get_employee'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_department = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM department';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in m_get_department routes:  ", error);
                return res.status(401).json({message: 'error in getting get_department'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.check_connection = async (req, res) => {
    try {
        const queryString = 'SELECT 1+1';
        database.query(queryString)
            .then(rows => res.send('Your reporting forwarded succesfull'))
            .catch(error => {
                console.log("database error in check_connection routes:  ", error);
                return res.status(401).json({message: 'error in getting check_connection'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_designations = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM designations';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_designations routes:  ", error);
                return res.status(401).json({message: 'error in getting get_designations'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.all_complains = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM consumer_complains_table ORDER BY created_us DESC';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in all_complains routes:  ", error);
                return res.status(401).json({message: 'error in getting all_complains'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.login = async (req, res) => {
    try {
        const queryString = 'SELECT * from user_registration_table';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in login routes:  ", error);
                return res.status(401).json({message: 'error in getting login'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.employee_registration = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM employees';
        database.query(queryString)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in employee_registration routes:  ", error);
                return res.status(401).json({message: 'error in getting employee_registration'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_single_employee_for_profile = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM employees WHERE employee_id = ?';
        database.query(queryString, [req.body.employee_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_single_employee_for_profile routes:  ", error);
                return res.status(401).json({message: 'error in getting get_single_employee_for_profile'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_single_consumer_for_profile = async (req, res) => {
    try {
        const q = 'SELECT * FROM user_registration_table WHERE user_registration_table.account_number like  ?';
        database.query(q, [req.body.consumer_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_single_consumer_for_profile routes:  ", error);
                return res.status(401).json({message: 'error in getting get_single_consumer_for_profile'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.forget_password = async (req, res) => {
    try {
        let email = req.body.email;
        console.log(email);
        const link = "http://192.168.43.31:3000/public/forget_password/";
        await main(res, email, "Forget password window", link);
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_single_employee = async (req, res) => {
    try {
        const q = 'SELECT * FROM employees_designations INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id INNER JOIN employees ON employees_designations.employee_id = employees.employee_id WHERE employees.employee_id like ?';
        database.query(q, [req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_single_employee routes:  ", error);
                return res.status(401).json({message: 'error in getting get_single_employee'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
//TODO: error get_forwards_from_complains
exports.get_forwards_from_complains = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_by = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                   GROUP BY complains_reporting_body.complain_id
                   ORDER BY consumer_complains_table.created_us DESC`;
        database.query(q, [req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_forwards_from_complains routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forwards_from_complains'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forwards_from_complains_all_delays = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_by = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                     AND is_delay = 0
                     AND NOW() > suggested_date_reply
                     AND (suggested_date_reply NOT LIKE 'NOT DECIDED')
                   GROUP BY complains_reporting_body.complain_id
                   ORDER BY consumer_complains_table.created_us DESC`;
        database.query(q, [req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_forwards_from_complains_all_delays routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forwards_from_complains_all_delays'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forwards_complains = async (req, res) => {
    try {
        let querySeen = `SELECT *, '0' as Cou
                         FROM complains_reporting_body
                                  INNER JOIN consumer_complains_table ON complains_reporting_body.complain_id =
                                                                         consumer_complains_table.complain_id
                         WHERE complains_reporting_body.forwards_to = '50'
                           AND complains_reporting_body.is_seen = 1
                           AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                         GROUP BY complains_reporting_body.complain_id
                         ORDER BY consumer_complains_table.created_us DESC`;
        let queryNotSeen = `SELECT *, COUNT(*) as Cou
                            FROM complains_reporting_body
                                     INNER JOIN consumer_complains_table ON complains_reporting_body.complain_id =
                                                                            consumer_complains_table.complain_id
                            WHERE complains_reporting_body.forwards_to = ?
                              AND complains_reporting_body.is_seen = 0
                              AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                            GROUP BY complains_reporting_body.complain_id
                            ORDER BY consumer_complains_table.created_us DESC`;

        database.query(queryNotSeen, [req.body.des_id])
            .then(rows1 => {
                database.query(querySeen)
                    .then(rows2 => {
                        rows1 = rows1.concat(rows2);
                        res.send(rows1)
                    })

            })
            .catch(error => {
                console.log("database error in get_forwards_complains routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forwards_complains'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forwards = async (req, res) => {
    try {
        const q = `SELECT COUNT(*)                                                             as forward,
                          (SELECT COUNT(*)
                           FROM complains_reporting_body
                           WHERE complains_reporting_body.forwards_to = ?
                             AND complains_reporting_body.is_seen = 0
                             AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED') as forward1
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_to = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'`;
        database.query(q, [req.body.des_id, req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_forwards routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forwards'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};

exports.get_total_forwards_from_with_delay = async (req, res) => {
    try {
        const q = `SELECT COUNT(*) as forward
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_by = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                     AND NOW() > complains_reporting_body.suggested_date_reply
                     AND (suggested_date_reply NOT LIKE 'NOT DECIDED')
                     AND is_delay = '0'`;

        database.query(q, [req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_total_forwards_from_with_delay routes:  ", error);
                return res.status(401).json({message: 'error in getting get_total_forwards_from_with_delay'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forwards_from = async (req, res) => {
    try {
        const q = `SELECT COUNT(*) AS forward
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_by = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'`;

        database.query(q, [req.body.des_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_forwards_from routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forwards_from'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_is_seen = async (req, res) => {
    try {
        const q = `UPDATE complains_reporting_body
                   SET is_seen = 1
                   WHERE complains_reporting_body.complains_reporting_id like ?`;

        database.query(q, [req.body.reporting_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in update_is_seen routes:  ", error);
                return res.status(401).json({message: 'error in getting update_is_seen'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_is_acknowledged = async (req, res) => {
    try {
        const q = `UPDATE complains_reporting_body
                   SET is_acknowledged = 1
                   WHERE complains_reporting_body.complains_reporting_id like ?`;

        database.query(q, [req.body.reporting_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in update_is_acknowledged routes:  ", error);
                return res.status(401).json({message: 'error in getting update_is_acknowledged'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.single_complain_detail = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM consumer_complains_table
                            LEFT JOIN consumer_attachment
                                      ON consumer_complains_table.complain_id = consumer_attachment.complain_id
                   WHERE consumer_complains_table.complain_id LIKE ?
                   UNION
                   SELECT *
                   FROM consumer_complains_table
                            RIGHT JOIN consumer_attachment
                                       ON consumer_complains_table.complain_id = consumer_attachment.complain_id
                   WHERE consumer_complains_table.complain_id LIKE ?`;

        database.query(q, [req.body.reporting_id, req.body.reporting_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in single_complain_detail routes:  ", error);
                return res.status(401).json({message: 'error in getting single_complain_detail'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_total_delays = async (req, res) => {
    try {
        const q = `SELECT *, COUNT(*) as total
                   FROM employees
                            INNER JOIN complains_reporting_body
                                       ON employees.employee_id = complains_reporting_body.forwards_to
                   WHERE complains_reporting_body.is_delay = 1
                   GROUP BY employee_id`;
        database.query(q)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_total_delays routes:  ", error);
                return res.status(401).json({message: 'error in getting get_total_delays'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_status = async (req, res) => {
    try {
        let success = {success: "Your reporting forwarded succesfull"};
        const q = `UPDATE consumer_complains_table
                   SET complain_status = ?
                   where complain_id like ?`;
        database.query(q, [req.body.status, req.body.complain_id])
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in update_status routes:  ", error);
                return res.status(401).json({message: 'error in getting update_status'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_is_delay = async (req, res) => {
    try {
        let success = {success: "Your reporting forwarded succesfull"};
        const q = `UPDATE complains_reporting_body
                   SET is_delay = 1
                   where complains_reporting_body.complains_reporting_id like ?`;
        database.query(q, [req.body.reporting_id])
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in update_is_delay routes:  ", error);
                return res.status(401).json({message: 'error in getting update_is_delay'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_filter_single_complains_forwarding = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            LEFT JOIN employees_designations
                                      ON complains_reporting_body.forwards_to = employees_designations.employee_id
                            LEFT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                     AND forwards_to like ?
                   UNION
                   SELECT *
                   FROM complains_reporting_body
                            RIGHT JOIN employees_designations
                                       ON complains_reporting_body.forwards_to = employees_designations.employee_id
                            RIGHT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                     AND forwards_to like ?
                   ORDER BY forwards_date DESC`;
        database.query(q, [req.body.complain_id, req.body.des_id, req.body.complain_id, req.body.des_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_filter_single_complains_forwarding routes:  ", error);
                return res.status(401).json({message: 'error in getting get_filter_single_complains_forwarding'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_filter_single_complains_forwarding_from = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            LEFT JOIN employees_designations
                                      ON complains_reporting_body.forwards_by = employees_designations.employee_id
                            LEFT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                     AND forwards_by like ?
                   UNION
                   SELECT *
                   FROM complains_reporting_body
                            RIGHT JOIN employees_designations
                                       ON complains_reporting_body.forwards_by = employees_designations.employee_id
                            RIGHT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                     AND forwards_by like ?
                   ORDER BY forwards_date DESC`;
        database.query(q, [req.body.complain_id, req.body.des_id, req.body.complain_id, req.body.des_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_filter_single_complains_forwarding_from routes:  ", error);
                return res.status(401).json({message: 'error in getting get_filter_single_complains_forwarding_from'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_filter_single_complains_forwarding_from_all_delays = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            INNER JOIN consumer_complains_table
                                       ON complains_reporting_body.complain_id = consumer_complains_table.complain_id
                   WHERE complains_reporting_body.forwards_by = ?
                     AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'
                     AND NOW() > complains_reporting_body.suggested_date_reply
                     AND (suggested_date_reply NOT LIKE 'NOT DECIDED')
                     AND is_delay = '0'
                     AND consumer_complains_table.complain_id like ?`;
        database.query(q, [req.body.des_id, req.body.complain_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_filter_single_complains_forwarding_from_all_delays routes:  ", error);
                return res.status(401).json({message: 'error in getting get_filter_single_complains_forwarding_from_all_delays'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_complain_resolve = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complain_resolve
                            INNER JOIN employees ON complain_resolve.resolve_by = employees.employee_id
                            INNER JOIN employees_designations
                                       ON employees.employee_id = employees_designations.employee_id
                            INNER JOIN designations ON employees_designations.des_id = designations.des_id
                            INNER JOIN department ON designations.department_id = department.department_id
                   WHERE complain_id like ?`;
        database.query(q, [req.body.complain_id])
            .then(rows => res.send(rows[0]))
            .catch(error => {
                console.log("database error in get_complain_resolve routes:  ", error);
                return res.status(401).json({message: 'error in getting get_complain_resolve'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_single_complains_forwarding = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            LEFT JOIN employees_designations
                                      ON complains_reporting_body.forwards_to = employees_designations.employee_id
                            LEFT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                   UNION
                   SELECT *
                   FROM complains_reporting_body
                            RIGHT JOIN employees_designations
                                       ON complains_reporting_body.forwards_to = employees_designations.employee_id
                            RIGHT JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id LIKE ?
                   ORDER BY forwards_date DESC`;
        database.query(q, [req.body.complain_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_single_complains_forwarding routes:  ", error);
                return res.status(401).json({message: 'error in getting get_single_complains_forwarding'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forward_by = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            INNER JOIN employees_designations
                                       ON complains_reporting_body.forwards_by = employees_designations.employee_id
                            INNER JOIN employees ON employees_designations.employee_id = employees.employee_id
                            INNER JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id like ?`;
        database.query(q, [req.body.complain_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_forward_by routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forward_by'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_forward_to = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM complains_reporting_body
                            INNER JOIN employees_designations
                                       ON complains_reporting_body.forwards_to = employees_designations.employee_id
                            INNER JOIN employees ON employees_designations.employee_id = employees.employee_id
                            INNER JOIN designations ON employees_designations.des_id = designations.des_id
                   WHERE complain_id like ?`;
        database.query(q, [req.body.complain_id])
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_forward_to routes:  ", error);
                return res.status(401).json({message: 'error in getting get_forward_to'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.set_forget_password = async (req, res) => {
    try {
        const queryCheck = `SELECT COUNT(*)
                            FROM user_registration_table
                            WHERE user_registration_table.account_number like ?`;
        const query = `UPDATE user_registration_table
                       SET user_registration_table.user_password = ?
                       WHERE user_registration_table.account_number like ?`;

        database.query(queryCheck, [req.body.account_number])
            .then(rows => {
                if (rows[0]["COUNT(*)"] >= 1) {
                    database.query(query, [req.body.pass, req.body.account_number])
                        .then(rows2 => res.send("Your password change successfully"))
                } else {
                    res.send("Sorry, this account does not exist");
                }
            })
            .catch(error => {
                console.log("database error in set_forget_password routes:  ", error);
                return res.status(401).json({message: 'error in getting set_forget_password'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.set_forget_password_for_employee = async (req, res) => {
    try {
        const queryCheck = `SELECT COUNT(*)
                            FROM user_registration_table
                            WHERE user_registration_table.account_number like ?`;
        const query = `UPDATE user_registration_table
                       SET user_registration_table.user_password = ?
                       WHERE user_registration_table.account_number like ?`;

        database.query(queryCheck, [req.body.account_number])
            .then(rows => {
                if (rows[0]["COUNT(*)"] >= 1) {
                    database.query(query, [req.body.pass, req.body.account_number])
                        .then(rows2 => res.send("Your password change successfully"))
                } else {
                    res.send("Sorry, this account does not exist");
                }
            })
            .catch(error => {
                console.log("database error in set_forget_password routes:  ", error);
                return res.status(401).json({message: 'error in getting set_forget_password'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_sorted_complains_against_date_and_status = async (req, res) => {
    try {
        let date_to, date_from, status;
        date_to = req.body.date_to;
        date_from = req.body.date_from;
        status = req.body.status;
        let query;
        if (status === "ALL") {
            query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN "${date_to} 00:00:00" AND "${date_from} 23:59:00" AND consumer_complains_table.complain_status like '%' ORDER BY created_us DESC`;
        } else if (status === "INITIATED") {
            query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN "${date_to} 00:00:00" AND "${date_from} 23:59:00" AND (consumer_complains_table.complain_status like 'INITIATED' OR consumer_complains_table.complain_status like 'IN PROCESS') ORDER BY created_us DESC`;
        } else {
            query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN "${date_to} 00:00:00" AND "${date_from} 23:59:00" AND consumer_complains_table.complain_status like "${status}" ORDER BY created_us DESC`;
        }
        database.query(query)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_sorted_complains_against_date_and_status routes:  ", error);
                return res.status(401).json({message: 'error in getting get_sorted_complains_against_date_and_status'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_total_coplains_by_department_sort_by_time = async (req, res) => {
    try {
        let query;
        let department_name = req.body.department_name;
        let date_to = req.body.date_to;
        let date_from = req.body.date_from;
        if (department_name === "ALL") {
            query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN "${date_to}%" AND "${date_from}%" GROUP BY consumer_complains_table.complain_id`;
        } else {
            query = `SELECT * FROM consumer_complains_table inner join complains_reporting_body ON consumer_complains_table.complain_id = complains_reporting_body.complain_id INNER JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id WHERE consumer_complains_table.created_us BETWEEN "${date_to}%" AND "${date_from}%" AND department.department_name = "${department_name}" GROUP BY consumer_complains_table.complain_id`;
        }
        database.query(query)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_total_coplains_by_department_sort_by_time routes:  ", error);
                return res.status(401).json({message: 'error in getting get_total_coplains_by_department_sort_by_time'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_total_coplains_by_department = async (req, res) => {
    try {
        let query;
        let department_name = req.body.department_name;
        if (department_name === "ALL") {
            query = `SELECT *
                     FROM consumer_complains_table`;
        } else {
            query = `SELECT * FROM consumer_complains_table inner join complains_reporting_body ON consumer_complains_table.complain_id = complains_reporting_body.complain_id INNER JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id WHERE department.department_name = "${department_name}" GROUP BY consumer_complains_table.complain_id`;
        }
        database.query(query)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_total_coplains_by_department routes:  ", error);
                return res.status(401).json({message: 'error in getting get_total_coplains_by_department'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.get_single_complains_forwarding_with_attachment = async (req, res) => {
    try {
        let complain_id = req.body.complain_id;
        console.log(complain_id);
        // var query  = `SELECT * FROM complains_reporting_body LEFT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE "${complain_id}" UNION SELECT * FROM complains_reporting_body RIGHT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE "${complain_id}" ORDER BY forwards_date DESC`
        let query = `SELECT * FROM complains_reporting_body LEFT JOIN reporting_attachments ON complains_reporting_body.complains_reporting_id = reporting_attachments.complains_reporting_id WHERE complains_reporting_body.complains_reporting_id LIKE "${complain_id}" UNION SELECT * FROM complains_reporting_body RIGHT JOIN reporting_attachments ON complains_reporting_body.complains_reporting_id = reporting_attachments.complains_reporting_id WHERE complains_reporting_body.complains_reporting_id LIKE "${complain_id}"`;

        database.query(query)
            .then(rows => res.send(rows))
            .catch(error => {
                console.log("database error in get_single_complains_forwarding_with_attachment routes:  ", error);
                return res.status(401).json({message: 'error in getting get_single_complains_forwarding_with_attachment'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.complains = async (req, res) => {
    try {
        let account_number, complain_id, complain_body, complains_status, lat, lng;
        account_number = req.body.account_number;
        complain_id = req.body.complain_id;
        complains_status = req.body.complain_status;
        complain_body = req.body.complain_body;
        lat = req.body.lat;
        lng = req.body.lng;

        let new_id = "new_complain_reporting" + Date.now();
        let success = {
            success: "Your complain registered succesfull"
        };

        let queryReport = `INSERT INTO complains_reporting_body VALUES("${new_id}", "${complain_id}", '50',  '50', NOW(), 'NEW COMPLAIN', 'NOT DECIDED', 'admin', 0, 'REGISTERED', 1, 0, 0, 1,0)`;
        let query = `INSERT INTO consumer_complains_table VALUES("${complain_id}", "${account_number}", "${complain_body}", "${complains_status}", "${lat}", "${lng}",  NOW(), 0)`;

        database.query(query)
            .then(rows => {
                database.query(queryReport)
                    .then(rows2 => {
                        console.log("Report submited to admin");
                        res.send(success)
                    })
            })
            .catch(error => {
                console.log("database error in complains routes:  ", error);
                return res.status(401).json({message: 'error in getting complains'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.set_resolve_complain = async (req, res) => {
    try {
        let resolve_id, complain_id, resolve_by, resolve_message;
        resolve_id = req.body.resolve_id;
        complain_id = req.body.complain_id;
        resolve_by = req.body.resolve_by;
        resolve_message = req.body.resolve_body;
        let success = {
            success: "Your complain resloved succesfull"
        };

        let query = `INSERT INTO complain_resolve VALUES("${resolve_id}", "${complain_id}", "${resolve_by}", "${resolve_message}",  NOW())`;

        database.query(query)
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in set_resolve_complain routes:  ", error);
                return res.status(401).json({message: 'error in getting set_resolve_complain'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.reporting_complains = async (req, res) => {
    try {
        let complains_reporting_id,
            complain_id,
            reporting_id,
            forwards_to,
            forwards_by,
            forwards_message,
            suggested_date_reply,
            emp_name,
            is_reply,
            status,
            is_current;
        complains_reporting_id = req.body.complains_reporting_id;
        complain_id = req.body.complain_id;
        reporting_id = req.body.reporting_id;
        forwards_to = req.body.forwards_to;
        forwards_by = req.body.forwards_by;
        forwards_message = req.body.forwards_message;
        suggested_date_reply = req.body.suggested_date_reply;
        emp_name = req.body.emp_name;
        is_reply = req.body.is_reply;
        let is_seen = req.body.is_seen;
        let is_acknowledged = req.body.is_acknowledged;
        let is_public = req.body.is_public;
        status = req.body.status;
        is_current = req.body.is_current;

        if (reporting_id === "new") {
            console.log("new executes");
            let query = `INSERT INTO complains_reporting_body VALUES("${complains_reporting_id}", "${complain_id}", "${forwards_to}", "${forwards_by}", NOW(), "${forwards_message}", "${suggested_date_reply}", "${emp_name}", "${is_reply}", "${status}", ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public},0)`;
            database.query(query).then(rows => res.send(success))
        } else {
            let queryCheck = `SELECT COUNT(*) FROM complains_reporting_body WHERE complain_id like "${complain_id}"`;
            database.query(queryCheck)
                .then(rows0 => {
                    if (rows0 > 1) {
                        let queryUpdate = `UPDATE complains_reporting_body SET is_current = 0 WHERE complains_reporting_id like ${reporting_id}`;
                        let query = `INSERT INTO complains_reporting_body VALUES("${complains_reporting_id}", "${complain_id}", "${forwards_to}", "${forwards_by}", NOW(), "${forwards_message}", "${suggested_date_reply}", "${emp_name}", ${is_reply}, "${status}", ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public}, 0)`;
                        database.query(queryUpdate).then(rows1 => {
                            database.query(query).then(rows2 => res.send(success));
                        });
                    } else {
                        let statusUpdateQuery = `UPDATE consumer_complains_table SET complain_status = 'INITIATED' WHERE complain_id like "${complain_id}"`;
                        let queryUpdate = `UPDATE complains_reporting_body SET is_current = 0 WHERE complains_reporting_id like ${reporting_id}`;
                        let query = `INSERT INTO complains_reporting_body VALUES("${complains_reporting_id}", "${complain_id}", "${forwards_to}", "${forwards_by}", NOW(), "${forwards_message}", "${suggested_date_reply}", "${emp_name}", ${is_reply}, "${status}", ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public}, 0)`;
                        let employee_email = `SELECT employees.email FROM employees WHERE employees.employee_id = ${forwards_to}`;
                        database.query(statusUpdateQuery)
                            .then(rows1 => database.query(queryUpdate)
                                .then(rows2 => database.query(query)
                                    .then(rows3 => database.query(employee_email)
                                        .then(rows4 => main(res, rows4[0]["email"], "Email forwarded to you", forwards_message)))));
                    }
                });
        }

    } catch (error) {
        console.error(error);
        res.status(403).send("Error in reporting_complains route");
    }
};
exports.reporting_attachment = async (req, res) => {
    try {

        let attachment_id,
            complains_reporting_id,
            attachment_name,
            attachment_file_type;
        attachment_id = req.body.reporting_attachments_id;
        let success = {
            success: "attachment saved!"
        };
        complains_reporting_id = req.body.complains_reporting_id;
        attachment_name = saveFile(req.files["attachment"][0]);
        attachment_file_type = req.body.reporting_attachment_file_type;

        let query = `INSERT INTO reporting_attachments VALUES("${attachment_id}", "${complains_reporting_id}", "${attachment_name}", "${attachment_file_type}",  NOW())`;

        database.query(query)
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in single_complain_detail routes:  ", error);
                return res.status(401).json({message: 'error in getting single_complain_detail'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.attachment = async (req, res) => {
    try {
        let attachment_id, complain_id, attachment_name, attachment_file_type;
        attachment_id = req.body.attachment_id;
        let success = {
            success: "attachment saved!"
        };
        complain_id = req.body.complain_id;
        attachment_name = saveFile(req.files["attachment"][0]);
        attachment_file_type = req.body.attachment_file_type;

        let query = `INSERT INTO consumer_attachment VALUES("${attachment_id}", "${complain_id}", "${attachment_name}", "${attachment_file_type}",  NOW())`;

        database.query(query)
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in single_complain_detail routes:  ", error);
                return res.status(401).json({message: 'error in getting single_complain_detail'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.registeration = async (req, res) => {
    try {
        let account_number, user_cnic, user_name, user_email, user_gender, user_password, user_address, user_contact;
        account_number = req.body.account_number;
        user_cnic = req.body.cnic;
        let query = `SELECT COUNT(*) as available FROM consumers_record WHERE wasa_acc_no like "${account_number}"`;

        database.query(query)
            .then(rows0 => {
                let success = {
                    success: "this account number is not in our record"
                };
                if (rows0[0]["available"] !== 0) {
                    database.query('SELECT * from user_registration_table')
                        .then(rows1 => {
                            let success = {
                                success: "this user is already registered"
                            };
                            for (let i = 0; i < rows1.length; i++) {
                                if (
                                    rows1[i]["user_cnic"] === user_cnic ||
                                    rows1[i]["account_number"] === account_number
                                ) {
                                    res.send(success);
                                    return;
                                }
                            }
                            user_name = req.body.name;
                            user_email = req.body.email;
                            user_password = req.body.pass;
                            user_contact = req.body.contact;
                            user_address = req.body.address;
                            user_gender = req.body.gender;

                            let fileWasa = saveFile(req.files["wasa"][0]);
                            let fileBack = "not required at this stage";
                            success = {
                                success: "new user registered"
                            };

                            let query = `INSERT INTO user_registration_table VALUES("${account_number}", "${user_cnic}", "${user_name}", "${user_email}", "${user_gender}", "${user_password}", "${user_address}", "${user_contact}", "${fileBack}",  "${fileBack}", "${fileWasa}", NOW(), 0)`;
                            database.query(query)
                                .then(rows2 => res.send(success))
                        })
                } else {
                    res.send(success);
                }
            })
            .catch(error => {
                console.log("database error in registeration routes:  ", error);
                return res.status(401).json({message: 'error in getting registeration'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_registeration = async (req, res) => {
    try {
        let account_number, user_cnic, user_name, user_email, user_gender, user_password, user_address, user_contact;

        account_number = req.body.account_number;
        // res.send(account_number)
        user_cnic = req.body.cnic;
        user_name = req.body.name;
        user_email = req.body.email;
        user_password = req.body.pass;
        user_contact = req.body.contact;
        user_address = req.body.address;
        user_gender = req.body.gender;

        let fileWasa = saveFile(req.files["wasa"][0]);
        let fileBack = saveFile(req.files["back"][0]);
        let fileFront = saveFile(req.files["front"][0]);
        let success = {
            success: "Credentials updated"
        };

        let query = `UPDATE user_registration_table set user_email = "${user_email}", user_address = "${user_address}", user_contact = "${user_contact}", user_cnic_front_image = "${fileFront}", user_cnic_back_image = "${fileBack}", user_wasa_bill_image = "${fileWasa}", is_verified = 1 WHERE account_number LIKE "${account_number}"`;


        database.query(query)
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in update_registeration routes:  ", error);
                return res.status(401).json({message: 'error in getting update_registeration'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.verify_registeration = async (req, res) => {
    try {
        let account_number,
            user_cnic,
            user_name,
            user_email,
            user_gender,
            user_password,
            user_address,
            user_contact;

        account_number = req.body.account_number;
        // res.send(account_number)
        user_cnic = req.body.cnic;
        user_name = req.body.name;
        user_email = req.body.email;
        user_password = req.body.pass;
        user_contact = req.body.contact;
        user_address = req.body.address;
        user_gender = req.body.gender;

        // var fileWasa = saveFile(req.files["wasa"][0])
        let fileBack = saveFile(req.files["back"][0]);
        let fileFront = saveFile(req.files["front"][0]);
        let success = {
            success: "Credentials updated"
        };

        let query = `UPDATE user_registration_table set user_cnic_front_image = "${fileFront}", user_cnic_back_image = "${fileBack}", is_verified = 1 WHERE account_number LIKE "${account_number}"`;


        database.query(query)
            .then(rows => res.send(success))
            .catch(error => {
                console.log("database error in verify_registeration routes:  ", error);
                return res.status(401).json({message: 'error in getting verify_registeration'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.registeration2 = async (req, res) => {
    try {
        let account_number, user_cnic, user_name, user_email, user_gender, user_password, user_address, user_contact;
        account_number = req.body.account_number;
        user_cnic = req.body.cnic;
        let query = `SELECT COUNT(*) as available FROM consumers_record WHERE wasa_acc_no like "${account_number}"`;
        database.query(query)
            .then(rows0 => {
                let success = {
                    success: "this account number is valid"
                };
                if (rows0[0]["available"] !== 0) {
                    database.query('SELECT * from user_registration_table')
                        .then(rows1 => {
                            let success = {
                                success: "this user is already registered"
                            };
                            for (let i = 0; i < results.length; i++) {
                                if (rows1[i]["user_cnic"] === user_cnic || rows1[i]["account_number"] === account_number) {
                                    return res.send(success);
                                }
                            }
                            user_name = req.body.name;
                            user_email = req.body.email;
                            user_password = req.body.pass;
                            user_contact = req.body.contact;
                            user_address = req.body.address;
                            user_gender = req.body.gender;

                            let fileBack = saveFile(req.files["back"][0]);
                            let fileWasa = saveFile(req.files["wasa"][0]);
                            let fileFront = saveFile(req.files["front"][0]);
                            success = {
                                success: "new user registered"
                            };
                            let query = `INSERT INTO user_registration_table VALUES("${account_number}", "${user_cnic}", "${user_name}", "${user_email}", "${user_gender}", "${user_password}", "${user_address}", "${user_contact}", "${fileFront}",  "${fileBack}", "${fileWasa}", NOW(), 0)`;
                            database.query(query).then(rows1 => res.send(success))
                        })
                } else {
                    res.send(success);
                }
            })
            .catch(error => {
                console.log("database error in registeration2 routes:  ", error);
                return res.status(401).json({message: 'error in getting registeration2'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.posturl = async (req, res) => {
    try {
        let employee_email = `SELECT employees.email
                              FROM employees
                              WHERE employees.employee_id = 50`;
        database.query(employee_email)
            .then(rows => res.send(rows[0]["email"]))
            .catch(error => {
                console.log("database error in posturl routes:  ", error);
                return res.status(401).json({message: 'error in getting posturl'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};

async function main(res, email, title, message) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don"t have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    const forget_password_string =
        "http://192.168.43.31:3000/public/forget_password/";

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kwaqas40929@gmail.com", // generated ethereal user
            pass: "Drzachezu-7" // generated ethereal password
        }
    });

    let mailOption = {
        from: `WASA OFFICE <kwaqas40929@gmail.com>`,
        to: email,
        subject: title,
        text: message
    };

    transporter.sendMail(mailOption, function (error, info) {
        let success = {success: "Your reporting forwarded succesfull"};
        if (error) {
            console.log(error);
            return res.send({status: 500})
        } else {
            console.log("Email send" + info.response);
            return res.send(success);
        }
    });
}
function saveFile(file) {
    let fileName = file["fieldname"] + "-" + Date.now();
    let extension = file["mimetype"].split("/");
    fs.appendFile('./static/uploads/'  + fileName + "." + extension[1], file["buffer"],
        function (err) {
            if (err) {
                console.error("err in saveFile !", err);
            } else {
                console.log("Saved!");
            }
        }
    );
    return fileName + "." + extension[1];
}
