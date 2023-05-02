/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

// type LandingPageLayoutProps = {
//   children?: React.ReactNode;
// };

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
    <div className="w-full h-screen flex justify-center">
      <div className="w-full 2xl:w-[70vw] relative h-screen 2xl:h-[85vh] flex 2xl:mx-auto 2xl:my-auto 2xl:rounded-[29px] overflow-hidden">
        <div className="absolute top-[134px] w-full flex justify-center z-[999]">
          <NextImage
            src="/white-logo.svg"
            alt="white logo"
            width="231"
            height="90"
          />
        </div>
        <div
          className="whitespace-nowrap transition ease-in-out delay-100 duration-1000 w-full h-full"
          style={{ transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }}
        >
          {slideShowImages.map((val, index) => (
            <div key={index} className="slideshow-img w-full h-full">
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
            </div>
          ))}
        </div>
        <div className="absolute top-0 w-full px-[20px] lg:px-unset h-full flex flex-col justify-center items-center">
          <h4 className="text-brand-500 text-[20px] lg:text-[36px] font-semibold mb-[24px] leading-[54px]">
            {slideShowImages[activeIndex].sloganHeader}
          </h4>
          <p className="text-brand-500 text-[14px] break-words lg:text-[20px] font-medium leading-[166%]">
            {slideShowImages[activeIndex].sloganText}
          </p>
        </div>
        <div className="absolute bottom-[150px] w-full flex flex-col items-center z-[999]">
          <div className="w-full flex justify-center gap-[13px]">
            <a href="/login">
              <button className="w-[141px] h-[40px] text-brand-500 text-[14px] border-[1.5px] border-brand-500 rounded-[4px] ">
                Login
              </button>
            </a>
            <a href="/signup">
              <button className="w-[141px] h-[40px] text-brand-500 text-[14px] rounded-[4px] bg-brand-600">
                Get Started
              </button>
            </a>
          </div>
          <p className="mt-[30px] text-brand-500 text-[12px] md:text-[14px]">
            © {new Date().getFullYear()} Talstrike Technologies. All Rights
            Reserved.
          </p>
        </div>
        <div className="mx-auto absolute bottom-2 w-full flex justify-center">
          {slideShowImages.map((_, index) => (
            <div
              key={index}
              className={`inline-block h-5 w-5 border-[1.3px] rounded-[50%] cursor-pointer mt-[15px] mr-[7px] ml-[7px] mb-[0px] ${
                activeIndex === index
                  ? "bg-brand-1100  border-brand-1100"
                  : "border-brand-500 bg-unset"
              }`}
              onClick={() => setActiveIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPageLayout;
