import { useRouter } from "next/router";

/* eslint-disable @next/next/no-html-link-for-pages */
const StarterVideo = () => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen flex justify-center">
      <video
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        src={"/talstrikeSportVideo.mp4"}
        onEnded={() => router.push("/auth/login")}
      />

      <div className="absolute right-[20px] top-[20px] text-[#fff] font-semibold">
        <a href="/auth/login">{"Skip >>"}</a>
      </div>
    </div>
  );
};

export default StarterVideo;
