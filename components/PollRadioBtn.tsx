const PollRadioBtn = ({
  name,
  value,
  selected,
  setSelected,
}: {
  name: string;
  value: any;
  selected: any;
  setSelected: any;
}) => {
  return (
    <div
      className={`w-[100%] h-[38px] flex justify-center items-center ${
        selected === value ? "bg-brand-600" : "bg-brand-500"
      } border border-[1.5px] border-brand-600 rounded-[50px] relative`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        onChange={(e) => {
          setSelected(e?.target?.value);
        }}
        className={`absolute left-[16px] top-[10px] border ${
          selected === value ? "border-brand-500" : "border-brand-600"
        } w-[18px] h-[18px]`}
        checked={selected === value}
      />
      <p
        className={`${
          selected === value ? "text-brand-500" : "text-brand-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default PollRadioBtn;
