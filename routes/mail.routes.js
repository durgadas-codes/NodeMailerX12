import express from "express";
import {
    deleteEmail,
    generateEmails,
    getEmailById,
    getMyEmails,
    sendMail,
    updateEmail
} from "../controller/mail.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateEmails);
router.get("/", authMiddleware, getMyEmails);
router.get("/:id", authMiddleware, getEmailById);
router.put("/:id", authMiddleware, updateEmail);
router.delete("/:id", authMiddleware, deleteEmail);
router.post("/send", authMiddleware, sendMail);
export default router;