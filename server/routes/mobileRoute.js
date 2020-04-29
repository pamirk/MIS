const express = require("express");
const multer = require('multer');
const jimp = require("jimp");
const router = express.Router();
const mC = require("../controllers/mobileController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random(100) + '-' + file.originalname + ".jpg")
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
const singleFileAttachment = multer(avatarUploadOptions).fields([{name: "attachment"}]);
const cpUpload = multer(avatarUploadOptions).fields([{name: "wasa"}]);
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

const storageX = multer.memoryStorage();
const uploadX = multer({storage: storageX, limits: {fileSize: 5 * 1024 * 1024}});


router.get("/get_employee", mC.get_employee);
router.get("/get_department", mC.get_department);
router.get("/check_connection", mC.check_connection);
router.get("/get_designations", mC.get_designations);
router.get("/all_complains", mC.all_complains);
router.get("/login", mC.login);
router.get("/employee_registration", mC.employee_registration);
router.post("/get_single_employee_for_profile", mC.get_single_employee_for_profile);
router.post("/get_single_consumer_for_profile", mC.get_single_consumer_for_profile);
router.post("/forget_password", mC.forget_password);
router.post("/get_single_employee", mC.get_single_employee);
router.post("/get_forwards_from_complains", mC.get_forwards_from_complains);
router.post("/get_forwards_from_complains_all_delays", mC.get_forwards_from_complains_all_delays);
router.post("/get_forwards_complains", mC.get_forwards_complains);
router.post("/get_forwards", mC.get_forwards);
router.post("/get_total_forwards_from_with_delay", mC.get_total_forwards_from_with_delay);
router.post("/get_forwards_from", mC.get_forwards_from);
router.post("/update_is_seen", mC.update_is_seen);
router.post("/update_is_acknowledged", mC.update_is_acknowledged);
router.post("/single_complain_detail", mC.single_complain_detail);
router.post("/get_total_delays", mC.get_total_delays);
router.post("/update_status", mC.update_status);
router.post("/update_is_delay", mC.update_is_delay);
router.post("/get_filter_single_complains_forwarding_from", mC.get_filter_single_complains_forwarding_from);
router.post("/get_filter_single_complains_forwarding_from_all_delays", mC.get_filter_single_complains_forwarding_from_all_delays);
router.post("/get_complain_resolve", mC.get_complain_resolve);
router.post("/get_single_complains_forwarding", mC.get_single_complains_forwarding);
router.post("/get_forward_by", mC.get_forward_by);
router.post("/get_forward_to", mC.get_forward_to);
router.post("/set_forget_password", mC.set_forget_password);
router.post("/set_forget_password_for_employee", mC.set_forget_password_for_employee);
router.post("/get_sorted_complains_against_date_and_status", mC.get_sorted_complains_against_date_and_status);
router.post("/get_total_coplains_by_department_sort_by_time", mC.get_total_coplains_by_department_sort_by_time);
router.post("/get_total_coplains_by_department", mC.get_total_coplains_by_department);
router.post("/get_single_complains_forwarding_with_attachment", mC.get_single_complains_forwarding_with_attachment);
router.post("/complains", uploadX.none(), mC.complains);
router.post("/set_resolve_complain", uploadX.none(), mC.set_resolve_complain);
router.post("/reporting_complains", noneAvatar, mC.reporting_complains);
router.post("/reporting_attachment", singleFileAttachment, mC.reporting_attachment);
router.post("/registeration",uploadX.single("wasa"), mC.registeration);
router.post("/update_registeration", uploadX.fields([{name: "front"}, {name: "back"}, {name: "wasa"}]), mC.update_registeration);
router.post("/attachment", uploadX.fields([{name: "attachment"}]), mC.attachment);
router.post("/verify_registeration", uploadX.fields([{name: "front"}, {name: "back"}]), mC.verify_registeration);
router.post("/registeration", uploadX.fields([{name: "front"}, {name: "back"}, {name: "wasa"}]), mC.registeration2);
router.post("/posturl", mC.posturl);


module.exports = router;
