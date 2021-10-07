import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";



const Index = () => {
  const [pagnationVariables,setPagnationVariables] = useState({limit:10,offset:0})
  const [{data , fetching}] = usePostsQuery({variables:{limit:pagnationVariables.limit,offset:pagnationVariables.offset}})
  
  return (
  <Layout>

    <Flex>
      <Heading>Redit</Heading>

      <NextLink href="/create-post">
        <Link ml="auto">create post</Link>
      </NextLink>
    </Flex>

  {!data ? null : data.posts.map(p =>  <Stack spacing={8} key={p.id}>
    <Box p={5} mt={2} shadow="md" borderWidth="1px" >
      <Heading fontSize="xl" >{p.title}</Heading>
      <Text mt={4}>{p.textSnippet}</Text>
    </Box>

    </Stack>
    )}

    { (data && data.posts.length == pagnationVariables.limit)? 
      <Flex>
        <Button onClick={() => {setPagnationVariables(
          {
            limit: pagnationVariables.limit,
            offset : pagnationVariables.limit + pagnationVariables.offset
          }
        )}} isLoading={fetching} m="auto" my={8}> load more </Button>
      </Flex>
     : null }

  </Layout>
  )
}
export default withUrqlClient(createUrqlClient,{ssr:true}) (Index)
