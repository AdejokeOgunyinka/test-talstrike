const TitleBar = ({
  titleBarColor,
  text,
}: {
  titleBarColor: string;
  text: string;
}) => {
  return (
    <div
      className={`w-full h-[81px] rounded-[6px] pt-[23px] pl-[37px] ${titleBarColor}`}
    >
      <p className="text-brand-50 text-[11px]">{text}</p>
    </div>
  );
};

export default TitleBar;
