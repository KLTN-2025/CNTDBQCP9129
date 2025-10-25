import { useEffect } from "react";

const useLockBodyScroll = (isActive) => {
  useEffect(() => {
    if (!isActive) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isActive]);
};

export default useLockBodyScroll;
