import Select, { components } from "react-select";
import NextImage from "next/image";

const Dropdown = ({
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
          src={"/chevronDownBlue.svg"}
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
        <p className="text-[#293137] text-[18px] leading-[21px] mb-[13px]">
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

export const Inputbox = ({
  placeholder,
  type,
  name,
  value,
  onChange,
}: {
  placeholder: string;
  name: string;
  type: string;
  value: string;
  onChange?: any;
}) => {
  return (
    <input
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      className="w-full h-[44px] border-[1.5px] border-brand-600 inputbox-new"
      onChange={onChange}
    />
  );
};

export default Dropdown;
