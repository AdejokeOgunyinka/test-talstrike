import { ChangeEventHandler } from "react";

type CustomSelectDropdownType = {
  options: string[];
  label: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onBlur?: ChangeEventHandler<HTMLSelectElement>;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
};

const CustomSelectDropdown = ({
  options,
  label,
  onChange,
  id,
  name,
  onBlur,
}: CustomSelectDropdownType) => {
  return (
    <div className="relative w-full h-[40px] rounded-[7px] border border-brand-50 pl-[5px] pr-[5px]">
      <label className="absolute -top-[8px] ml-[8px] z-10 pl-[6px] pr-[12px] bg-brand-500 z-10 font-light text-[11px]">
        {label}
      </label>
      <select
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full h-full border-0 bg-inherit placeholder:text-[11px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
      >
        {options.map((value, index: number) => (
          <option
            className="text-[11px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
            key={index}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export const AchievementSelectDropdown = ({
  options,
  label,
  onChange,
  id,
  name,
  onBlur,
  placeholder,
  value,
}: CustomSelectDropdownType) => {
  return (
    <div className="w-full">
      <label className="text-brand-200 font-medium text-[18px] leading-[162%]">
        {label}
      </label>
      <select
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        className="w-[100%] mt-[11px] h-[46px] rounded-[4px] border-2 border-brand-2850 pl-[10px] text-[16px] placeholder:text-brand-200 placeholder:text-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
      >
        {options.map((value, index: number) => (
          <option
            className="text-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
            key={index}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelectDropdown;
