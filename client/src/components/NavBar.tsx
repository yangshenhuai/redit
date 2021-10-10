import { Box, Flex, Link } from "@chakra-ui/layout";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/button";
import { isServer } from "../utils/isServer";
import { Heading } from "@chakra-ui/react";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {

  const [{ data, fetching }] = useMeQuery({
    pause : isServer
  });
  const [{fetching: logoutFetching},logout] = useLogoutMutation()
  let body = null;

  if (!data?.me) {
    //not login
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else if (data?.me) {
    body = (
      <Flex align="center" >
       
          <NextLink href="/create-post">
          <Button ml="auto" mr={4} as={Link} >create post</Button>
        </NextLink> 

        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link" onClick={() => logout()} isLoading={logoutFetching}>logout</Button>
        
      </Flex>
    );
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="green.500" p={4} align='center'>
      <Flex flex={1} margin="auto" align="center" maxW={800}>
      <NextLink href="/">
      <Link>
      <Heading>Redit</Heading>
      </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
