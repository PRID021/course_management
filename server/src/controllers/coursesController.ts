import { getAuth } from "@clerk/express";
import AWS from "aws-sdk";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/courseModel";

const s3 = new AWS.S3();

export const listCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { category } = req.query;

  console.log("Get course with category: ", category);
  try {
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({
      message: "Error retriving courses",
      error,
    });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Courses not found" });
      return;
    }
    res.json({ message: "Courses retrieved successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error retriving courses", error });
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { teacherId, teacherName } = req.body;
  if (!teacherId || !teacherName) {
    res.status(400).json({ message: "Teacher id and name is requried" });
  }

  const newCourse = new Course({
    courseId: uuidv4(),
    teacherId,
    teacherName,
    title: "Untitled Course",
    description: "",
    category: "Uncategorized",
    price: 0,
    level: "Beginner",
    status: "Draft",
    sections: [],
    enrollments: [],
  });
  await newCourse.save();

  try {
    res.json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error create course", error });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({
        message: "Course does'nt exits.",
      });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(404).json({ message: "Not authorized to update this course" });
      return;
    }

    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format.",
          error: "Price must be a valid number",
        });
        return;
      }
      updateData.price = price * 100;
    }

    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;
      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),

        chapter: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    Object.assign(course, updateData);
    await course.save();
    res.json({ message: "Course created successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error create course", error });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({
        message: "Course does'nt exits.",
      });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(404).json({ message: "Not authorized to delete this course" });
      return;
    }
    await Course.delete(courseId);

    res.json({ message: "Course deleted successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error delete course", error });
  }
};

export const getUploadVideoUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { fileName, fileType } = req.body;
  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and type are requried" });
    return;
  }

  try {
    const uniqueId = uuidv4();
    const s3Key = `video/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      expires: 60,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("pubObject", s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;

    res.json({
      message: "Upload URL generated successfully.",
      data: {
        uploadUrl,
        videoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating upload URL",
      error,
    });
  }
};
