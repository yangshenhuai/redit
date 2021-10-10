import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import Layout from "../../components/Layout";
import { usePostQuery, usePostsQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";

const Post = ({}) => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { postId: postId },
  });

  if (fetching) {
    return (
      <Layout>
        <div>loading ... </div>
      </Layout>
    );
  }

  if (!data.post) {
    return (
      <Layout>
        <div> 404 - post not found </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4} > {data.post.title} </Heading>
      <div> {data.post.text} </div>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
