import AccordionSections from "@/components/custom/AccordionSections";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

function SelectedCourse({ course, handleEnrollNow }: SelectedCourseProps) {
  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{course.title}</h3>
        <p className="selected-course__author">
          By {course.teacherName} |{" "}
          <span className="selected-course__enrollment-count">
            {course.enrollments?.length}
          </span>{" "}
          enrolled
        </p>
      </div>

      <div className="selected-course__content">
        <p className="selected-course__description">{course.description}</p>
        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Course Content</h4>
          <AccordionSections sections={course.sections} />
        </div>

        <div className="selected-course__footer">
          <span className="selected-course__price">
            {formatPrice(course.price)}
          </span>
          <Button onClick={() => handleEnrollNow(course.courseId)}>
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectedCourse;
