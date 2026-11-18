import React, { ReactNode } from "react";
import Link from "next/link";
import GoogleBtn from "./GoogleBtn";

interface wrapperProps {
  title: string;
  description: string;
  isLogin: boolean;
  children: ReactNode;
}

const FormWrapper = ({
  title,
  children,
  isLogin,
  description,
}: wrapperProps) => {
  return (
    <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      <GoogleBtn />

      <div className="relative my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {children}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "New to Parch? " : "Already have an account? "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default FormWrapper;
