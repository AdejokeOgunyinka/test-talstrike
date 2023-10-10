import NextImage from "next/image";
import SearchIcon from "@/assets/SearchIcon.svg.next";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface ISearchBar {
  placeholder: string;
  onChange?: any;
  differentOnChange?: any;
  isLight?: boolean;
  isLeftIcon?: boolean;
  hasRoundedCorners?: boolean;
  value?: string;
  onClickClear?: any;
  hasClearBtn?: boolean;
  iconColor?: string;
}

const SearchBar = ({
  placeholder,
  onChange,
  isLight,
  isLeftIcon,
  hasRoundedCorners,
  differentOnChange,
  value,
  onClickClear,
  hasClearBtn,
  iconColor,
}: ISearchBar) => {
  return (
    <div
      className={`w-[100%] h-[100%] ${!iconColor && `border-[1px]`} ${
        hasRoundedCorners ? "rounded-[80px]" : "rounded-[4px]"
      } border-brand-300 flex items-center px-[16px] ${
        iconColor && `bg-[#F1F1F1]`
      }`}
    >
      {!isLeftIcon && !hasClearBtn && (
        <SearchIcon
          fill={iconColor ? iconColor : isLight ? "#fff" : "#131316"}
        />
      )}
      {!isLeftIcon && hasClearBtn && (
        <XCircleIcon
          onClick={onClickClear}
          width="25px"
          height="25px"
          color={iconColor ? iconColor : isLight ? "#fff" : "#131316"}
          cursor="pointer"
        />
      )}
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
        className={`border-none w-full bg-[unset] ml-[5px] focus:outline-0 placeholder:text-[11px] placeholder:font-light ${
          iconColor && `placeholder:text-[${iconColor}]`
        } placeholder:text-brand-200 placeholder: leading-[16px] text-[11px] lg:text-[14px] 2xl:text[16px]`}
        style={{ color: iconColor ? iconColor : isLight ? "#fff" : "#131316" }}
        value={value}
      />
      {isLeftIcon && !hasClearBtn && (
        <SearchIcon
          fill={iconColor ? iconColor : isLight ? "#fff" : "#131316"}
        />
      )}
      {isLeftIcon && hasClearBtn && (
        <XCircleIcon
          onClick={onClickClear}
          width="25px"
          height="25px"
          color={iconColor ? iconColor : isLight ? "#fff" : "#131316"}
          cursor="pointer"
        />
      )}
    </div>
  );
};

export default SearchBar;
