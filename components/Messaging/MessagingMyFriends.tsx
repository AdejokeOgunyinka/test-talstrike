import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import ChevronDownIcon from "@/assets/svgFiles/ChevronDown.svg.next";
import { PersonSearchResultComponent } from "@/features/GeneralAppSearch";
import { useGetMyFollowers } from "@/api/dashboard";
import SearchBar from "../SearchBar";

const MessagingMyFriends = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const [friendFilter, setFriendFilter] = useState("All");
  const { data: MyFriends } = useGetMyFollowers({
    token: TOKEN as string,
    id: USER_ID as string,
  });

  return (
    <Box w="full">
      <Flex
        w="full"
        p="14px 0px 13px 0px"
        justify="center"
        align="center"
        borderBottom="1px solid"
        borderColor="stroke"
        fontSize="16px"
        fontWeight="500"
        color="grey-1"
      >
        My Friends
      </Flex>

      <Flex
        p="16px 19px 14px 22px"
        borderBottom="1px solid"
        borderColor="stroke"
        justify="space-between"
      >
        <Menu>
          <MenuButton>
            <Flex
              align="center"
              border="1px solid"
              borderColor="stroke"
              padding="9px 13px 8px 13px"
              borderRadius="4px"
              width="120px"
              justify="space-between"
              color="dark-blue"
            >
              {friendFilter}
              <ChevronDownIcon />
            </Flex>
          </MenuButton>
          <MenuList
            border="none"
            boxShadow="0px 5px 4px 0px rgba(0, 0, 0, 0.06)"
            padding="15px 61px 17px 17px"
            color="dark-blue"
            fontSize="13px"
            fontWeight="500"
            mt="5px"
          >
            <MenuItem onClick={() => setFriendFilter("All")}>All</MenuItem>
            <MenuItem onClick={() => setFriendFilter("Online")}>
              Online
            </MenuItem>
          </MenuList>
        </Menu>

        <Box w="226px">
          <SearchBar
            placeholder="Find Friends"
            isLeftIcon
            hasRoundedCorners
            bgColor="bg-[#F5F5F5]"
            iconColor="#93A3B1"
          />
        </Box>
      </Flex>

      <Flex
        p="22px 20px"
        w="100%"
        flexWrap="wrap"
        gap="14px"
        h="68vh"
        overflowY="scroll"
      >
        {MyFriends?.results?.map((friend: any, index: number) => (
          <Box key={index} w={{ base: "100%", md: "48%" }}>
            <PersonSearchResultComponent
              firstname={friend?.users?.firstname}
              lastname={friend?.users?.lastname}
              userId={friend?.users?.id}
              img={friend?.users?.image}
              roles={friend?.users?.roles}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default MessagingMyFriends;
