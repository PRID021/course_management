"use client";

import Loading from "@/components/custom/Loading";
import WizardStepper from "@/components/custom/WizardStepper";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useUser } from "@clerk/nextjs";
import CheckoutDetailPage from "./checkout";
import CompletionPage from "./checkout/completion";
import PaymentPage from "./checkout/payment";

function CheckoutWizard() {
  const { isLoaded } = useUser();
  const { checkoutStep } = useCheckoutNavigation();

  if (!isLoaded) return <Loading />;

  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailPage />;
      case 2:
        return <PaymentPage />;
      case 3:
        return <CompletionPage />;
      default:
        return "checkout details page";
    }
  };
  return (
    <div className="checkout">
      <WizardStepper currentStep={checkoutStep} />
      <div className="checkout__content">{renderStep()}</div>
    </div>
  );
}

export default CheckoutWizard;
