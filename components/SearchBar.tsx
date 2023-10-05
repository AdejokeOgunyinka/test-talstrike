import NextImage from "next/image";
import SearchIcon from "@/assets/SearchIcon.svg.next";

interface ISearchBar {
  placeholder: string;
  onChange?: any;
  differentOnChange?: any;
  isLight?: boolean;
  isLeftIcon?: boolean;
  hasRoundedCorners?: boolean;
}

const SearchBar = ({
  placeholder,
  onChange,
  isLight,
  isLeftIcon,
  hasRoundedCorners,
  differentOnChange,
}: ISearchBar) => {
  return (
    <div
      className={`w-[100%] h-[100%] border-[1px] ${
        hasRoundedCorners ? "rounded-[80px]" : "rounded-[4px]"
      } border-brand-300 flex items-center px-[16px]`}
    >
      {!isLeftIcon && <SearchIcon fill={isLight ? "#fff" : "#131316"} />}
      <input
        placeholder={placeholder}
        onChange={
          differentOnChange
            ? differentOnChange
            : (e) => {
                let val = e?.target?.value;
                onChange && onChange(val);
              }
        }
        className="border-none w-full bg-[unset] ml-[5px] focus:outline-0 placeholder:text-[11px] placeholder:font-light placeholder:text-brand-200 placeholder: leading-[16px] text-[11px] lg:text-[14px] 2xl:text[16px]"
        style={{ color: isLight ? "#fff" : "#131316" }}
      />
      {isLeftIcon && <SearchIcon fill={isLight ? "#fff" : "#131316"} />}
    </div>
  );
};

export default SearchBar;
