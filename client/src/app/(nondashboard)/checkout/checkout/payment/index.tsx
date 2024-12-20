import CoursePreview from "@/components/custom/CoursePreview";
import { Button } from "@/components/ui/button";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useCreateTransactionMutation } from "@/state/api";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import StripeProvider from "./StripeProvider";

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [createTransaction] = useCreateTransactionMutation();
  const { navigationToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe service is not available");
      return;
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/checkout?step=3&id=${courseId}`,
      },
      redirect: "if_required",
    });
    if (result.paymentIntent?.status === "succeeded") {
      const transactionData: Partial<Transaction> = {
        transactionId: result.paymentIntent?.id,
        userId: user?.id,
        courseId: courseId,
        paymentProvider: "stripe",
        amount: course?.price || 0,
      };

      await createTransaction(transactionData);
      navigationToStep(3);
    }
  };

  const handleSignoutAndNavigation = async () => {
    await signOut();
    navigationToStep(1);
  };

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>
        {/* Payment Form */}
        <div className="payment__form-container">
          <form
            id="payment__form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payemtn details below to complete your purchase.
              </p>
              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>
                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="payment__card-element">
                    <PaymentElement />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignoutAndNavigation}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          form="payment__form"
          type="submit"
          className="payment__submit"
          disabled={!stripe || !elements}
        >
          Pay With Credit Card
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <StripeProvider>
    <PaymentPageContent />
  </StripeProvider>
);

export default PaymentPage;
