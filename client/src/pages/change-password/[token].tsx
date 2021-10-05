import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import {
  useResetPasswordMutationMutation,
  useValidateResetPasswordTokenQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMaps";
import NextLink from "next/link";

export const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  //check if token is correct
  // const [validate,_] = useValidRestPasswordTokenQuery( {variables:{validateResetPasswordTokenToken:token}})
  const [data] = useValidateResetPasswordTokenQuery({ variables: { token } });
  const [, resetPwd] = useResetPasswordMutationMutation();

  const router = useRouter();

  if (data.data.validateResetPasswordToken.errors) {
    return (
      <div>
        token expired, click 
        <NextLink href="/forgot-password">
          <Link ml={1} mt={7}>
            Here
          </Link>
        </NextLink>  to resend the email
      </div>
    );
  }
  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.password !== values.confirmPassword) {
            setErrors({
              confirmPassword: "confirm password not equals to the password",
            });
          }
          const response = await resetPwd({
            password: values.password,
            userid: data.data.validateResetPasswordToken.userid,
          });
          if (response.data?.resetPassword?.errors) {
            const errMap = toErrorMap(response.data?.resetPassword?.errors);
            console.error("fail to register " + errMap);
            setErrors(errMap);
          } else if (response.data?.resetPassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="password"
              placeholder="New password"
              label="New password"
            ></InputField>
            <Box mt={5}>
              <InputField
                name="confirmPassword"
                placeholder="Confirm password"
                label="Confirm password"
              ></InputField>
            </Box>
            <Button
              mt={5}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              reset pasword
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
