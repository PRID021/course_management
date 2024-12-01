import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import Course from "../models/courseModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import { calculateOverallProgress, mergeSections } from "../utils/utils";

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denined" });
    return;
  }

  try {
    const enrolledCourses = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();
    const coursesIds = enrolledCourses.map((item: any) => item.courseId);

    if (coursesIds.length === 0) {
      res.json({
        message: "No enrolled courses found",
        data: [],
      });
      return;
    }

    const courses = await Course.batchGet(coursesIds);
    res.json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error retrieving enrolled coursess", error });
  }
};
export const getUserCourseProgess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, courseId } = req.params;
  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denined" });
    return;
  }

  try {
    const courseProgress = await UserCourseProgress.get({
      userId,
      courseId,
    });

    res.json({
      message: "Course progreess retrieved successfully",
      data: courseProgress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving enrolled coursess", error });
  }
};

export const updateUserCourseProgess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body;

  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denined" });
    return;
  }

  try {
    let courseProgress = await UserCourseProgress.get({
      userId,
      courseId,
    });
    if (!courseProgress) {
      courseProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentData: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
    } else {
      courseProgress.sections = mergeSections(
        progressData.sections || [],
        courseProgress.sections,
      );
      courseProgress.lastAccessedTimestamp = new Date().toISOString();
      courseProgress.overallProgress = calculateOverallProgress(
        courseProgress.sections,
      );
    }

    await courseProgress.save();

    res.json({
      message: "",
      data: courseProgress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error update user's course progress", error });
  }
};
