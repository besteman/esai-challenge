"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-lg text-default-600 mb-8">
          Sign in to your account to continue your college application journey
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border-none ",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "w-full",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors",
            formFieldInput:
              "w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            formFieldLabel: "text-default-700 font-medium mb-1",
            footerActionLink: "text-primary hover:text-primary/90",
            dividerLine: "bg-default-300",
            dividerText: "text-default-500",
            formResendCodeLink: "text-primary hover:text-primary/90",
            otpCodeFieldInput:
              "border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            formFieldErrorText: "text-danger text-sm mt-1",
            identityPreviewText: "text-default-600",
            identityPreviewEditButton: "text-primary hover:text-primary/90",
          },
          layout: {
            showOptionalFields: false,
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
          },
        }}
        signUpUrl="/sign-up"
      />
    </section>
  );
}
