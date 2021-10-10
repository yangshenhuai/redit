import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Upvote from "../components/Upvote";
import { usePostsQuery, useDeletePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/dist/client/router";
import { useToast } from "@chakra-ui/react"


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
  const router = useRouter()

  const [, deletePost] = useDeletePostMutation();

  const toast = useToast()

  // const hasMore = false;

  if (!data && !fetching) {
    return <div> error loading posts </div>;
  }

  // if(!(data.posts) && !fetching) {
  //   return <div> no posts yet. </div>
  // }

  return (
    <Layout>
      {!data
        ? null
        : data.posts.map((p) => {
            // <Stack spacing={8} key={p.id}>

            return !p ? null : (
              <Flex p={5} mt={2} key={p.id} shadow="md" borderWidth="1px">
                <Upvote id={p.id} point={p.point} voteStatus={p.voteStatus} />
                <Box flex={1}>
                  <NextLink
                    href={{
                      pathname: "/post/[id]",
                      query: { id: p.id },
                    }}
                  >
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>post by {p.user.username}</Text>
                  <Flex>
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <IconButton
                      ml="auto"
                      onClick={async () =>  {
                        const result =  await deletePost({ postId: p.id });
                        console.info(result);
                        if(result.error) {
                          if(result.error.message.includes('not authenticated')){
                            router.replace('/')
                          } 
                          if(result.error.message.includes('not authorized')){
                            toast({
                              title: "Can't remove",
                              description: "Can't remove other user's post",
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            })
                          }
                        }
                        
                      }}
                      colorScheme="red"
                      aria-label="Remove"
                      icon={<DeleteIcon />}
                    />
                  </Flex>
                </Box>
              </Flex>
            );
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
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
