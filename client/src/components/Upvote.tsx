import { ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useUpvoteMutation } from "../generated/graphql";

interface UpvoteProps {
  id: number;
  point: number;
  voteStatus: string
}

const Upvote: React.FC<UpvoteProps> = ({ id, point , voteStatus }: UpvoteProps) => {
  console.info("id " + id + " , and point is " +  point  + " and voteStatus is " + voteStatus)
  const [{fetching}, upvote] = useUpvoteMutation();
  const router = useRouter()
  return (
    <Flex mr={4} direction="column" justifyContent="center" alignItems="center">
      <IconButton
        isLoading={fetching}
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        colorScheme={voteStatus == "1" ?  "teal" : undefined }
        onClick={ async () => {
          if(voteStatus != "1") {
            const response = await upvote({ upvotePostId: id });
            if(response.error && response.error.message.includes("not authenticated")){
              router.replace({pathname: "/login", query:{from:'upvote'}})
            }
            
          } 
        }}
      ></IconButton>
      {point}

    </Flex>
  );
};

export default Upvote;
