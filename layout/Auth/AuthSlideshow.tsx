import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import SlideShowImg1 from "@/assets/AuthLayoutImage1.png";
import SlideShowImg2 from "@/assets/AuthLayoutImage2.png";
import SlideShowImg3 from "@/assets/AuthLayoutImage4.png";

const AuthSlideShow = () => {
  const slideshowImages = [SlideShowImg1, SlideShowImg2, SlideShowImg3];
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
        setActiveIndex((prevIndex) =>
          prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [activeIndex, slideshowImages.length]);

  return (
    <div className="relative w-full h-full m-[0 auto] overflow-hidden max-width-full">
      <div
        className="whitespace-nowrap transition ease-in-out delay-100 duration-1000 h-full"
        style={{ transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }}
      >
        {slideshowImages.map((img, index) => (
          <NextImage
            key={index}
            src={img}
            alt="slideshow image"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
            className="slideshow-img"
          />
        ))}
      </div>
      <div className="mx-auto absolute bottom-2 w-full flex justify-center">
        {slideshowImages.map((_, index) => (
          <div
            key={index}
            className={`inline-block h-5 w-5 rounded-[50%] cursor-pointer mt-[15px] mr-[7px] ml-[7px] mb-[0px] bg-brand-50 ${
              activeIndex === index ? "bg-orange-600" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AuthSlideShow;
