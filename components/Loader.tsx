import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const PageLoader = () => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "orange",
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ClipLoader
        color={"#fff"}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default PageLoader;
