// src/components/Drawer/ProviderDrawer.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getProviders } from "../services/apiServices";

import useEscapeKey from "../hooks/useEscapeKey";
import ProviderAccordion from "./ProvideAccordion";

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
  background-color: rgba(0, 0, 0, 0.3);
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 1000;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
  cursor: pointer;
`;

const Drawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  z-index: 1001;
    background-color: #3f5f7a;
`;

const DrawerHeader = styled.div`
  padding: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3f5f7a;
`;

const DrawerContent = styled.div`
  padding: 20px;
  background-color: #3f5f7a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const ProviderListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingText = styled.p`
  font-style: italic;
`;

const ErrorText = styled.p`
  color: red;
  font-style: italic;
`;

interface ProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProviderDrawer: React.FC<ProviderDrawerProps> = ({ isOpen, onClose }) => {
  const [providers, setProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getProviders()
        .then((data) => setProviders(data))
        .catch((err) => {
          console.error("Error fetching providers:", err);
          setError("Failed to load providers. Please try again later.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  return (
    <Overlay isOpen={isOpen}>
      <Backdrop onClick={onClose} />
      <Drawer isOpen={isOpen}>
        <DrawerHeader>
          <h3>API Providers</h3>
          <CloseButton onClick={onClose} aria-label="Close Drawer">
            &times;
          </CloseButton>
        </DrawerHeader>
        <DrawerContent>
          {isLoading ? (
            <LoadingText>Loading providers...</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : (
            <ProviderListContainer>
              {providers.map((provider) => (
                <ProviderAccordion key={provider} provider={provider} />
              ))}
            </ProviderListContainer>
          )}
        </DrawerContent>
      </Drawer>
    </Overlay>
  );
};

export default ProviderDrawer;
