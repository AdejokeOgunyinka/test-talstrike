import React from "react";

const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-auto w-screen fixed bg-brand-modal z-[9999] flex justify-center inset-0">
      <div className="w-full mt-[20px] md:mt-[113px] flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
