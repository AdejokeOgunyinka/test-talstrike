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
    height: '38px',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '50px',
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    borderRadius: 'inherit',
  };

  return (
    <div style={containerStyles} className="flex justify-between relative">
      <div style={fillerStyles} className={`${special ? 'bg-brand-1750' : bgColor}`}>
        <p
          className={`absolute left-[33px] top-[7px] text-[16px] ${
            special ? 'text-brand-100' : 'text-brand-2250'
          }`}
        >
          {option}
        </p>
      </div>
      <span className="text-[16px] font-semibold text-brand-2250">{`${completed}%`}</span>
    </div>
  );
};

export default PollProgressBar;
