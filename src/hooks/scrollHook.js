import { useState, useLayoutEffect, useCallback } from 'react';

const useScroll = chat => {
  const [isBottom, goToBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    window.scrollTo(0, 10000);
    goToBottom(false);
  }, []);

  useLayoutEffect(() => {
    if (!isBottom) {
      scrollToBottom();
    } else {
      goToBottom(true);
    }
  }, [chat, isBottom, scrollToBottom]);

  return { goToBottom, isBottom, scrollToBottom };
};

export { useScroll };
