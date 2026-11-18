import type { Metadata } from "next";
import FormWrapper from "@/components/authentication/FormWrapper";
import LoginForm from "@/components/authentication/LoginForm";
import React from "react";

export const metadata: Metadata = { title: "Sign in" };

const page = () => {
  return (
    <FormWrapper
      title="Welcome back"
      description="Sign in to pick up where you left off."
      isLogin={true}
    >
      <LoginForm />
    </FormWrapper>
  );
};

export default page;
