import React, { FC, useState } from "react";
import styled, {css} from "styled-components";
import ProviderDrawer from "../components/ProviderDrawer";

const MainContent = styled.div<{ isBlurred: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: filter 0.3s ease-in-out;
  ${({ isBlurred }) =>
    isBlurred &&
    css`
      filter: blur(1px);
    `}
`;

const OpenButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #049dd2;
  color: #fff;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #0056b3;
  }
`;

const Home: FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <MainContent isBlurred={isDrawerOpen}>
        <OpenButton onClick={handleOpenDrawer}>Explore web APIs</OpenButton>
      </MainContent>
      <ProviderDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </>
  );
};

export default Home;
