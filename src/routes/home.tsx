import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/atoms";
import { ResetPasswordModal } from "@/components/user-management/ResetPasswordModal";

export const Route = createFileRoute("/home")({
  component: HomeComponent,
});

function HomeComponent() {
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const handleResetPassword = (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    console.log("Password reset requested:", data);
    // After successful reset, close the modal
    setIsResetPasswordModalOpen(false);
  };

  return (
    <>
      <div className="w-full h-full max-w-2xl mx-auto bg-white p-8 flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight text-center">
          Welcome to Orano Med
        </h1>
        <img
          src="/under-costruction.jpg"
          alt="Page under construction"
          className="w-full max-w-md mx-auto mb-5 "
        />
        <h1 className="text-2xl font-extrabold text-primary mb-2 tracking-tight text-center">
          Page Under Construction
        </h1>
        <p className="text-base text-muted-foreground mb-4 text-center">
          We&apos;re working hard to bring you a powerful dashboard experience.
          Please check back soon!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsResetPasswordModalOpen(true)}
            className="px-8 py-3 font-semibold text-base"
          >
            Reset Password
          </Button>
        </div>
        <div className="text-center text-gray-400 text-sm pt-2 mt-8">
          <p>© 2025 Orano Med — Medical Research Platform</p>
        </div>
      </div>

      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        onReset={handleResetPassword}
        restrictedMode={true}
      />
    </>
  );
}
