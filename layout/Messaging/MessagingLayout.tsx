import { Box, Flex } from "@chakra-ui/react";
import MessagingSidebar from "./MessagingSidebar";
import { DashboardLayout, LayoutProps } from "../Dashboard";

const MessagingLayout = ({ children }: LayoutProps) => {
  return (
    <DashboardLayout>
      <Flex w="100%" className="h-[calc(100vh-60px)] 2xl:h-[calc(85vh-60px)]">
        <Box
          borderRight="1px solid"
          borderColor="stroke"
          w="25%"
          display={{ base: "none", lg: "inline-block" }}
        >
          <MessagingSidebar />
        </Box>
        <Box w={{ base: "100%", lg: "75%" }}>{children}</Box>
      </Flex>
    </DashboardLayout>
  );
};

export default MessagingLayout;
