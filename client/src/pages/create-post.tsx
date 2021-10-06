import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMaps";

const CreatePost: React.FC<{}> = ({}) => {
  const [,createPost] = useCreatePostMutation()
  const router = useRouter()
  const [{data, fetching }] = useMeQuery()
  useEffect(() => {
      if(!data?.me && !fetching) {
         router.replace({pathname: "/login", query:{from:'createPost'}})
      }
  });
  return (
    <Layout varient="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
            if (!values.title) {
                setErrors(toErrorMap([{field: "title" ,message: "title can not be null" }]))  //lazy now,jsut do the validtion in frontend ,this is bad...
                return ;
            }
            const result = await createPost({createPostInput:values})
            router.push("/")
            
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            ></InputField>
            <Box mt={5}>
              <InputField
                name="text"
                placeholder="text..."
                label="Text"
                textArea
              ></InputField>
            </Box>
            <Button
              mt={5}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
