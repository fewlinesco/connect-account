import React from 'react'
import styled from "styled-components";
import Header from './Header';

const Layout: React.FC = ({children}) => {
  return (
    <Main>
      <Header/>
      {children}
    </Main>
  )
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: 0 auto;
`;

export default Layout;