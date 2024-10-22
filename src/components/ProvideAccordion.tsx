
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getAPIsByProvider } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';

const AccordionContainer = styled.div`
  border-bottom: 1px solid #ddd;
`;

const AccordionHeader = styled.div<{ isExpanded: boolean }>`
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
  font-weight: 500;
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

interface ProviderAccordionProps {
  provider: string;
}

const ProviderAccordion: React.FC<ProviderAccordionProps> = React.memo(({ provider }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [apis, setApis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleAccordion = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isExpanded && apis.length === 0 && !isLoading && !error) {
      setIsLoading(true);
      getAPIsByProvider(provider)
        .then((apiData) => {
          const apiList = Object.keys(apiData);
          setApis(apiList);
        })
        .catch((err) => {
          console.error(`Error fetching APIs for provider ${provider}:`, err);
          setError('Failed to load APIs. Please try again later.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isExpanded, apis.length, provider, isLoading, error]);

  const handleAPIClick = useCallback(
    (apiKey: string) => {
      const [providerName, apiName] = apiKey.split(':');
      navigate(`/api/${providerName}/${apiName}`);
    },
    [navigate]
  );

  return (
    <AccordionContainer>
      <AccordionHeader
        onClick={toggleAccordion}
        isExpanded={isExpanded}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleAccordion();
          }
        }}
      >
        <ProviderName>{provider}</ProviderName>
        <ExpandIcon isExpanded={isExpanded}>▶</ExpandIcon>
      </AccordionHeader>
      {isExpanded && (
        <>
          {isLoading ? (
            <LoadingText>Loading APIs...</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : apis.length > 0 ? (
            <APIListContainer>
              {apis.map((apiKey) => (
                <APIItem key={apiKey} onClick={() => handleAPIClick(apiKey)}>
                  {apiKey.split(':')[1]}
                </APIItem>
              ))}
            </APIListContainer>
          ) : (
            <LoadingText>No APIs available.</LoadingText>
          )}
        </>
      )}
    </AccordionContainer>
  );
});

export default ProviderAccordion;
