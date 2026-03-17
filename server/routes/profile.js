import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfile } from "../controller/profileController.js";
import upload from "../middleware/multerMiddleware.js";


const router = express.Router();
router.put("/update", authMiddleware, upload.single("profileImage"), updateProfile);



export default router;
