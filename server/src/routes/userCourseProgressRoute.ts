import express from "express";
import {
  getUserCourseProgess,
  getUserEnrolledCourses,
  updateUserCourseProgess,
} from "../controllers/userProgressController";

const router = express.Router();

router.get("/:userId/enrolled-courses", getUserEnrolledCourses);
router.get("/:userId/courses/:courseId", getUserCourseProgess);
router.put("/:userId/courses/:courseId", updateUserCourseProgess);

export default router;
