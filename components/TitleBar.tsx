import { Text, Box } from "@chakra-ui/react";

const TitleBar = ({
  titleBarColor,
  text,
  header,
}: {
  titleBarColor: string;
  text: string;
  header?: string;
}) => {
  return (
    <Box
      width="full"
      height="119px"
      borderRadius="6px"
      paddingTop={{ base: "14px", lg: "18px" }}
      paddingLeft="37px"
      className={`${titleBarColor}`}
    >
      <Text fontSize="20px" fontWeight="500" mb="2px" color="text">
        {header}
      </Text>
      <Text fontSize={{ base: "13px", xl: "16px" }} color="text">
        {text}
      </Text>
    </Box>
  );
};

export default TitleBar;
