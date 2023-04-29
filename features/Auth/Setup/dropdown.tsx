import { ChangeEventHandler } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface ISetupDropdown {
  options: string[];
  label?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onBlur?: ChangeEventHandler<HTMLSelectElement>;
  placeholder: string;
  blueBg?: boolean;
  id?: string;
  classname?: string;
  value?: string;
  isLoading?: boolean;
}

const SetupDropdown = ({
  options,
  label,
  onChange,
  onBlur,
  placeholder,
  blueBg,
  id,
  classname,
  value,
  isLoading,
}: ISetupDropdown) => {
  return (
    <div
      className={`relative w-full h-[46px] rounded-[4px] border-2 border-brand-1850 pl-[16px] pr-[20px] ${
        blueBg && 'bg-brand-600'
      } ${classname}`}
    >
      <label className="absolute -top-[30px] left-0 z-10 text-brand-1900 font-light text-[14px]">
        {label}
      </label>
      <select
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full h-full border-0 bg-inherit placeholder:text-[14px] ${
          blueBg ? 'placeholder:text-brand-500' : 'placeholder:text-brand-1800'
        } ${
          blueBg ? 'text-brand-500' : 'text-brand-1800'
        } focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0`}
        placeholder={placeholder}
        id={id}
        value={value}
      >
        {isLoading ? (
          <BeatLoader color={'white'} size={10} aria-label="Loading Spinner" data-testid="loader" />
        ) : (
          options?.map((value, index: number) => (
            <option
              className="text-[11px] text-brand-1800 focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
              key={index}
            >
              {value}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default SetupDropdown;
