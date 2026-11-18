import type { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = { title: "Editor" };

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
