import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper } from "./Wrapper";

interface LayoutProps {
  varient?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, varient }) => {
  return (
    <>
      <NavBar />
      <Wrapper varient={varient}>{children}</Wrapper>
    </>
  );
};

export default Layout;
