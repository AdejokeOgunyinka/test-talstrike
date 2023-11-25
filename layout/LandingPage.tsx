import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text, Button, Link } from "@chakra-ui/react";

const LandingPageLayout = () => {
  const slideShowImages = [
    {
      image: "/young-man-landing-page.png",
      sloganHeader: "Every athlete deserves their moment in the Spotlight.",
      sloganText:
        "Begin showcasing your skills today. The world eagerly awaits your performance.",
    },
    {
      image: "/team-celebrating-landing-page.png",
      sloganHeader:
        "Put Your Talents on Display: Record and Share Your Sports Videos.",
      sloganText:
        "Share Your Training Videos to Demonstrate Your Skills and Dedication to the Game. You Never Know Who's Watching.",
    },
    {
      image: "/electronic-sports-landing-page.png",
      sloganHeader: "Grow Your Sports Network and Connections.",
      sloganText:
        "Enhance Your Sports Journey and Career: Network with Coaches, Trainers, Agents, and Proven Athletes in Your Sport",
    },
    {
      image: "/trainer-chatting-landing-page.png",
      sloganHeader: "Participate in and Host Sports Competitions",
      sloganText:
        "Embrace the Excitement of Thrilling Contests: Organize and Participate in Competitions Within Your Field. There's Never a Dull Moment Here!",
    },
    {
      image: "/charming-man-landing-page.png",
      sloganHeader: "The Ultimate Social App for Athletes",
      sloganText:
        "Share Your Experiences, Join Trends, Connect with Fellow Athletes Worldwide, and Expand Your Network.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const delay = 6000;

  const timeoutRef = useRef<any>(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setActiveIndex((prevIndex: number) =>
          prevIndex === slideShowImages.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [activeIndex, slideShowImages.length]);
  return (
    <Flex
      w="full"
      minH="100vh"
      justify="center"
      bg="linear-gradient(180deg, rgba(0, 0, 0, 0.00) 13.86%, rgba(0, 0, 0, 0.90) 79.09%), url(<path-to-image>), lightgray 50% / cover no-repeat"
    >
      <Box
        w={{ base: "full", "2xl": "85vw" }}
        minH={{ base: "full", "2xl": "85vh" }}
        mx={{ "2xl": "auto" }}
        my={{ "2xl": "auto" }}
        borderRadius={{ "2xl": "29px" }}
        overflow="hidden"
      >
        <Flex
          justify="center"
          zIndex="999"
          position="absolute"
          top={{ base: "58px", xl: "144px" }}
          w="full"
        >
          <Image
            src="/white-logo.svg"
            alt="white logo"
            width={{ base: "171px", md: "281px" }}
            height={{ base: "67px", md: "90px" }}
          />
        </Flex>

        <Box
          whiteSpace="nowrap"
          transition="ease-in-out"
          transitionDelay="100ms"
          transitionDuration="1000ms"
          w="full"
          h="100vh"
          style={{ transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }}
        >
          {slideShowImages.map((val, index) => (
            <Box key={index} w="full" h="full" className="slideshow-img">
              <div
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                  background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 5.77%, rgba(0, 0, 0, 0.25) 27.88%, #000000 85.1%), url(${val?.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-full h-full"
              />
            </Box>
          ))}
        </Box>

        <Flex
          position="absolute"
          top={{ base: "157px", xl: "299px" }}
          w="full"
          align="center"
          px={{ base: "29px", lg: "unset" }}
          direction="column"
        >
          <Text
            color="primary-white-3"
            textAlign="center"
            fontSize="40px"
            fontWeight="600"
            lineHeight="normal"
            mb={{ base: "31px", md: "25px" }}
          >
            {slideShowImages[activeIndex].sloganHeader}
          </Text>

          <Text
            color="primary-white-3"
            textAlign="center"
            wordBreak="break-word"
            width="70%"
            fontWeight="400"
            lineHeight="166%"
            fontSize={{ base: "18px", md: "20px" }}
          >
            {slideShowImages[activeIndex].sloganText}
          </Text>

          <Flex mt="60px" direction="column" align="center" w="full">
            <Flex justify="center" gap="13px" w="full">
              <Link href="/auth/login">
                <Button
                  w="141px"
                  h="40px"
                  color="primary-white-3"
                  fontSize="18px"
                  fontWeight="400"
                  border="1.5px solid #fff"
                  bg="transparent"
                  borderRadius="4px"
                >
                  Login
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button
                  w="141px"
                  h="40px"
                  color="primary-white-3"
                  fontSize="18px"
                  fontWeight="400"
                  bg="light-blue"
                  borderRadius="4px"
                >
                  Get Started
                </Button>
              </Link>
            </Flex>

            {/* <Text
              mt="30px"
              color="primary-white-3"
              fontSize={{ base: "12px", md: "14px" }}
            >
              © {new Date().getFullYear()} Talstrike Technologies. All Rights
              Reserved.
            </Text> */}
          </Flex>

          <Flex mt={{ base: "50px", md: "85px" }} w="full" justify="center">
            {slideShowImages.map((_, index) => (
              <div
                key={index}
                className={`inline-block h-[12.23px] w-[12.23px] border-[1.3px] rounded-[50%] cursor-pointer mt-[15px] mr-[7px] ml-[7px] mb-[0px] ${
                  activeIndex === index
                    ? "bg-brand-1100  border-brand-1100"
                    : "border-brand-500 bg-unset"
                }`}
                onClick={() => setActiveIndex(index)}
              ></div>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LandingPageLayout;
