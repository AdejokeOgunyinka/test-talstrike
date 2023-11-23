import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";

type CustomSelectDropdownType = {
  filterOptions: string[];
  label: string;
  placeholder: string;
  chosenFilterOptions?: string[];
  setChosenFilterOptions?: Dispatch<SetStateAction<string[]>>;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

const DashboardFilterDropdown = ({
  filterOptions,
  chosenFilterOptions,
  setChosenFilterOptions,
  label,
  placeholder,
  onChange,
}: CustomSelectDropdownType) => {
  // const saveOptionToChosenOptionList = (option: string) => {
  //   let optionExists = false;
  //   chosenFilterOptions?.find(val => {
  //     if (val === option) {
  //       optionExists = true;
  //     }
  //   });

  //   if (optionExists) {
  //     const a = [...chosenFilterOptions];
  //     const b = a.filter(val => val !== option);
  //     setChosenFilterOptions(b);
  //   } else {
  //     const a = [...chosenFilterOptions];
  //     a.push(option);
  //     setChosenFilterOptions(a);
  //   }
  // };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="w-full h-full border-r border-brand-greyish">
      <label className="text-brand-greyish font-medium text-[13px] xl:text-[15px] leading-[15px]">
        {label}
      </label>
      <div className="relative h-[40%]">
        {/* <div className="flex justify-between items-center pr-[13px] h-full">
          <p className="font-semibold text-[8px] lg:text-[11px] leading-[11px] xl:leading-[16px]">
            {placeholder}
          </p>
          <p
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-[20px] rotate-90 text-brand-1350 font-medium leading-[30px] cursor-pointer"
          >
            {' '}
            {'>'}{' '}
          </p>
        </div>
        {showDropdown && (
          <fieldset className="absolute z-10 flex gap-y-[13px] flex-col left-0 top-[24px] w-[167px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px] bg-brand-300 py-[14px] px-[18px]">
            {filterOptions.map((value, index) => (
              <label
                htmlFor={value}
                className="flex items-center text-[11px] font-semibold leading-[16px] text-brand-1350"
              >
                <input
                  type="checkbox"
                  name="filterOption"
                  key={index}
                  value={value}
                  onChange={e => saveOptionToChosenOptionList(e?.currentTarget?.value)}
                  className="mr-[15px] rounded-[4px]"
                />
                {value}
              </label>
            ))}
          </fieldset>
        )} */}
        <select
          placeholder={placeholder}
          className="h-[40px] w-[70%] text-[12px]"
          onChange={onChange}
        >
          {filterOptions?.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DashboardFilterDropdown;
