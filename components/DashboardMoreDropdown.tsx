const MoreDropdown = ({
  onClickAnnouncement,
  onClickArticle,
  onClickOpening,
}: {
  onClickAnnouncement?: any;
  onClickArticle?: any;
  onClickOpening?: any;
}) => {
  const moreOptions = [
    { name: "Announcement", onClick: onClickAnnouncement },
    { name: "Article", onClick: onClickArticle },
    { name: "Openings", onClick: onClickOpening },
    { name: "Polls" },
  ];
  return (
    <div className="w-[142px] h-[133px] py-[14px] px-[27px] flex-col flex justify-between bg-brand-600 shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px]">
      {moreOptions.map((option, index) => (
        <p
          key={index}
          className="cursor-pointer font-semibold text-[11px] text-brand-1250 leading-[16px]"
          onClick={option?.onClick}
        >
          {option.name}
        </p>
      ))}
    </div>
  );
};

export default MoreDropdown;
