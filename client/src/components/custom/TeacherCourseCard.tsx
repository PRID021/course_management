import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

function TeacherCourseCard({
  course,
  onEdit,
  onDelete,
  isOwner,
}: TeacherCourseCardProps) {
  return (
    <Card className="course-card-teacher group">
      <CardHeader className="course-card-teacher__header">
        {course.image && (
          <Image
            src={course.image}
            alt={course.title}
            width={370}
            height={200}
            className="course-card-teacher__image"
          />
        )}
      </CardHeader>

      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          <CardTitle className="course-card-teacher__title">
            {course.title}
          </CardTitle>
          <CardDescription className="course-card-teacher__category">
            {course.category}
          </CardDescription>
        </div>
        <p className="text-sm mb-2">
          Status:{" "}
          <span
            className={cn(
              "font-semibold px-2 py-1 rounded ml-1",
              course.status === "Published"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {course.status}
          </span>
        </p>

        {course.enrollments && (
          <p className="mt-1 inline-block text-secondary bg-secondary/10 text-sm font-semibold">
            <span className="font-bold text-white-100">
              {course.enrollments.length}
            </span>{" "}
            Student
            {course.enrollments.length > 1 ? "s " : " "}Enrolled
          </p>
        )}

        <div className="w-full flex gap-2 mt-3">
          {isOwner ? (
            <>
              <div>
                <Button
                  variant="outline"
                  className="course-card-teacher__edit-button"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Course
                </Button>
              </div>
              <div>
                <Button
                  variant="destructive"
                  className="course-card-teacher__delete-button"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Delete Course
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm to-gray-500 italic">View only</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TeacherCourseCard;
