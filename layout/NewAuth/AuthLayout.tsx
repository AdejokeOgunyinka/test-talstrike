/* eslint-disable @next/next/no-img-element */

type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="w-full h-screen lg:flex lg:justify-center">
      <div className="w-full 2xl:w-[70vw] h-[unset] md:h-screen 2xl:h-[85vh] flex 2xl: mx-auto 2xl: my-auto 2xl:rounded-[29px] 2xl:overflow-hidden">
        <div className="basis-2/5 h-full w-full hidden lg:inline-block">
          {/* <img src={"/bg.png"} alt="bg" className="w-full h-full" /> */}
          <div
            className="w-full h-full object-cover"
            dangerouslySetInnerHTML={{
              __html: `
        <video
          id="talstrikeVideo"
          muted
          loop
          autoplay
          playsinline
          src="/talstrikeSportVideo.mp4"
          class="w-full h-full object-cover"
        />,
      `,
            }}
          ></div>
        </div>
        <div className="basis-full flex lg:inline-block justify-center lg:justify-start lg:basis-3/5 h-full w-full bg-brand-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
