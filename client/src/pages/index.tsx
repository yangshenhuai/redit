import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Upvote from "../components/Upvote";

const Index = () => {
  const [pagnationVariables, setPagnationVariables] = useState({
    limit: 10,
    offset: 0,
  });
  const [previousPostCount, setPreviousPostCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: pagnationVariables.limit,
      offset: pagnationVariables.offset,
    },
  });
  // const hasMore = false;

  if (!data && !fetching) {
    return <div> error loading posts </div>;
  }

  // if(!(data.posts) && !fetching) {
  //   return <div> no posts yet. </div>
  // }

  return (
    <Layout>
      <Flex>
        <Heading>Redit</Heading>

        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>

      {!data
        ? null
        : data.posts.map((p) => {
            // <Stack spacing={8} key={p.id}>

            return <Flex p={5} mt={2} key={p.id} shadow="md" borderWidth="1px">
              <Upvote id={p.id} point={p.point} voteStatus={p.voteStatus} />
              <Box>
                <Heading fontSize="xl">{p.title}</Heading>
                <Text>post by {p.user.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
            
          })}

      {data && hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setPagnationVariables({
                limit: pagnationVariables.limit,
                offset: pagnationVariables.limit + pagnationVariables.offset,
              });
              if (data.posts.length == previousPostCount) {
                setHasMore(false);
              } else {
                setHasMore(true);
                setPreviousPostCount(
                  data.posts.length
                ); /** better way to do this is return the whole count from backend,this is a little shitty now */
              }
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            {" "}
            load more{" "}
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
