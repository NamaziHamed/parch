import type { Metadata } from "next";
import FormWrapper from "@/components/authentication/FormWrapper";
import RegisterForm from "@/components/authentication/RegisterForm";
import React from "react";

export const metadata: Metadata = { title: "Create account" };

const page = () => {
  return (
    <FormWrapper
      title="Create your notebook"
      description="A blank page is a few seconds away."
      isLogin={false}
    >
      <RegisterForm />
    </FormWrapper>
  );
};

export default page;
