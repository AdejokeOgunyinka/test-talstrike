import { Box, Flex, Text, Image } from "@chakra-ui/react";
import SearchBar from "../SearchBar";
import MoreIconThreeDots from "@/assets/svgFiles/MoreIconThreeDots.svg.next";

const NoUserSelected = () => {
  return (
    <Box w="full">
      <Flex
        w="full"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="stroke"
        h="55px"
        align="center"
        pl="17px"
        pr="12px"
      >
        <Text color="dark-blue" fontWeight="500">
          Chats
        </Text>

        <Flex h="35px" gap="28.05px" align="center">
          <SearchBar
            placeholder="Search here"
            hasRoundedCorners
            isLeftIcon
            iconColor="#93A3B1"
          />
          <MoreIconThreeDots cursor="pointer" />
        </Flex>
      </Flex>
      <Flex
        className="h-[calc(92vh-55px)]"
        bg="bg-grey-2"
        w="full"
        justify="center"
        align="center"
        direction="column"
        gap="30px"
      >
        <Image src={"./noMsg.svg"} alt="no msg" />
        <Text color="grey-1" fontSize="20px" fontWeight="500">
          {" "}
          Start a Chat{" "}
        </Text>
      </Flex>
    </Box>
  );
};

export default NoUserSelected;
