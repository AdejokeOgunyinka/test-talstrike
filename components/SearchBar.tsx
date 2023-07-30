import NextImage from "next/image";
import SearchIcon from "@/assets/SearchIcon.svg.next";

interface ISearchBar {
  placeholder: string;
  onChange?: any;
  isLight?: boolean;
}

const SearchBar = ({ placeholder, onChange, isLight }: ISearchBar) => {
  return (
    <div className="w-[100%] h-[100%] border-[1px] rounded-[7px] border-brand-300 flex items-center pl-[11px]">
      <SearchIcon fill={isLight ? "#fff" : "#131316"} />
      <input
        placeholder={placeholder}
        onChange={(e) => {
          let val = e?.target?.value;
          onChange && onChange(val);
        }}
        className="border-none w-full bg-[unset] ml-[5px] focus:outline-0 placeholder:text-[11px] placeholder:font-light placeholder:text-brand-200 placeholder: leading-[16px] text-[11px] lg:text-[14px] 2xl:text[16px]"
        style={{ color: isLight ? "#fff" : "#131316" }}
      />
    </div>
  );
};

export default SearchBar;
