import { useCallback, useEffect } from 'react';

const useScroll = (arr, size) => {
  const scrollToBottom = useCallback(() => {
    if (arr.length > size) {
      document.getElementById('bottom').scrollIntoView(false);
    } else {
      document.getElementById('bottom').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [arr.length, size]);

  const scrollToTop = useCallback(() => {
    if (arr.length > size) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [arr.length, size]);

  useEffect(() => {
    scrollToBottom();
  }, [arr, scrollToBottom]);

  return { scrollToBottom, scrollToTop };
};

export { useScroll };
