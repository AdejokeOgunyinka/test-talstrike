import { useState } from 'react';
import NextImage from 'next/image';

import SearchIcon from '@/assets/searchIcon.svg';
import SearchBar from './SearchBar';

type ISearchbarProps = {
  children?: any;
};
const ModuleSearchBar = ({ children }: ISearchbarProps) => {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <div className="w-[full] md:h-[95px] flex justify-between items-center py-[13px] pl-[16px] pr-[19px] bg-brand-500 mx-[24px] rounded-[12px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)]">
      <div className="w-[calc(100%-60px)] h-full">
        {showSearchBar ? <SearchBar placeholder="Search..." /> : children}
      </div>
      <div
        onClick={() => setShowSearchBar(!showSearchBar)}
        className="w-[41px] h-[41px] flex justify-center items-center bg-brand-1300 rounded-[12px] cursor-pointer"
      >
        <NextImage src={SearchIcon} alt="search" />
      </div>
    </div>
  );
};

export default ModuleSearchBar;
