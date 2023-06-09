const PollProgressBar = ({
  bgColor,
  completed,
  option,
  special,
}: {
  bgColor: string;
  completed: string;
  option: string;
  special: boolean;
}) => {
  const containerStyles = {
    height: "38px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "50px",
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    borderRadius: "inherit",
  };

  return (
    <div
      style={containerStyles}
      className="flex justify-between items-center gap-x-[10px] relative"
    >
      <div
        style={fillerStyles}
        className={`${special ? "bg-[#D7EAFB]" : bgColor}`}
      >
        <p
          className={`absolute left-[33px] top-[7px] text-[16px] text-brand-600 w-[200px] h-[30px] whitespace-nowrap overflow-hidden text-ellipsis md:w-[100%]`}
        >
          {option}
        </p>
      </div>
      <span className="text-[16px] font-semibold text-brand-2250">{`${completed}%`}</span>
    </div>
  );
};

export default PollProgressBar;
