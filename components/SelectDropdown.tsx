import { ChangeEventHandler } from 'react';

type CustomSelectDropdownType = {
  options: string[];
  label: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

const CustomSelectDropdown = ({ options, label, onChange }: CustomSelectDropdownType) => {
  return (
    <div className="relative w-full h-[40px] rounded-[7px] border border-brand-50 pl-[5px] pr-[5px]">
      <label className="absolute -top-[8px] ml-[8px] z-10 pl-[6px] pr-[12px] bg-brand-500 z-10 font-light text-[11px]">
        {label}
      </label>
      <select
        onChange={onChange}
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

export default CustomSelectDropdown;
