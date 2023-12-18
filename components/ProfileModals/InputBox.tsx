import Select, { components } from "react-select";
import NextImage from "next/image";

const InputBox = ({
  onChange,
  onBlur,
  value,
  title,
  id,
  placeholder,
  disabled,
  className,
  type,
  accept,
  name,
}: {
  onChange?: any;
  onBlur?: any;
  value?: any;
  title?: string;
  id: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  accept?: any;
  name?: string;
}) => {
  return (
    <div className="w-[100%]">
      {title && (
        <label className="text-brand-3000 font-medium text-[18px] leading-[162%]">
          {title}
        </label>
      )}
      <input
        placeholder={placeholder}
        type={type}
        className={`${className} w-[100%] mt-[11px] h-[46px] rounded-[4px] border-2 border-brand-2850 pl-[10px] placeholder:text-brand-200 placeholder:text-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0`}
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
        accept={accept}
        name={name}
      />
    </div>
  );
};

export const TextBox = ({
  onChange,
  onBlur,
  value,
  title,
  id,
  placeholder,
  withoutBorder,
  className,
}: {
  onChange?: any;
  onBlur?: any;
  value?: string;
  title?: string;
  id: string;
  placeholder: string;
  withoutBorder?: boolean;
  className?: string;
}) => {
  return (
    <div className="w-[100%]">
      {title && (
        <label className="text-brand-3000 font-medium text-[18px] leading-[162%]">
          {title}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        className={`w-[100%] mt-[11px] h-[121px] rounded-[4px] ${
          withoutBorder ? "border-none" : "border-2 border-brand-2850"
        } p-[25px] placeholder:text-[#93A3B1] placeholder:text-[18px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0 ${className}`}
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  );
};

export const Dropdown = ({
  options,
  title,
  className,
  placeholder,
  onChange,
  id,
  name,
  value,
}: {
  options: { value: string; label: string }[];
  title?: string;
  className?: string;
  placeholder?: string;
  onChange?: any;
  id?: string;
  name: string;
  value?: { value: string; label: string };
}) => {
  const { Option } = components;

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <NextImage
          src={"/chevron-down.svg"}
          alt="icon-down"
          width="20"
          height="20"
        />
      </components.DropdownIndicator>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <p className="text-brand-3000 font-medium text-[18px] leading-[162%]">
          {title}
        </p>
      )}
      <Select
        id={id}
        options={options}
        className={className}
        placeholder={placeholder}
        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
        onChange={onChange}
        name={name}
        value={value?.label !== "" && value}
      />
    </div>
  );
};

export default InputBox;
