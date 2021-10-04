import React from "react";
import { Form, Formik } from "formik";

import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMaps";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}



const Register: React.FC<registerProps> = ({}) => {
  const rounter = useRouter()

  const [, register] = useRegisterMutation()

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values , {setErrors }) => {
          const response = await register(values);
          if(response.data?.register?.errors){
            const errMap = toErrorMap(response.data?.register?.errors)
            console.error("fail to register " + errMap)
            setErrors(errMap) 
          } else if(response.data?.register.user){
            rounter.push('/')
          }
          
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            ></InputField>
            <Box mt={5}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              ></InputField>
            </Box>
            <Button
              mt={5}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)  (Register);
