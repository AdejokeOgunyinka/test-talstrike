const InputBox = ({
  onChange,
  onBlur,
  value,
  title,
  id,
  placeholder,
  disabled,
}: {
  onChange: any;
  onBlur: any;
  value: any;
  title: string;
  id: string;
  placeholder: string;
  disabled: boolean;
}) => {
  return (
    <div className="w-[100%]">
      <label className="text-brand-200 font-medium text-[18px] leading-[162%]">
        {title}
      </label>
      <input
        placeholder={placeholder}
        className="w-[100%] mt-[11px] h-[46px] rounded-[4px] border-2 border-brand-2850 pl-[10px] placeholder:text-brand-200 placeholder:text-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0"
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
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
}: {
  onChange: any;
  onBlur: any;
  value: string;
  title: string;
  id: string;
  placeholder: string;
  withoutBorder?: boolean;
}) => {
  return (
    <div className="w-[100%]">
      <label className="text-brand-200 font-medium text-[18px] leading-[162%]">
        {title}
      </label>
      <textarea
        placeholder={placeholder}
        className={`w-[100%] mt-[11px] h-[121px] rounded-[4px] ${
          withoutBorder ? "border-none" : "border-2 border-brand-2850"
        } p-[25px] placeholder:text-brand-200 placeholder:text-[16px] focus:outline-0 focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0`}
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  );
};

export default InputBox;
