import React from 'react';
import useNativeLazyLoading from '@charlietango/use-native-lazy-loading';
import { useInView } from 'react-intersection-observer';

const Image = ({ url }) => {
  const supportsLazyLoading = useNativeLazyLoading();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  return (
    <div ref={!supportsLazyLoading ? ref : undefined}>
      {inView || supportsLazyLoading ? (
        <img
          className="msg-img img-fluid rounded img-thumbnail"
          src={url}
          loading="lazy"
          alt="message-img"
        />
      ) : null}
    </div>
  );
};

export default Image;
