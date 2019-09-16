import { useCallback, useEffect, useState } from 'react';

const useScroll = (arr, maxLength) => {
  const [scrollTop, setScrollDirection] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (arr.length > maxLength) {
      document.getElementById('bottom').scrollIntoView(false);
    } else {
      document.getElementById('bottom').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [arr.length, maxLength]);

  const scrollToTop = useCallback(() => {
    if (arr.length > maxLength) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [arr.length, maxLength]);

  useEffect(() => {
    if (scrollTop) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  }, [arr, scrollToBottom, scrollToTop, scrollTop]);

  return { scrollToBottom, scrollToTop, scrollTop, setScrollDirection };
};

export { useScroll };
