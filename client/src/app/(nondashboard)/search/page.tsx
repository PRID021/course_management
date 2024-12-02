"use client";

import CourseCardSearch from "@/components/custom/CourseCardSearch";
import Loading from "@/components/custom/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (courses) {
      if (id) {
        const course = courses.find((c) => c.courseId === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
    }
  }, [courses, id]);

  const handleCourseSelect = (course: Course): void => {
    setSelectedCourse(course);
    router.push(`/search?id=${course.courseId}`, {
      scroll: true,
    });
  };

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
      scroll: false,
    });
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses.</div>;

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle">{courses.length}</h2>
      <div className="search__content">
        <motion.div
          initial={{ y: 40, opacity: 0.25 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
          }}
          viewport={{
            once: true,
          }}
          className="search__courses-grid"
        >
          {courses.map((course) => (
            <CourseCardSearch
              key={course.courseId}
              course={course}
              isSelected={selectedCourse?.courseId === course.courseId}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>

        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
            className="search__selected-course"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
