import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
        <p className="text-lg text-default-600 mb-8">
          Sign up to your account to continue your college application journey
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary-600 text-primary-foreground",
            card: "shadow-lg border border-default-200",
            headerTitle: "text-foreground",
            headerSubtitle: "text-default-600",
            socialButtonsBlockButton:
              "border border-default-200 hover:bg-default-100",
            socialButtonsBlockButtonText: "text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput:
              "border border-default-200 focus:border-primary bg-background text-foreground",
            footerActionLink: "text-primary hover:text-primary-600",
          },
        }}
      />
    </section>
  );
}
