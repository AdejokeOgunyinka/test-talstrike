import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text, Button, Link } from "@chakra-ui/react";

const LandingPageLayout = () => {
  const slideShowImages = [
    {
      image: "/young-man-landing-page.png",
      sloganHeader: "Track your Workouts and Progress",
      sloganText:
        "Use our advanced tracking features to monitor your performance and see how far you've come.",
    },
    {
      image: "/team-celebrating-landing-page.png",
      sloganHeader: "Connect with other Athletes",
      sloganText:
        "Meet like-minded individuals, share tips and advice, and get motivated by others' success stories.",
    },
    {
      image: "/electronic-sports-landing-page.png",
      sloganHeader: "Join Virtual Competitions",
      sloganText:
        " Challenge yourself and others to virtual competitions and see how you stack up against the competition.",
    },
    {
      image: "/trainer-chatting-landing-page.png",
      sloganHeader: " Get Personalized Coaching",
      sloganText:
        "Work with a personal coach to help you achieve your goals and take your game to the next level.",
    },
    {
      image: "/charming-man-landing-page.png",
      sloganHeader: "Discover New Sports",
      sloganText:
        "Explore new sports and find your next passion with our app's extensive library of sports and activities.",
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
    <Flex w="full" h="100vh" justify="center">
      <Box
        w={{ base: "full", "2xl": "85vw" }}
        h={{ base: "full", "2xl": "85vh" }}
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
          h="full"
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
          top={{ base: "157px", xl: "182px" }}
          w="full"
          px={{ base: "29px", lg: "unset" }}
          h="full"
          direction="column"
        >
          <Text
            color="primary-white-3"
            textAlign="center"
            fontSize="36px"
            fontWeight="600"
            lineHeight="normal"
            mb={{ base: "30px", md: "24px" }}
          >
            {slideShowImages[activeIndex].sloganHeader}
          </Text>

          <Text
            color="primary-white-3"
            textAlign="center"
            wordBreak="break-word"
            fontWeight="500"
            lineHeight="166%"
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
                  fontSize="14px"
                  fontWeight="500"
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
                  fontSize="14px"
                  fontWeight="500"
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
        </Flex>
        <Flex
          mx="auto"
          position="absolute"
          bottom={{ base: "50px", md: "85px" }}
          w="full"
          justify="center"
        >
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
      </Box>
    </Flex>
  );
};

export default LandingPageLayout;
