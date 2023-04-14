import NextImage from 'next/image';
import SearchIcon from '@/assets/searchIcon.svg';

interface ISearchBar {
  placeholder: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchBar = ({ placeholder, onChange }: ISearchBar) => {
  return (
    <div className="w-[100%] h-[100%] border-[1px] rounded-[7px] border-brand-300 flex items-center pl-[11px]">
      <NextImage src={SearchIcon} alt="search bar" />
      <input
        placeholder={placeholder}
        onChange={onChange}
        className="border-none w-full bg-[unset] ml-[5px] focus:outline-0 placeholder:text-[11px] placeholder:font-light placeholder:text-brand-200 placeholder: leading-[16px] text-[11px] lg:text-[14px] 2xl:text[16px]"
      />
    </div>
  );
};

export default SearchBar;
