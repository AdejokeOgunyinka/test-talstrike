import React from "react";

const ModalContainer = ({
  children,
  marginTop,
}: {
  children: React.ReactNode;
  marginTop?: string;
}) => {
  return (
    <div className="h-auto w-screen fixed bg-brand-modal z-[9999] flex justify-center inset-0">
      <div
        className={`w-full mt-[20px] md:mt-[50px] 2xl:mt-[113px] ${
          marginTop || "md:mt-113px"
        } flex justify-center`}
      >
        {children}
      </div>
    </div>
  );
};

export const Modal = ({
  children,
  marginTop,
  show,
}: {
  children: React.ReactNode;
  marginTop?: string;
  show: boolean;
}) => {
  const hide=(show)?"":"hidden"
  return (
    <div className={`h-auto w-screen fixed bg-brand-modal z-[9999] flex justify-center top-0 left-0 right-0 ${hide}`}>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
