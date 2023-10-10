import CircleIcon from "@/assets/svgFiles/Circle.svg.next";
import { handleOnError } from "@/libs/utils";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const PeopleComponent = ({
  img,
  id,
  name,
  withoutName,
  status,
}: {
  img: string;
  id: string;
  name?: string;
  withoutName?: boolean;
  status?: string;
}) => {
  const router = useRouter();
  const handleClickUser = ({ id }: { id: string }) => {
    router.push(`/profile/${id}`);
  };

  return (
    <Flex justify="center" align="center" direction="column">
      <Flex
        w="40.558px"
        h="40px"
        pos="relative"
        border="2px solid"
        borderColor="primary-white-3"
        borderRadius="100px"
        boxShadow="4px 2px 4px -1px rgba(0, 0, 0, 0.10)"
        onClick={() => handleClickUser({ id: id })}
      >
        <Image
          src={img}
          alt="p"
          w="full"
          h="full"
          onError={handleOnError}
          borderRadius="100%"
        />
        <Box pos="absolute" bottom="-3px" right="2px">
          <CircleIcon fill={status === "offline" ? "#93A3B1" : "#00B127"} />
        </Box>
      </Flex>
      {!withoutName && (
        <Text fontSize="9px" fontWeight="500" color="text" mt="5px">
          {name}
        </Text>
      )}
    </Flex>
  );
};

export default PeopleComponent;
