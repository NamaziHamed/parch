import React from "react";
import { Button } from "../ui/button";
import { signInWithGoogle } from "@/utils/authActions";
import { GoogleButtonContent } from "./GoogleBtnContent";

// Wrapped in a <form> so useFormStatus() in GoogleButtonContent can show
// the pending state while the server action redirects to Google.
export default function GoogleBtn() {
  return (
    <form action={signInWithGoogle}>
      <Button
        variant={"outline"}
        className="w-full mb-4 cursor-pointer flex gap-2 py-5"
        type="submit"
      >
        <GoogleButtonContent />
      </Button>
    </form>
  );
}
