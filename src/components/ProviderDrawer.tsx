import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAPIsByProvider, getProviders } from '../services/apiServices';


const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
  cursor: pointer;
`;

const Drawer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out;
  transform: translateX(0);
  overflow-y: auto;
`;

const DrawerHeader = styled.div`
  padding: 20px;
  background-color: #3f5f7a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
`;

const DrawerContent = styled.div`
  padding: 20px;
  background-color: #3f5f7a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const ProviderListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProviderItem = styled.div`
  border-bottom: 1px solid #ddd;
`;

const ProviderHeader = styled.div<{ isExpanded: boolean }>`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isExpanded }) => (isExpanded ? '#eaeaea' : 'transparent')};
  &:hover {
    background-color: #eaeaea;
  }
`;

const ProviderName = styled.span`
  font-size: 16px;
  font-weight: 400;
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ isExpanded }) => (isExpanded ? '90deg' : '0deg')});
`;

const APIListContainer = styled.ul`
  list-style: none;
  padding: 10px 20px;
  margin: 0;
`;

const APIItem = styled.li`
  padding: 8px 0;
  cursor: pointer;
  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
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
  const [apisByProvider, setApisByProvider] = useState<Record<string, string[]>>({});
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const [loadingProviders, setLoadingProviders] = useState<Set<string>>(new Set());
  const [errorProviders, setErrorProviders] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      getProviders()
        .then(setProviders)
        .catch((error: any) => console.error('Error fetching providers:', error));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const toggleProvider = async (provider: string) => {
    const isExpanded = expandedProviders.has(provider);
    const newExpandedProviders = new Set(expandedProviders);

    if (isExpanded) {
      newExpandedProviders.delete(provider);
      setExpandedProviders(newExpandedProviders);
    } else {
      newExpandedProviders.add(provider);
      setExpandedProviders(newExpandedProviders);

      // If APIs for this provider are not yet fetched, fetch them
      if (!apisByProvider[provider] && !loadingProviders.has(provider)) {
        const newLoadingProviders = new Set(loadingProviders);
        newLoadingProviders.add(provider);
        setLoadingProviders(newLoadingProviders);

        try {
          const apiData = await getAPIsByProvider(provider);
          const apiList = Object.keys(apiData);
          setApisByProvider((prev) => ({ ...prev, [provider]: apiList }));
        } catch (error: any) {
          console.error(`Error fetching APIs for provider ${provider}:`, error);
          setErrorProviders((prev) => ({
            ...prev,
            [provider]: 'Failed to load APIs. Please try again later.',
          }));
        } finally {
          const updatedLoadingProviders = new Set(loadingProviders);
          updatedLoadingProviders.delete(provider);
          setLoadingProviders(updatedLoadingProviders);
        }
      }
    }
  };

  const handleAPIClick = (provider: string, apiName: string) => {
    onClose();
    navigate(`/api/${provider}/${apiName}`);
  };

  return (
    <Overlay isOpen={isOpen}>
      <Backdrop onClick={onClose} />
      <Drawer>
        <DrawerHeader>
          <h3>Select Provider</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </DrawerHeader>
        <DrawerContent>
          <ProviderListContainer>
            {providers.map((provider) => {
              const isExpanded = expandedProviders.has(provider);
              const isLoading = loadingProviders.has(provider);
              const errorMessage = errorProviders[provider];
              const apis = apisByProvider[provider];

              return (
                <ProviderItem key={provider}>
                  <ProviderHeader
                    onClick={() => toggleProvider(provider)}
                    isExpanded={isExpanded}
                    aria-expanded={isExpanded}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleProvider(provider);
                      }
                    }}
                  >
                    <ProviderName>{provider}</ProviderName>
                    <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
                  </ProviderHeader>
                  {isExpanded && (
                    <div>
                      {isLoading ? (
                        <LoadingText>Loading APIs...</LoadingText>
                      ) : errorMessage ? (
                        <ErrorText>{errorMessage}</ErrorText>
                      ) : apis && apis.length > 0 ? (
                        <APIListContainer>
                          {apis.map((apiKey) => {
                            const [providerName, apiName] = apiKey.split(':');
                            return (
                              <APIItem
                                key={apiKey}
                                onClick={() => handleAPIClick(providerName, apiName)}
                              >
                                {apiName}
                              </APIItem>
                            );
                          })}
                        </APIListContainer>
                      ) : (
                        <LoadingText>No APIs available.</LoadingText>
                      )}
                    </div>
                  )}
                </ProviderItem>
              );
            })}
          </ProviderListContainer>
        </DrawerContent>
      </Drawer>
    </Overlay>
  );
};

export default ProviderDrawer;
