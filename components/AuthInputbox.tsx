type CustomInputBoxProps = {
  icon?: React.ReactNode;
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  autocomplete?: string;
};

const CustomInputBox = ({
  icon,
  label,
  placeholder,
  type,
  name,
  onChange,
  onBlur,
  autocomplete,
}: CustomInputBoxProps) => {
  return (
    <div
      className={
        type === "checkbox"
          ? "w-full flex"
          : "relative w-full rounded-[4px] border-[#293137] border-[1px] pl-[13px] pt-[8.2px] pb-[8.2px]"
      }
    >
      {/* {type !== "checkbox" && (
        <label className="absolute -top-[8px] bg-brand-500 font-light ml-[8px] z-10 pl-[6px] pr-[12px] text-[11px]">
          {label}
        </label>
      )} */}
      <div className={type === "checkbox" ? "flex items-center" : "flex"}>
        {type !== "checkbox" ? (
          <input
            placeholder={placeholder}
            type={type}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full h-[50px] py-0 border-none text-[16px] placeholder:text-[18px] placeholder:font-light placeholder:text-[#93A3B1] placeholder: leading-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0 bg:unset"
          />
        ) : (
          <input
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            className="focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0 checked:outline-0"
            autoComplete={autocomplete}
          />
        )}

        {type !== "checkbox" && <div className="pr-[12px]">{icon}</div>}
        {type === "checkbox" && (
          <label className="ml-[7px] font-light text-[11px] leading-[16px]">
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

export default CustomInputBox;
