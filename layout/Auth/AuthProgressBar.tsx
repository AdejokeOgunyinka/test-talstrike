type AuthProgressBarType = {
  progress: number;
};
const AuthProgressBar = ({ progress }: AuthProgressBarType) => {
  return (
    <div className="h-[4px] bg-[rgba(229, 229, 229, 0.66)] border rounded-md">
      <div
        className={`h-full w-${
          progress === 50 ? '1/2' : progress === 75 ? '3/4' : progress === 100 ? 'full' : '0'
        } bg-${progress === 0 ? 'bg-[rgba(229, 229, 229, 0.66)]' : 'brand-600'}`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default AuthProgressBar;
