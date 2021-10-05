import React from "react";
import { Form, Formik } from "formik";

import { Box , Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMaps";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";


interface registerProps {}



const Login: React.FC<{}> = ({}) => {
  const rounter = useRouter()

  const [, login] = useLoginMutation()

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values , {setErrors }) => {
          const response = await login( values );
          if(response.data?.login?.errors){
            const errMap = toErrorMap(response.data?.login?.errors)
            console.info(errMap)
            setErrors(errMap) 
          } else if(response.data?.login.user){
            rounter.push('/')
          }
          
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            ></InputField>
            <Box mt={5}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              ></InputField>
            </Box>
            <Flex>
            <Button
              mt={5}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              login
            </Button>
            <NextLink href="/forgot-password">
              <Link ml="auto" mt={7}>forgot password?</Link>
            </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient) (Login);
