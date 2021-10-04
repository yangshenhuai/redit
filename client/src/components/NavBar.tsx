import { Box, Flex, Link } from "@chakra-ui/layout";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/button";
import { isServer } from "../utils/isServer";

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
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link" onClick={() => logout()} isLoading={logoutFetching}>logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg="green.500" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
