import { useState, useEffect } from 'react';

const useScroll = chat => {
  const [isTop, goToBottom] = useState(false);

  useEffect(() => {
    if (isTop) {
      document.getElementById('bottom').scrollIntoView(false);
    } else {
      window.scrollTo(0, 0);
    }
  }, [chat, isTop]);

  return { goToBottom, isTop };
};

export { useScroll };
