const Database = require("../utils/PoolDatabase");
const mysql = require("mysql");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const jet_secret = "d,f.1`!@f#$&*()@dnkfndf";

const database = new Database();

exports.tubewells = async (req, res) => {
    try {
        const queryString = `SELECT t.tubewell_id,
                                    sub_div_id,
                                    tubewell_name,
                                    rock_type,
                                    lat,
                                    lng,
                                    install_date,
                                    elevation,
                                    is_office,
                                    phone1,
                                    last_update_ts,
                                    address,
                                    ts.ts_id,
                                    status_date,
                                    status_title,
                                    is_active,
                                    status_description,
                                    status_date_change
                             from tubewells t
                                      inner join tubewell_status ts on t.tubewell_id = ts.tubewell_id and is_active = 1;`;
        const {employee_id} = jwt.verify(
            req.headers.authorization,
            jet_secret
        );
        database.query(queryString)
            .then(rows => {
                return res.json({status: 200, tubewells: rows});
            })
            .catch(error => {
                console.log("database error in tubewells routes:  ", error);
                return res.status(401).json({message: 'error in getting tubewells list'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.update_tubewell = async (req, res) => {
    const {
        tubewell_name, rock_type, install_date, elevation, is_office,
        phone1, lat, lng, address, sub_div_id, tubewell_id
    } = req.body;

    const queryString = `update tubewells
                         set tubewell_name = ?,
                             rock_type     = ?,
                             install_date  = ?,
                             elevation     = ?,
                             is_office     = ?,
                             phone1        = ?,
                             lat           = ?,
                             lng           = ?,
                             address       = ?
                         where tubewell_id = ?`;
    try {
        database.query(queryString, [tubewell_name, rock_type, moment(install_date).format('YYYY-MM-DD hh:mm:ss'), elevation,
            is_office, phone1, lat, lng, address, tubewell_id])
            .then(rows => {
                return res.json({status: 200});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in posting leave");
    }

};
exports.complaints_weekly_counts = async (req, res) => {
    try {
        const q1 = `select weekday(created_us) day, COUNT(created_us) count
                    from consumer_complains_table
                    WHERE YEARWEEK(created_us, 1) = YEARWEEK(CURDATE(), 1)
                    group by weekday(created_us);`;
        const q2 = `select weekday(created_us), COUNT(created_us) count
                    from consumer_complains_table
                    WHERE YEARWEEK(created_us, 1) = YEARWEEK(CURDATE() - 7, 1)
                    group by weekday(created_us)`;

        database.query(q1)
            .then(rows1 => {
                database.query(q2)
                    .then(rows2 => res.json({status: 200, weak1: rows1, weak2: rows2}))
            })
            .catch(error => {
                console.log("database error in complaints_weekly_counts routes:  ", error);
                return res.status(401).json({message: 'error in getting complaints_weekly_counts'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.complaints_list = async (req, res) => {
    try {
        const {employee_id} = jwt.verify(
            req.headers.authorization,
            jet_secret
        );
        const queryString = `select *
                             from employee_login
                             where employee_id = ?`;

        database.query(queryString, [employee_id])
            .then(rows => {
                const employee = rows[0];
                if (employee.is_admin === 1) {
                    const queryString = `SELECT cct.*,
                                                urt.*,
                                                crb.complains_reporting_id,
                                                forwards_to,
                                                forwards_by,
                                                forwards_date,
                                                forwards_message,
                                                suggested_date_reply,
                                                employee_name,
                                                is_reply,
                                                status,
                                                is_current,
                                                is_acknowledged,
                                                is_seen,
                                                is_public

                                         FROM consumer_complains_table as cct
                                                  left join user_registration_table urt on cct.account_number = urt.account_number
                                                  left join complains_reporting_body crb
                                                            on cct.complain_id = crb.complain_id AND is_current = 1
                                         order by crb.forwards_date DESC, created_us DESC `;
                    database.query(queryString)
                        .then(rows => {
                            return res.json({status: 200, rows})
                        })
                } else if (employee.is_admin === 0) {
                    const queryString = `SELECT cct.*,
                                                urt.*,
                                                crb.complains_reporting_id,
                                                forwards_to,
                                                forwards_by,
                                                forwards_date,
                                                forwards_message,
                                                suggested_date_reply,
                                                employee_name,
                                                is_reply,
                                                status,
                                                is_current,
                                                is_acknowledged,
                                                is_seen,
                                                is_public

                                         FROM consumer_complains_table as cct
                                                  left join user_registration_table urt on cct.account_number = urt.account_number
                                                  left join complains_reporting_body crb
                                                            on cct.complain_id = crb.complain_id AND is_current = 1
                                         where forwards_to = ?
                                         order by crb.forwards_date DESC, created_us DESC `;
                    database.query(queryString, [employee_id]).then(rows => {
                        return res.json({status: 200, rows})
                    })
                }
            })
            .catch(error => {
                console.log("database error in leaves routes:  ", error);
                return res.status(401).json({message: 'error in getting leaves'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.trainings = async (req, res) => {
    try {
        const q1 = `SELECT *
                    from trainings
                    order by last_update_ts desc;`;
        const q2 = `SELECT category,
                           sum(IF(gender = 'male', 1, 0))   as Males,
                           sum(IF(gender = 'female', 1, 0)) as Females
                    from trainings as t
                             left join employee_trainings et on t.id = et.t_id
                             left join employees e on et.employee_id = e.employee_id
                    group by category;`;
        /* const {employee_id} = jwt.verify(req.headers.authorization, jet_secret);*/
        database.query(q1)
            .then(rows => {
                database.query(q2)
                    .then(rows2 => res.json({status: 200, trainings: rows, reports: rows2}));
            })
            .catch(error => {
                console.log("database error in trainings routes:  ", error);
                return res.status(401).json({message: 'error in getting trainings'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.all_leaves = async (req, res) => {
    try {
        const queryString = `SELECT leaves.*, e.full_name
                             from leaves
                                      left join employees e on leaves.employee_id = e.employee_id
                             order by last_update_ts desc;`;
        /* const {employee_id} = jwt.verify(
             req.headers.authorization,
             jet_secret
         );*/
        database.query(queryString)
            .then(rows => {
                return res.json({status: 200, leaves: rows});
            })
            .catch(error => {
                console.log("database error in leaves routes:  ", error);
                return res.status(401).json({message: 'error in getting leaves'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.leaves = async (req, res) => {
    try {
        const querySting = `SELECT leaves.*, e.full_name
                            from leaves
                                     left join employees e on leaves.employee_id = e.employee_id
                            where leaves.employee_id = ?
                            order by last_update_ts desc`;
        database.query(querySting, [req.params.id])
            .then(rows => res.json({status: 200, leaves: rows}))
            .catch(error => {
                console.log("database error in leaves routes:  ", error);
                return res.status(401).json({message: 'error in getting leaves'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.casual_leaves = async (req, res) => {
    try {
        const querySting = `SELECT *
                            from leaves
                            where employee_id = ?
                              and lt_id = 1
                            order by last_update_ts desc;`;
        const {employee_id} = jwt.verify(req.headers.authorization, jet_secret);
        database.query(querySting, [employee_id])
            .then(rows => {
                return res.json({status: 200, leaves: rows});
            })
            .catch(error => {
                console.log("database error in casual_leaves routes:  ", error);
                return res.status(401).json({message: 'error in getting casual_leaves'});
            });


    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.earned_leaves = async (req, res) => {
    try {
        const querySting = `SELECT *
                            from leaves
                            where employee_id = ?
                              and lt_id = 2
                            order by last_update_ts desc;`;
        const {employee_id} = jwt.verify(req.headers.authorization, jet_secret);
        database.query(querySting, [employee_id])
            .then(rows => {
                return res.json({status: 200, leaves: rows});
            })
            .catch(error => {
                console.log("database error in earned_leaves routes:  ", error);
                return res.status(401).json({message: 'error in getting earned_leaves'});
            });


    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.leaves_yearly_count = async (req, res) => {
    try {
        const q = `select date_format(entertain_on, '%Y-%m-%d') date, COUNT(entertain_on) count
                   from leaves
                   WHERE status = 'Approved'
                     and YEAR(entertain_on) = YEAR(CURDATE())
                   group by date_format(entertain_on, '%Y-%m-%d');`;

        database.query(q)
            .then(rows => res.json({status: 200, data: rows}))
            .catch(error => {
                console.log("database error in leaves_yearly_count routes:  ", error);
                return res.status(401).json({message: 'error in getting leaves_yearly_count'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.leaves_count = async (req, res) => {
    try {
        const querySting = `select count(L.lv_id) count
                            from employees E
                                     LEFT JOIN leaves L on L.employee_id = E.employee_id
                                     LEFT JOIN leave_types lt on L.lt_id = lt.lt_id
                            where E.employee_id = ?
                              and L.status = 'Approved'
                              and L.lt_id = 1
                              and (entertain_on between DATE_FORMAT(NOW(), '%Y-01-01') AND NOW())
                            union
                            select count(L.lv_id) as count
                            from employees E
                                     LEFT JOIN leaves L on L.employee_id = E.employee_id
                                     LEFT JOIN leave_types lt on L.lt_id = lt.lt_id
                            where E.employee_id = ?
                              and L.status = 'Approved'
                              and L.lt_id = 2;`;

        const {employee_id} = jwt.verify(req.headers.authorization, jet_secret);
        database.query(querySting, [employee_id, employee_id])
            .then(rows => res.json({status: 200, data: rows}))
            .catch(error => {
                console.log("database error in leaves_count routes:  ", error);
                return res.status(401).json({message: 'error in getting leaves_count'});
            });
    } catch (error) {
        console.error(error);
        res.status(403).send("Please login again");
    }
};
exports.leave_update = async (req, res) => {
    const {status, reply_note, entertain_by, entertain_on, lv_id} = req.body;
    const querySting = `update leaves
                        set status       = ?,
                            reply_note   = ?,
                            entertain_by = ?,
                            entertain_on = ?
                        where lv_id = ?`;
    try {
        database.query(querySting, [status, reply_note, entertain_by, moment(entertain_on).format('YYYY-MM-DD hh:mm:ss'), lv_id])
            .then(rows => {
                return res.json({status: 200});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in posting leave");
    }

};
exports.training_reports = async (req, res) => {
    try {
        console.log(req.params.id);
        const q = `SELECT t.id,
                          sum(1)                           as Total,
                          sum(IF(gender = 'male', 1, 0))   as Males,
                          sum(IF(gender = 'female', 1, 0)) as Females
                   from trainings as t
                            left join employee_trainings et on t.id = et.t_id
                            left join employees e on et.employee_id = e.employee_id
                   where t_id = ?`;
        const q2 = `SELECT d.des_scale scale, count(d.des_scale) as count
                    from trainings as t
                             inner join employee_trainings et on t.id = et.t_id
                             inner join employees e on et.employee_id = e.employee_id
                             inner join employees_designations ed on (e.employee_id = ed.employee_id && is_active)
                             inner join designations d on ed.des_id = d.des_id
                    where t_id = ?
                    group by des_scale;`;
        const q3 = `SELECT d2.department_name, count(d2.department_name) AS DepartCount
                    from trainings as t
                             inner join employee_trainings et on t.id = et.t_id
                             inner join employees e on et.employee_id = e.employee_id
                             inner join employees_designations ed on (e.employee_id = ed.employee_id && is_active)
                             inner join designations d on ed.des_id = d.des_id
                             inner join department d2 on d.department_id = d2.department_id
                    where t_id = ?
                    group by d2.department_name;`;
        database.query(q, [req.params.id])
            .then(rows => {
                const gender = rows;
                database.query(q2, [req.params.id])
                    .then(rows2 => {
                        const grade = rows2
                        database.query(q3, [req.params.id])
                            .then(rows3 => res.json({gender: gender[0], grade: grade, depart: rows3}))
                    });
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("training_reports error");
    }

};
exports.employee_trainings = async (req, res) => {
    try {
        console.log(req.params.id);
        const q = `SELECT t.*
                   from employee_trainings as et
                            left join trainings t on et.t_id = t.id
                   where employee_id = ?
                   order by last_update_ts DESC;`;
        const q2 = `SELECT t.category, COUNT(t.category) AS count
                    from employee_trainings as et
                             left join trainings t on et.t_id = t.id
                    where employee_id = ?
                    group by t.category;`;
        database.query(q, [req.params.id])
            .then(rows => {
                database.query(q2, [req.params.id])
                    .then(rows2 => res.json({trainings: rows, categories: rows2}));
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_trainings error");
    }

};

exports.add_employee_trainings = async (req, res) => {
    const {employee_id, t_ids} = req.body;
    const valueString = t_ids.map(i => "(" + employee_id + ", " + i + ")");
    const queryString = `insert into employee_trainings (employee_id, t_id) VALUE ${valueString}`;
    try {
        database.query(queryString, [employee_id])
            .then(rows => {
                return res.json({status: 200});
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in posting add_employee_trainings");
    }
};
exports.create_training = async (req, res) => {
    const {title, description, offered_by, funded_by, category, address, start_date, end_date} = req.body;
    const queryString = 'insert into trainings (title, description, offered_by, funded_by, category, address, start_date, end_date) VALUE (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        database.query(queryString, [title, description, offered_by, funded_by, category, address,
            moment(start_date).format('YYYY-MM-DD hh:mm:ss').toString(),
            moment(end_date).format('YYYY-MM-DD hh:mm:ss').toString()])
            .then(rows => {
                return res.json({status: 200});
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in posting leave");
    }
};

exports.leave = async (req, res) => {
    const {start_day, end_day, description, employee_id, status, reply_note, entertain_by, entertain_on, lt_id} = req.body;
    const querySting = 'insert into leaves(employee_id, start_date, end_date, status, description, reply_note,entertain_by, entertain_on, lt_id) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        database.query(querySting, [employee_id, moment(start_day).format('YYYY-MM-DD hh:mm:ss').toString(),
            moment(end_day).format('YYYY-MM-DD hh:mm:ss').toString(), status, description, reply_note, entertain_by, entertain_on, lt_id])
            .then(rows => {
                const querySting = 'SELECT * from leaves where lv_id = ?';
                database.query(querySting, [rows.insertId])
                    .then(rows => {
                        return res.json({status: 200, rows});
                    })
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in posting leave");
    }

};
exports.leave_delete = async (req, res) => {
    const {lv_id} = req.body;
    const querySting = 'delete from leaves where lv_id = ? ';
    try {
        database.query(querySting, [lv_id])
            .then(rows => {
                return res.json({status: 200, messaga: 'leave deleted'});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in deleting leave, try later");
    }

};
exports.login = async (req, res) => {
    const {email, password} = req.body;
    const querySting = `SELECT *
                        from employees
                        where email = ?;`;
    try {
        database.query(querySting, [email])
            .then(async (rows) => {
                if (!rows[0]) return res.status(404).send("No user exists with that email");
                const user = rows[0];
                const querySting2 = `SELECT *
                                     from employee_login
                                     where employee_id = ?;`;
                database.query(querySting2, [user.employee_id])
                    .then(async (rows) => {
                        const employee_login = rows[0];
                        if (!employee_login) return res.status(404).send("No user exists with that email");
                        const authenticated = (employee_login.employee_password === req.body.password);
                        if (authenticated) {
                            const token = jwt.sign({employee_id: user.employee_id}, jet_secret, {
                                expiresIn: "7d"
                            });
                            console.log("authenticated", token);
                            res.status(200).json(token);
                        } else {
                            console.log("Passwords do not match");

                            res.status(401).send("Passwords do not match");
                        }
                    })
                    .catch(error => {
                        console.log("database error findUser:  ", error);
                        return res.status(401).json({message: 'database error findUser'});
                    });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Error logging in user");
            });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in user");
    }
};

exports.account = async (req, res) => {
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }

    try {
        const {employee_id} = jwt.verify(req.headers.authorization, jet_secret);
        const querySting = `SELECT *
                            from employee_login
                            where employee_id = ?;`;
        database.query(querySting, [employee_id])
            .then(async (rows) => {
                const employee_login = rows[0];
                if (!employee_login) {
                    return res.status(404).send("No user exists with that email");
                } else {
                    const querySting2 = `SELECT *
                                         from employees
                                         where employee_id = ?;`;
                    database.query(querySting2, [employee_login.employee_id])
                        .then(rows => {
                            console.log()
                            res.status(200).json({employee: rows[0], employeeLogin: employee_login});
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).send("Error account");
                        });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(404).send("User not found");
            });
    } catch (error) {
        res.status(403).send("Invalid token");
    }
};


exports.index = async (req, res) => {
    return res.json({status: 200})
};

exports.reporting_complains = async (req, res) => {
    try {
        const Values = [
            req.body.complains_reporting_id,
            req.body.complain_id,
            req.body.forwards_to,
            req.body.forwards_by,
            req.body.forwards_date,
            req.body.forwards_message,
            req.body.suggested_date_reply,
            req.body.emp_name,
            req.body.is_reply,
            req.body.status,
            req.body.is_public,
            1 // is_current
        ];
        const status = req.body.status;
        const complain_id = req.body.complain_id;

        console.log(Values);
        const update_Complaint_status = `UPDATE consumer_complains_table
                                         SET complain_status = ?
                                         where complain_id = ?;`;
        database.query(update_Complaint_status, [status, complain_id])
            .then(rows => {
                console.log("inside reporting_complains");
                const update_querySting = `UPDATE complains_reporting_body
                                           SET is_current = 0
                                           where complain_id = ?;`;
                database.query(update_querySting, [complain_id])
                    .then(rows => {
                        console.log("inside reporting_complains update");
                        const querySting =
                                `insert into complains_reporting_body(complains_reporting_id, complain_id, forwards_to,
                                                                      forwards_by, forwards_date, forwards_message,
                                                                      suggested_date_reply, employee_name, is_reply,
                                                                      status,
                                                                      is_public, is_current)
                                 values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        database.query(querySting, Values)
                            .then(rows => {
                                console.log("inside reporting_complains");
                                console.log("201");
                                return res.json({status: 201});
                            }).catch(err => {
                            console.log(err);
                            return res.json({status: 400, err: err});
                        })
                    })
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("reporting_complains error");
    }
};
exports.create_consumer = async (req, res) => {
    try {
        console.log("inside create_consumer");
        console.log(req.body);
        console.log(req.files);
        const Values = [
            req.body.account_number,
            req.body.user_cnic,
            req.body.user_name,
            req.body.user_email,
            req.body.user_password,
            req.body.user_address,
            req.body.user_contact,
            req.files.user_cnic_front_image[0].path,
            req.files.user_cnic_back_image[0].path,
            req.files.user_wasa_bill_image[0].path,
        ];
        console.log(Values);

        const querySting = "insert into user_registration_table(account_number, user_cnic, user_name, user_email, user_password, user_address, user_contact, user_cnic_front_image, user_cnic_back_image, user_wasa_bill_image) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        database.query(querySting, Values)
            .then(rows => {
                console.log("inside create_consumer");
                console.log("201");
                return res.json({status: 201});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })

    } catch (error) {
        console.error(error);
        res.status(403).send("create_consumer error");
    }
};

exports.create_employee_designation = async (req, res) => {
    try {
        //console.log(req.body);
        const employeeValues = [
            req.body.employee_id,
            req.body.des_id,
            moment(req.body.designation_order_date).format('YYYY-MM-DD').toString(),
            moment(req.body.des_appointment_date).format('YYYY-MM-DD').toString(),
            req.file.path];

        const querySting = `insert into employees_designations(employee_id, des_id, order_date, appointment_date, order_letter_photo)
                            values (?, ?, ?, ?, ?);`;

        database.query(querySting, employeeValues)
            .then(rows => {
                console.log("inside create_employee_designation");
                const eemployeesDesignations_id = rows.insertId;
                res.json({status: 200, eemployeesDesignations_id})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("create_employee_designation error");
    }
};
exports.complain_register = async (req, res) => {
    try {
        const Values = [
            req.body.complain_id,
            req.body.account_number.toString(),
            req.body.complain_body,
            req.body.complain_status,
        ];
        console.log(Values);
        const querySting = "insert into consumer_complains_table(complain_id, account_number, complain_body, complain_status) values (?, ?, ?, ?);";
        database.query(querySting.Values)
            .then(rows => {
                console.log("inside complain_register");
                console.log("200");
                res.json({status: 200})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("complain_register error");
    }
};


exports.reporting_attachment = async (req, res) => {
    try {
        console.log(req.body);
        const Values = [
            req.body.attachment_id,
            req.body.reporting_id,
            req.file.path,
            req.body.attachment_file_type
        ];

        console.log(Values);
        const querySting =
                `insert into reporting_attachments( reporting_attachments_id, complains_reporting_id
                                                  , reporting_attachment_name
                                                  , reporting_attachment_file_type)
                 values (?, ?, ?, ?);`;

        database.query(querySting, Values)
            .then(rows => {
                console.log("inside reporting_attachment");
                console.log("200");
                res.json({status: 200})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })

    } catch (error) {
        console.error(error);
        res.status(403).send("reporting_attachment error");
    }
};

exports.postConsumerAttachment = async (req, res) => {
    try {
        console.log(req.body);
        const Values = [
            req.body.attachment_id,
            req.body.complain_id.toString(),
            req.file.path,
            req.body.attachment_file_type
        ];
        console.log(Values);
        const querySting = `insert into consumer_attachment(attachment_id, complain_id, attachment_name, attachment_file_type)
                            values (?, ?, ?, ?);`;
        database.query(querySting, Values)
            .then(rows => {
                console.log("inside complain_register_Attachment");
                console.log("200");
                res.json({status: 200})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("[postConsumerAttachment] error");
    }

};
exports.employee_designation_details = async (req, res) => {
    try {
        const q = `SELECT emp_des.emp_des_id,
                          emp_des.order_date         AS emp_des_order_date,
                          emp_des.appointment_date   AS emp_des_appointment_date,
                          emp_des.order_letter_photo AS emp_des_order_letter_photo,
                          emp_des.is_active          AS emp_des_is_active,
                          des.des_title,
                          des.des_id,
                          des.des_scale,
                          depart.department_name,
                          depart.department_description,
                          depart.department_city_name
                   FROM employees_designations AS emp_des
                            INNER JOIN designations AS des ON emp_des.des_id = des.des_id
                            INNER JOIN department AS depart ON des.department_id = depart.department_id
                   where emp_des.employee_id = ?
                   order by emp_des.is_active DESC, emp_des.appointment_date DESC;`;

        database.query(q, [req.params.id])
            .then(rows => res.json(rows))
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_designation_details error");
    }
}

//TODO: deprecated
exports.training_list = async (req, res) => {
    try {
        console.log(req.params.id);
        const querySting = `SELECT * from employees_trainings where employee_id = ${req.params.id} order by train_start_date DESC ;`;
        database.query(querySting)
            .then(rows => {
                console.log(" inside training_list");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("training_list error");
    }

};
exports.employee_transfer_details = async (req, res) => {
    try {
        console.log(req.params.id);
        const q = `SELECT ts.* , t.tubewell_name as Tubewell, sd.sub_div_name as Sub_Division, d.div_title as Division
                from transfers ts
                inner join tubewells t on ts.tubewell_id = t.tubewell_id
                inner join sub_division sd on t.sub_div_id = sd.sd_id
                inner join divisions d on sd.div_id = d.div_id
                where employee_id = ${req.params.id}
                order by is_active DESC`;
        database.query(q)
            .then(rows => {
                console.log(" inside training_list");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_transfer_details error");
    }
};

exports.get_employee_status = async (req, res) => {
    console.log(req.params.id);
    try {
        const querySting = `SELECT *
                            from employee_login
                            where employee_id = ?;`;
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log(" inside training_list");
                let is_active = 0;
                if (rows[0]) {
                    is_active = rows[0].employee_is_active
                }
                console.log(is_active);
                res.json({status: 200, is_active: is_active})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("get_employee_status error");
    }
};

exports.upload_profile_image = async (req, res) => {
    try {
        console.log(req.body.employee_id);
        console.log(req.file.path);
        const queryString = "UPDATE employees set employees.employee_photo = ? where employees.employee_id = ? ";
        database.query(queryString, [req.file.path, req.body.employee_id])
            .then(rows => res.json({status: 200}))
            .catch(error => res.json({status: 500, err: error.sqlMessage}));

    } catch (error) {
        res.json({status: 500, err: error.sqlMessage});
    }
};
exports.documents = async (req, res) => {
    try {
        const q = `SELECT *
                   from documents
                   where employee_id = ?`;
        database.query(q, [req.params.id])
            .then(rows => res.json({status: 200, rows}))
            .catch(error => res.json({status: 500, err: error.sqlMessage}));
    } catch (error) {
        res.json({status: 500, err: error.sqlMessage});
    }
};
exports.document_file = async (req, res) => {
    try {
        const queryString = `INSERT into documents(document_name, document_link, employee_id, enterby_id) VALUE (?, ?, ?, ?)`;
        database.query(queryString, [req.body.document_name, req.file.path, req.body.employee_id, req.body.enterby_id])
            .then(rows => {
                res.json({status: 200, rows})
            })
            .catch(error => res.json({status: 500, err: error.sqlMessage}));
    } catch (error) {
        res.json({status: 500, err: error.sqlMessage});
    }
};
exports.create = async (req, res) => {
    try {
        const e = req.body;
        const values = [
            e.form_number,
            e.cnic,
            e.full_name,
            e.father_name,
            moment(e.appointment_date).format('YYYY-MM-DD'),
            moment(e.birth_date).format('YYYY-MM-DD'),
            e.gender,
            e.email,
            e.local,
            req.file.path];

        const q = `insert into employees(form_number, cnic, full_name, father_name, appointment_date,
                                                   birth_date, gender, email, local, employee_photo)
                             values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        database.query(q, values)
            .then(rows => {
                const employee_id = rows.insertId;
                res.json({status: 200, employee_id})
            })
            .catch(error => {
                console.log("database error in leaves routes:  ", error);
                res.json({status: 500, err: error.sqlMessage});
            });
    } catch (error) {
        console.error(error);
        res.json({status: 500, err: error.sqlMessage});
    }
};

exports.set_employee_status = async (req, res) => {
    try {
        console.log(req.body.status, req.body.id);
        let status = req.body.status === 'true' ? 1 : 0;
        let querySting = "SELECT * from employee_login where employee_id = ?;";
        database.query(querySting, [req.body.id])
            .then(rows => {
                console.log("i think we did createEmployee");
                if (rows.length === 0) {
                    querySting = "insert into employee_login(employee_id, employee_is_active, employee_password) values (?,?,?);";
                    database.query(querySting, [req.body.id, status, "admin"])
                        .then(rows => {
                            console.log("inside insert");
                            console.log(200, rows);
                            res.json({status: 200, rows})
                        })
                } else {
                    querySting = "update  employee_login set employee_is_active = ? where employee_id = ?;";
                    database.query(querySting, [status, req.body.id])
                        .then(rows => {
                            console.log("inside update");
                            console.log(200, rows);
                            res.json({status: 200, rows})
                        })
                }
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })


    } catch (error) {
        console.error(error);
        res.status(403).send("set_employee_status error");
    }
};

exports.set_employee_password = async (req, res) => {
    try {
        console.log(req.body.password, req.body.id);
        let querySting = "SELECT * from employee_login where employee_id = ?;";

        database.query(querySting, [req.body.id])
            .then(rows => {
                console.log("inside set_employee_password");
                if (rows.length === 0) {
                    console.log("ok  500");
                    return res.json({status: 500});
                } else {
                    querySting = "update  employee_login set employee_password = ? where employee_id = ?;";
                    database.query(querySting, [req.body.password, req.body.id])
                        .then(rows => {
                            console.log("inside update");
                            console.log(200, rows);
                            res.json({status: 200, rows})
                        })
                }
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })

    } catch (error) {
        console.error(error);
        res.status(403).send("se_employee_password error");
    }
}

exports.add_employee_address = async (req, res) => {
    try {
        const addressvalues = [
            req.body.current_address,
            req.body.permanent_address,
            req.body.postal_code,
            req.body.phone_number,
            req.body.phone_number2,
            req.body.employee_id,
            1,
            1,
            req.body.type
        ];
        console.log(addressvalues);

        const q = `UPDATE addresses
                   SET is_current = 0
                   where employee_id = ?;`;
        const q2 = `insert into addresses(current_address, permanent_address, postal_code, phone_number,
                                          phone_number2, employee_id, is_current, city_id, type)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        database.query(q, [req.body.employee_id])
            .then(rows => {
                database.query(q2, addressvalues)
                    .then(rows2 => res.json({status: 200, row: rows2[0]}))
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_create_address error");
    }

};
exports.employee_create_address = async (req, res) => {
    try {
        const addressvalues = [
            req.body.current_address,
            req.body.permanent_address,
            req.body.postal_code,
            req.body.phone_number,
            req.body.phone_number2,
            req.body.employee_id,
            1
        ];
        console.log(addressvalues);
        //employee_id, current_address, permanent_address, postal_code, phone_number, phone_number2, city_id
        const queryAddress = `insert into addresses(current_address, permanent_address, postal_code, phone_number,
                                                    phone_number2, employee_id, city_id)
                              values (?, ?, ?, ?, ?, ?, ?);`;
        database.query(queryAddress, addressvalues)
            .then(rows => {
                console.log(rows[0]);
                res.json({status: 200, row: rows[0]})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_create_address error");
    }

};
exports.show_one_employee = async (req, res) => {
    try {
        const querySting = "SELECT * FROM employees where employee_id = ?;";
        database.query(querySting, [req.params.id])
            .then(rows => res.json(rows))
            .catch(err => res.json({status: 500, err: err}))
    } catch (error) {
        res.status(403).send("show_one_employee error");
    }
};
exports.show_one_employee_address = async (req, res) => {
    try {
        const q = `SELECT *
                   FROM addresses
                   where employee_id = ?
                   order by is_current desc`;
        database.query(q, [req.params.id])
            .then(rows => res.json(rows))
            .catch(err => res.json({status: 500, err: err}))
    } catch (error) {
        res.status(403).send("show_one_employee_address error");
    }
};
exports.createDepartment = async (req, res) => {
    try {
        const department = req.body.department;
        const departmentValues = [department.department_name, department.department_description, department.department_city_name];
        const querySting = "insert into department(department_name, department_description, department_city_name) values (?, ?, ?);";
        database.query(querySting, departmentValues)
            .then(rows => {
                console.log("inside createDepartment");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("createDepartment error");
    }
};
exports.create_division = async (req, res) => {
    try {
        const division = req.body.division;
        if (division.division_name && division.division_description) {
            res.json({status: 500});
            return
        }
        const divisionValues = [division.division_name, division.division_description];
        const querySting = "insert into divisions(div_title, div_description) values (?, ?);";
        console.log(divisionValues);
        database.query(querySting, divisionValues)
            .then(rows => {
                console.log("inside create_division");
                console.log("create_division: Success:", rows);
                res.json({status: 200});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("create_division error");
    }

};
exports.createDesignation = async (req, res) => {
    try {
        const designation = req.body.designation;
        const departmentValues = [designation.designation_title, designation.designation_scale, designation.department_id];
        const querySting = "insert into designations(des_title, des_scale, department_id) values (?, ?, ?);";
        database.query(querySting, departmentValues)
            .then(rows => {
                console.log("i think we create it");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("createDesignation error");
    }
};
exports.listSearch = async (req, res) => {
    // const pagination = req.query.pagination
    //     ? parseInt(req.query.pagination) : 10;
    // const page = req.query.page ? parseInt(req.query.page) : 1;
    try {
        if (req.query.search) {
            console.log("00-   " + req.query.search);
            const search_criteria = req.query.search;
            const querySting = `SELECT * FROM employees where full_name like '%${search_criteria}%';`;
            database.query(querySting)
                .then(rows => {
                    console.log("i think we search_criteria it");
                    console.log(rows);
                    res.json(rows)
                }).catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
        } else {
            res.status(404).send({message: "nothing"})
        }
    } catch (error) {
        console.error(error);
        res.status(403).send("listSearch error");
    }
};
exports.showEmployee = async (req, res) => {
    try {
        console.log(req.params.id);
        const querySting = "SELECT emp.employee_id, emp.cnic, emp.full_name, emp.father_name, emp.appointment_date, emp.birth_date, emp.gender, emp.email, emp.local, emp.employee_photo,\n" +
            "       adrs.current_address, adrs.permanent_address, adrs.postal_code, adrs.phone_number, adrs.phone_number2,\n" +
            "       emptrain.train_name, emptrain.train_description, emptrain.train_start_date, emptrain.train_end_date, emptrain.train_location_name, emptrain.certificate_photo AS trian_certificate_photo,\n" +
            "       emp_des.order_date AS emp_des_order_date, emp_des.appointment_date AS emp_des_appointment_date, emp_des.order_letter_photo AS emp_des_order_letter_photo, emp_des.is_active emp_des_is_active,\n" +
            "       des.des_title, des.des_scale,\n" +
            "       depart.department_name, depart.department_description, depart.department_city_name\n" +
            "FROM employees AS emp\n" +
            "INNER JOIN addresses AS adrs ON emp.employee_id = adrs.employee_id\n" +
            "INNER JOIN employees_trainings AS emptrain ON emp.employee_id = emptrain.employee_id\n" +
            "INNER JOIN employees_designations AS emp_des ON emp.employee_id = emp_des.employee_id\n" +
            "INNER JOIN designations AS des ON emp_des.des_id = des.des_id\n" +
            "INNER JOIN department AS depart ON des.department_id = depart.department_id\n" +
            "where emp.employee_id = ?;";
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log(" we are in designation_list_items");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("showEmployee error");
    }
};
exports.employee_list = async (req, res) => {
    try {
        console.log("responding to employee_list route");
        const querySting = "SELECT * FROM employees";
        database.query(querySting)
            .then(rows => {
                console.log("i think we dit it");
                console.log(rows);
                res.json(rows);
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_list error");
    }
};
exports.department_list = async (req, res) => {
    try {
        console.log("responding to department_list route");
        const querySting = "SELECT * FROM department;";
        database.query(querySting)
            .then(rows => {
                console.log("i think we dit it");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("department_list error");
    }
};
exports.division_list = async (req, res) => {
    try {
        console.log("responding to division_list route");
        const querySting = "SELECT * FROM divisions;";
        database.query(querySting)
            .then(rows => {
                console.log("inside division_list");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("division_list error");
    }
};
exports.sub_division_list = async (req, res) => {
    try {
        console.log("responding to sub_division_list route");
        console.log(req.params.id);
        const querySting = "SELECT * FROM sub_division where div_id = ?;";
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log("inside sub_division_list");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("sub_division_list error");
    }

};
exports.tubwells_list = async (req, res) => {
    try {
        console.log("responding to tubwells_list route");
        console.log(req.params.id);

        const querySting = "SELECT * FROM tubewells where sub_div_id = ?;";

        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log(" we are in tubwells_list");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("tubewells_list error");
    }

};
exports.designation_list = async (req, res) => {
    try {
        console.log("responding to department_list route");
        const querySting = "SELECT * FROM designations;";
        database.query(querySting)
            .then(rows => {
                console.log("i think we dit it");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("designation_list error");
    }
};
exports.designation_list_items = async (req, res) => {
    try {
        console.log("responding to designation_list_items route");
        console.log(req.params.id);

        const querySting = "SELECT * FROM designations where department_id = ?;";
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log(" we are in designation_list_items");
                console.log(rows);
                res.json(rows)
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("designation_list_items error");
    }

};
exports.one_employee_update = async (req, res) => {
    try {
        const b = req.body;
        const employeeValues = [b.cnic, b.full_name, b.father_name,
            moment(b.appointment_date).format('YYYY-MM-DD hh:mm:ss').toString(),
            moment(b.birth_date).format('YYYY-MM-DD hh:mm:ss').toString(),
            b.gender, b.email, b.local, b.employee_id];
        console.log(employeeValues)
        const q = `UPDATE employees
                   SET cnic            = ?,
                       full_name       = ?,
                       father_name     = ?,
                       appointment_date= ?,
                       birth_date= ?,
                       gender= ?,
                       email= ?,
                       local= ?
                   where employee_id = ?;`;
        database.query(q, employeeValues)
            .then(rows => {
                res.json({status: 200, row: rows[0]})
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("one_employee_update error");
    }

};
exports.employee_designation_update = async (req, res) => {
    try {
        const {emp_des_order_date, emp_des_appointment_date, department_name, des_title, employee_id, emp_des_id, des_id} = req.body
        const querySting = `UPDATE employees_designations
                            SET des_id           = ?,
                                order_date       = ?,
                                appointment_date = ?
                            where emp_des_id = ?;`;
        database.query(querySting, [des_id,
            moment(emp_des_order_date).format('YYYY-MM-DD hh:mm:ss').toString(),
            moment(emp_des_appointment_date).format('YYYY-MM-DD hh:mm:ss').toString(), emp_des_id])
            .then(rows => {
                console.log("inside createEmployee");
                console.warn("200 : employee_designation_update");
                return res.json({status: 200, row: rows[0]})
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_designation_update error");
    }


};
exports.employee_address_update = async (req, res) => {
    try {

        const employee = req.body;
        const {employee_id} = req.body;
        const {address_id} = req.body;
        const employeeValues = [
            employee.current_address,
            employee.permanent_address,
            employee.postal_code,
            employee.phone_number,
            employee.phone_number2,
            moment(employee.last_update_ts).format('YYYY-MM-DD hh:mm:ss').toString(),
            employee.address_id,
        ];
        const querySting = `UPDATE addresses
                            SET current_address   = ?,
                                permanent_address = ?,
                                postal_code       = ?,
                                phone_number      = ?,
                                phone_number2     = ?,
                                last_update_ts    = ?
                            where address_id = ?;`;
        database.query(querySting, employeeValues)
            .then(rows => res.json({status: 200, row: rows[0]}))
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_address_update error");
    }
};

//    const querySting = "select * from consumer_complains_table as comp left join consumer_attachment ca on comp.complain_id = ca.complain_id where comp.account_number = '999-888-111';";
exports.complain_list = async (req, res) => {
    try {
        console.log("responding to complain_list route");
        const querySting = `SELECT cct.*,
                                   urt.*,
                                   crb.complains_reporting_id,
                                   forwards_to,
                                   forwards_by,
                                   forwards_date,
                                   forwards_message,
                                   suggested_date_reply,
                                   employee_name,
                                   is_reply,
                                   status,
                                   is_current,
                                   is_acknowledged,
                                   is_seen,
                                   is_public

                            FROM consumer_complains_table as cct
                                     left join user_registration_table urt on cct.account_number = urt.account_number
                                     left join complains_reporting_body crb
                                               on cct.complain_id = crb.complain_id AND is_current = 1
                            order by crb.forwards_date DESC, created_us DESC `;
        database.query(querySting)
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows);
                res.json({status: 200, rows});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("complain_list error");
    }
};
exports.get_All_complains = async (req, res) => {
    try {
        console.log("responding to complain_list route");

        const querySting = `SELECT *
                            FROM consumer_complains_table
                            ORDER BY created_us DESC  `;
        database.query(querySting)
            .then(rows => {
                console.log("inside get_All_complains");
                console.log(rows);
                res.json({status: 200, rows});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("get_All_complains error");
    }
};

exports.employee_complain_list = async (req, res) => {
    try {
        console.log("responding to employee_complain_list route");
        const querySting = `SELECT cct.*,
                                   urt.*,
                                   crb.complains_reporting_id,
                                   forwards_to,
                                   forwards_by,
                                   forwards_date,
                                   forwards_message,
                                   suggested_date_reply,
                                   employee_name,
                                   is_reply,
                                   status,
                                   is_current,
                                   is_acknowledged,
                                   is_seen,
                                   is_public

                            FROM consumer_complains_table as cct
                                     left join user_registration_table urt on cct.account_number = urt.account_number
                                     left join complains_reporting_body crb
                                               on cct.complain_id = crb.complain_id AND is_current = 1
                            where forwards_to = ?
                            order by crb.forwards_date DESC, created_us DESC `;
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows);
                return res.json({status: 200, rows});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("employee_complain error");
    }
};
exports.consumer_complain_list = async (req, res) => {
    try {
        console.log("responding to complain_list route");
        const querySting = `SELECT cct.*,
                                   urt.*,
                                   crb.complains_reporting_id,
                                   forwards_to,
                                   forwards_by,
                                   forwards_date,
                                   forwards_message,
                                   suggested_date_reply,
                                   employee_name,
                                   is_reply,
                                   status,
                                   is_current,
                                   is_acknowledged,
                                   is_seen,
                                   is_public

                            FROM consumer_complains_table as cct
                                     left join user_registration_table urt on cct.account_number = urt.account_number
                                     left join complains_reporting_body crb
                                               on cct.complain_id = crb.complain_id AND is_current = 1
                            where cct.account_number = ?
                            order by created_us DESC `;
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows);
                res.json({status: 200, rows});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("consumer_complain_list error");
    }
};
exports.single_complain = async (req, res) => {
    try {
        console.log("inside single_complain", req.params.id);
        const querySting =
                `select *
                 from consumer_complains_table as comp
                          left join user_registration_table
                                    on comp.account_number = user_registration_table.account_number
                          left join consumer_attachment ca on comp.complain_id = ca.complain_id
                          left join complains_reporting_body crb on comp.complain_id = crb.complain_id
                          left join employees on crb.forwards_to = employees.employee_id
                          left join reporting_attachments ra on crb.complains_reporting_id = ra.complains_reporting_id
                 where comp.complain_id = ?
                 order by forwards_date, is_current DESC`;
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows);
                res.json({status: 200, rows});
            }).catch(err => {
            console.log(err);
            return res.json({status: 500, err: err});
        })
    } catch (error) {
        console.error(error);
        res.status(403).send("single_complain error");
    }

};
exports.getcomplain = async (req, res) => {
    try {
        console.log("inside single_complain", req.params.id);
        const querySting =
                `select *
                 from consumer_complains_table as comp
                          left join user_registration_table
                                    on comp.account_number = user_registration_table.account_number
                          left join vw_consumer_attachment ca on comp.complain_id = ca.complain_id
                 where comp.complain_id = ?`;
        database.query(querySting, [req.params.id])
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows[0]);
                res.json({status: 200, row: rows[0]});
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("reporting_complains error");
    }

};

exports.sc = async (req, res) => {
    try {
        console.log("inside sc", req.params.id);

        const query = `select *
                       from vw_responses r
                                left join employees on r.forwards_to = employees.employee_id
                       where complain_id = ?
                       order by forwards_date, is_current DESC`;
        database.query(query, [req.params.id])
            .then(rows => {
                console.log("inside complain_list");
                console.log(rows);
                res.json({status: 200, rows});
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, err: err});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("sc error");
    }

};

exports.promote_emoployee = async (req, res) => {
    try {
        const employeeValues = [
            req.body.employee_id,
            req.body.des_id,
            moment(req.body.emp_des_order_date).format('YYYY-MM-DD hh:mm:ss'),
            moment(req.body.emp_des_appointment_date).format('YYYY-MM-DD hh:mm:ss'),
            req.file.path
        ];
        const update_querySting = `UPDATE employees_designations
                                   SET is_active='0'
                                   where employee_id = ?;`;

        const querySting = "insert into employees_designations(employee_id, des_id, order_date, appointment_date, order_letter_photo ) values (?, ?, ?, ?, ?);";

        database.query(update_querySting, [req.body.employee_id])
            .then(rows => {
                console.log("inside create_employee_designation");
                database.query(querySting, employeeValues)
                    .then(rows => {
                        const eemployeesDesignations_id = rows.insertId;
                        return res.json({status: 200, eemployeesDesignations_id})
                    })
            })
            .catch(err => {
                console.log("500", err.sqlMessage);
                return res.json({status: 500, err: err.sqlMessage});
            })
    } catch (error) {
        console.error(error);
        return res.json({status: 500, err: error.sqlMessage});
    }

};
exports.add_emoployee_training = async (req, res) => {
    try {
        console.log("inside promote_emoployee");
        console.log(req.body);
        const employeeValues = [
            req.body.employee_id,
            req.body.train_name,
            req.body.train_description,
            req.body.train_start_date,
            req.body.train_end_date,
            req.body.train_location_name,
        ];

        console.log(employeeValues);
        const querySting = "insert into employees_trainings(employee_id, train_name, train_description, train_start_date,train_end_date, train_location_name ) values (?, ?, ?, ?, ?, ?);";

        database.query(querySting, employeeValues)
            .then(rows => {
                console.log("inside create_employee_designation");
                const eemployeesDesignations_id = rows.insertId;
                return res.json({status: 200, eemployeesDesignations_id})
            })
            .catch(err => {
                console.log("500", err.sqlMessage);
                return res.json({status: 500, err: err.sqlMessage});
            })
    } catch (error) {
        console.error(error);
        res.status(403).send("add_employee_training error");
    }
};

function convert(str) {
    let date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

exports.transfer_emoployee = async (req, res) => {
    try {
        console.log("inside transfer_emoployee");
        //console.log(req.body);
        const values = [
            req.body.employee_id,
            req.body.tubewell_id,
            req.body.description,
            convert(req.body.transfer_Date),
            convert(req.body.joining_Date),
            req.file.path,
        ];
        //console.log(values);
        // res.json({status: 200})
        //console.log(employeeValues);
        const update_querySting = `UPDATE transfers
                                   SET is_active='0'
                                   where employee_id = ?;`;
        const querySting = "insert into transfers(employee_id, tubewell_id, description, transfer_date, joining_date, order_letter_photo) values (?, ?, ?, ?, ?, ?);";
        database.query(update_querySting, [req.body.employee_id])
            .then(rows => {
                database.query(querySting, values)
                    .then(rows => {
                        console.log("inside transfer_emoployee");
                        res.json({status: 200})
                    })
            })
            .catch(err => {
                console.log("500", err.sqlMessage);
                return res.json({status: 500, err: err.sqlMessage});
            })
    } catch (error) {
        console.error(error);
        res.status(500).send("transfer_employee error");
    }
};

/*
connection.on('error', function(err) {
    console.log("PK handling :---> ",err.code); // 'ER_BAD_DB_ERROR'
    connection = mysql.createConnection({
        host: 'us-cdbr-iron-east-04.cleardb.net', //localhost
        user: 'bc99c51f80ea0b',  // root
        password: '5afe21fc', //root
        database: 'heroku_436891b58c83c67', //pk
    });
});
database.connection.on('error', function(err) {
    console.log("PK handling :---> ",err.code); // 'ER_BAD_DB_ERROR'
    database.connection = mysql.createConnection({
        host: 'us-cdbr-iron-east-04.cleardb.net', //localhost
        user: 'bc99c51f80ea0b',  // root
        password: '5afe21fc', //root
        database: 'heroku_436891b58c83c67', //pk
    });
});
*/
