import { Box } from "@chakra-ui/layout";
import React from "react";

interface WrapperProps {
    varient? : string
}

export const Wrapper: React.FC<WrapperProps> = ({ children ,varient= "regular" }) => {
  return (
    <Box mt={8} mx="auto" maxW= {varient==='regular' ? "800px" : "400px"} w="100%">
      {children}
    </Box>
  );
};
