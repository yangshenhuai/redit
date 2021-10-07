import { NavBar } from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import React from "react";
import { Box, Heading, Stack ,Text  } from "@chakra-ui/react";


const Index = () => {
  const [{data}] = usePostsQuery({variables:{limit:10,offset:0}})
  return (
  <>
  <NavBar/>
  {!data ? null : data.posts.map(p =>  <Stack spacing={8}>
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{p.title}</Heading>
      <Text mt={4}>{p.textSnippet}</Text>
    </Box>

    </Stack>
    )}
  </>
  )
}
export default withUrqlClient(createUrqlClient,{ssr:true}) (Index)
