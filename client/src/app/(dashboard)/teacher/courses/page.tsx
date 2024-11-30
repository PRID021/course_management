"use client";

import Header from "@/components/custom/Header";
import Loading from "@/components/custom/Loading";
import TeacherCourseCard from "@/components/custom/TeacherCourseCard";
import Toolbar from "@/components/custom/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function TeacherCourses() {
  const router = useRouter();
  const { user } = useUser();

  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" });

  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`);
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?.")) {
      await deleteCourse(course.courseId).unwrap();
    }
  };

  const handleCreateCourse = async () => {
    if (!user) return;
    const result = await createCourse({
      teacherId: user.id,
      teacherName: user.username || "Unknown Teacher",
    }).unwrap();

    router.push(`/teacher/courses/${result.courseId}`);
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading course.</div>;

  return (
    <div className="teacher-courses">
      <Header
        title={"Courses"}
        subtitle={"Browser your course"}
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="teacher-courses__header"
          >
            Create Course
          </Button>
        }
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

      <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
          <TeacherCourseCard
            key={course.courseId}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.teacherId === user?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default TeacherCourses;
