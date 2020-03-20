const express = require("express");
const multer = require('multer');
const jimp = require("jimp");

const router = express.Router();
const employeeController = require("../controllers/employeeController");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + '-' + file.originalname + ".jpg")
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter
});

const avatarUploadOptions = {
    storage: multer.memoryStorage(),
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: (req, file, next) => {
        if (file.mimetype.startsWith("image/")) {
            next(null, true);
        } else {
            next(null, false);
        }
    }
};

const uploadAvatar = multer(avatarUploadOptions).single("image");
const noneAvatar = multer(avatarUploadOptions).none();

const resizeAvatar = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const extension = req.file.mimetype.split("/")[1];
    req.file.path = `static/uploads/${
        req.file.originalname
    }-${Date.now()}.${extension}`;
    const image = await jimp.read(req.file.buffer);
    await image.resize(250, jimp.AUTO);
    await image.write(`./${req.file.path}`);
    next();
};


/* Error handler for async / await functions */
const catchErrors = fn => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

router.post("/create_training", employeeController.create_training);
router.post("/add_employee_trainings", employeeController.add_employee_trainings);
router.get("/trainings", employeeController.trainings);
router.get("/employee_trainings/:id", employeeController.employee_trainings);
router.get("/training_reports/:id", employeeController.training_reports);


router.post("/leave_update", employeeController.leave_update);
router.post("/leave", employeeController.leave);
router.post("/leave_delete", employeeController.leave_delete);
router.get("/leaves/:id", employeeController.leaves);
router.get("/casual_leaves", employeeController.casual_leaves);
router.get("/earned_leaves", employeeController.earned_leaves);
router.get("/leaves_count", employeeController.leaves_count);
router.get("/leaves_yearly_count", employeeController.leaves_yearly_count);
router.get("/all_leaves", employeeController.all_leaves);
router.post("/login", employeeController.login);
router.get("/account", employeeController.account);


router.get("/tubewells", employeeController.tubewells);
router.post("/update_tubewell", employeeController.update_tubewell);


router.get("/", employeeController.index);
router.get("/employee_list", employeeController.employee_list);
router.get("/employee/:id", employeeController.showEmployee);
router.get("/show_one_employee/:id", employeeController.show_one_employee);
router.get("/show_one_employee_address/:id", employeeController.show_one_employee_address);
router.get("/designation_list/:id", employeeController.designation_list_items);
router.get("/training_list/:id", employeeController.training_list);
router.get("/search", employeeController.listSearch);
router.get("/department_list", employeeController.department_list);
router.get("/designation_list", employeeController.designation_list);
router.get("/division_list", employeeController.division_list);
router.get("/sub_division_list/:id", employeeController.sub_division_list);
router.get("/tubwells_list/:id", employeeController.tubwells_list);
router.get("/employee_designation_details/:id", employeeController.employee_designation_details);
router.get("/employee_transfer_details/:id", employeeController.employee_transfer_details);
router.get("/get_employee_status/:id", employeeController.get_employee_status);


router.post("/employee_create", uploadAvatar, resizeAvatar, employeeController.create);
router.post("/upload_profile_image", uploadAvatar, resizeAvatar, employeeController.upload_profile_image);
router.post("/document_file", uploadAvatar, resizeAvatar, employeeController.document_file);
router.get("/documents/:id", employeeController.documents);
router.post("/set_employee_status", upload.single('image'), employeeController.set_employee_status);
router.post("/set_employee_password", upload.single('image'), employeeController.set_employee_password);

router.post("/create_employee_designation", uploadAvatar, resizeAvatar, employeeController.create_employee_designation);
router.post("/employee_create_address", employeeController.employee_create_address);
router.post("/add_employee_address", employeeController.add_employee_address);
router.post("/create_division", employeeController.create_division);
router.post("/create_department", employeeController.createDepartment);
router.post("/create_designation", employeeController.createDesignation);
router.post("/promote_emoployee", uploadAvatar, resizeAvatar, employeeController.promote_emoployee);
router.post("/transfer_emoployee", uploadAvatar, resizeAvatar, employeeController.transfer_emoployee);
router.post("/add_emoployee_training", upload.single('image'), employeeController.add_emoployee_training);
router.post("/one_employee_update", employeeController.one_employee_update);
router.post("/employee_designation_update", upload.single('image'), employeeController.employee_designation_update);
router.post("/employee_address_update",  employeeController.employee_address_update);

router.get("/complaints_list", employeeController.complaints_list);
router.get("/complaints_weekly_counts", employeeController.complaints_weekly_counts);


router.get("/complain_list", employeeController.complain_list);
router.get("/get_All_complains", employeeController.get_All_complains);
router.get("/consumer_complain_list/:id", employeeController.consumer_complain_list);
router.get("/employee_complain_list/:id", employeeController.employee_complain_list);
router.get("/single_complain/:id", employeeController.single_complain);
router.get("/complain/:id", employeeController.getcomplain);
router.get("/sc/:id", employeeController.sc);
router.post("/complain_register", upload.single('image'), employeeController.complain_register);

router.post("/reporting_complains", upload.none(), employeeController.reporting_complains);

router.post("/reporting_attachment", uploadAvatar, resizeAvatar, employeeController.reporting_attachment);

router.post("/postConsumerAttachment", upload.single('image'), employeeController.postConsumerAttachment);
//router.post("/one_complain_register_Attachment", upload.single('image'), employeeController.one_complain_register_Attachment);
router.post("/create_consumer", upload.fields([{name: 'user_cnic_front_image'}, {name: 'user_cnic_back_image'}, {name: 'user_wasa_bill_image'}]), employeeController.create_consumer);

module.exports = router;
