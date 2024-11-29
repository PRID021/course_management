"use client";

import CoursePreview from "@/components/custom/CoursePreview";
import { CustomFormField } from "@/components/custom/CustomFormField";
import Loading from "@/components/custom/Loading";
import SignInComponent from "@/components/custom/SignInComponent";
import SignUpComponent from "@/components/custom/SignUpComponent";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { GuestFormData, guestSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

function CheckoutDetailPage() {
  const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
  const searchParams = useSearchParams();
  const showSignUp = searchParams.get("showSignUp") === "true";

  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      email: "",
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Fail to load data.</div>;
  if (!selectedCourse) return <div>Course not found.</div>;

  return (
    <div className="checkout-details">
      <div className="checkout-details__container">
        <div className="checkout-details__preview">
          <CoursePreview course={selectedCourse} />
        </div>

        <div className="checkout-details__options mt-4 sm:mt-0">
          <div className="checkout-details__guest">
            <h2 className="checkout-details__title">Guest Checkout</h2>
            <p className="checkout-details__subtitle">
              Enter email to receive course access details to order
              confirmation. You can create an account after purchase.
            </p>

            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => {
                  console.log(data);
                })}
              >
                <CustomFormField name={"email"} label={"Email address"} />
                <Button type="submit" className="checkout-details__submit">
                  Continue as Guest
                </Button>
              </form>
            </Form>

            <div className="checkout-details__divider">
              <hr className="checkout-details__divider-line" />
              <span className="checkout-details__divider-text">Or</span>
              <hr className="checkout-details__divider-line" />
            </div>

            <div className="checkout-details__auth">
              {showSignUp ? <SignUpComponent /> : <SignInComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutDetailPage;
