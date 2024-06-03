import express from "express";
import {
    checkRoleUser,
    createUsers,
    deleteUsers,
    getListUser,
    getUser,
    getUserById,
    Login,
    Logout
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { uploadImages } from "../components/UploadImage.js";
import validateImage from "../middleware/Multer.js";
import validatePDF from "../middleware/Multer2.js";
import { uploadFiles } from "../components/UploadFile.js";
import { getListDataAplikasi } from "../controllers/Aplikasi/list.js";
import { getDetailDataAplikasi } from "../controllers/Aplikasi/detail.js";
import {
    editProcessDataAplikasi,
    setStatusDataAplikasi,
} from "../controllers/Aplikasi/index.js";
import { editDataAplikasi } from "../controllers/Aplikasi/edit.js";
import { deleteDataAplikasi } from "../controllers/Aplikasi/delete.js";

import { getListDataInfrastruktur } from "../controllers/Infrastruktur/list.js";
import { getDetailDataInfrastruktur } from "../controllers/Infrastruktur/detail.js";
import {
    editProcessDataInfrastruktur,
    setStatusDataInfrastruktur,
} from "../controllers/Infrastruktur/index.js";
import { editDataInfrastruktur } from "../controllers/Infrastruktur/edit.js";
import { deleteDataInfrastruktur } from "../controllers/Infrastruktur/delete.js";

const router = express.Router();

// Infrastruktur routes
router.post("/infrastruktur", verifyToken, getListDataInfrastruktur);
router.post("/infrastruktur/detail", verifyToken, getDetailDataInfrastruktur);
router.post("/infrastruktur/create", verifyToken, setStatusDataInfrastruktur);
router.post("/infrastruktur/set_process", verifyToken, editProcessDataInfrastruktur);
router.post("/infrastruktur/edit", verifyToken, editDataInfrastruktur);
router.post("/infrastruktur/delete", verifyToken, deleteDataInfrastruktur);

// Aplikasi routes
router.post("/aplikasi", verifyToken, getListDataAplikasi);
router.post("/aplikasi/detail", verifyToken, getDetailDataAplikasi);
router.post("/aplikasi/create", verifyToken, setStatusDataAplikasi);
router.post("/aplikasi/set_process", verifyToken, editProcessDataAplikasi);
router.post("/aplikasi/edit", verifyToken, editDataAplikasi);
router.post("/aplikasi/delete", verifyToken, deleteDataAplikasi);

// User routes
router.post("/me", verifyToken, getUser);
router.post("/list_users", verifyToken, getListUser);
router.post("/user/check_role", verifyToken, checkRoleUser);
router.post("/users/create", verifyToken, createUsers);
router.post("/users/delete", verifyToken, deleteUsers);
router.post("/users/detail", verifyToken, getUserById);
router.post("/login", Login);
router.post("/logout", Logout);

// Upload routes
router.post("/upload_images", verifyToken, validateImage.single("file"), uploadImages);
router.post("/upload_files", verifyToken, validatePDF.single("file"), uploadFiles);

export default router;