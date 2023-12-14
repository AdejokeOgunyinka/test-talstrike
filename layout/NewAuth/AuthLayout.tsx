/* eslint-disable @next/next/no-img-element */

type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="w-full h-screen lg:flex lg:justify-center">
      <div className="w-full h-screen flex">
        <div className="basis-2/5 h-full w-full hidden lg:inline-block">
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
        <div className="basis-full overflow-y-scroll flex lg:inline-block justify-center lg:justify-start lg:basis-3/5 h-full w-full bg-brand-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
