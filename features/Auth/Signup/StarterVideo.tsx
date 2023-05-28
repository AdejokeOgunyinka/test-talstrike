import { useRouter } from "next/router";
import { useEffect } from "react";

/* eslint-disable @next/next/no-html-link-for-pages */
const StarterVideo = () => {
  const router = useRouter();

  useEffect(() => {
    const video = document.querySelector("video");

    video?.addEventListener("ended", (event) => {
      router.push("/auth/login");
    });
  });

  return (
    <div className="relative w-full h-screen flex justify-center">
      <div
        className="w-full h-full object-cover"
        dangerouslySetInnerHTML={{
          __html: `
        <video
          id="talstrikeVideo"
          muted
          autoplay
          playsinline
          src="/talstrikeSportVideo.mp4"
          class="w-full h-full object-cover"
        />,
      `,
        }}
      ></div>

      <div className="absolute right-[20px] top-[20px] text-[#fff] font-semibold">
        <a href="/auth/login">{"Skip >>"}</a>
      </div>
    </div>
  );
};

export default StarterVideo;
