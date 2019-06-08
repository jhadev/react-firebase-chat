import React from 'react';
import styled from 'styled-components';

const FooterStyle = styled.footer`
  background: white;
  position: sticky !important;
  position: -webkit-sticky;
  bottom: 0px;
  z-index: 0;
`;
const Footer = ({ children }) => <FooterStyle>{children}</FooterStyle>;

export default Footer;
