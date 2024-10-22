import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { getAPIsByProvider } from "../services/apiServices";
import { useNavigate } from "react-router-dom";

const AccordionContainer = styled.div<{ isExpanded: boolean }>`
  background-color: ${({ isExpanded }) =>
    isExpanded ? "#131924" : "transparent"};
  border-radius: ${({ isExpanded }) => (isExpanded ? "8px" : "0")};
`;

const AccordionHeader = styled.div<{ isExpanded: boolean }>`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isExpanded }) =>
    isExpanded ? "#1e2a38" : "transparent"};
  border-radius: ${({ isExpanded }) => (isExpanded ? "8px" : "0")};
  transition: background-color 0.3s ease, border-radius 0.3s ease;
`;

const ProviderName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ isExpanded }) => (isExpanded ? "90deg" : "0deg")});
`;

const APIListContainer = styled.ul<{ isExpanded: boolean }>`
  list-style: none;
  padding: ${({ isExpanded }) => (isExpanded ? "10px 20px" : "0")};
  margin: 0;
  max-height: ${({ isExpanded }) => (isExpanded ? "500px" : "0")};
  overflow: auto;
  transition: max-height 0.3s ease, padding 0.3s ease;
`;

const APIItem = styled.li`
  padding: 8px 0;
  cursor: pointer;
  color: #ffffff;
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
  onClose: () => void;
}

interface API {
  title: string;
  providerName: string;
  serviceName: string;
}

const mapApiResponse = (apiData: Record<string, any>): API[] => {
  return Object.entries(apiData).map(([key, value]) => {
    const [providerName, serviceName] = key.split(":");
    return {
      title: value.info.title,
      providerName,
      serviceName,
    };
  });
};

const ProviderAccordion: React.FC<ProviderAccordionProps> = React.memo(
  ({ provider, onClose }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [apis, setApis] = useState<API[]>([]);
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
            const apiList = mapApiResponse(apiData);
            setApis(apiList);
          })
          .catch((err) => {
            console.error(`Error fetching APIs for provider ${provider}:`, err);
            setError("Failed to load APIs. Please try again later.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [isExpanded, apis.length, provider, isLoading, error]);

    const handleAPIClick = useCallback(
      (providerName: string, serviceName?: string) => {
        if (providerName && serviceName) {
          navigate(`/api/${providerName}/${serviceName}`);
        } else {
          navigate(`/api/${providerName}`);
        }
        onClose();
      },
      [navigate]
    );

    return (
      <AccordionContainer isExpanded={isExpanded}>
        <AccordionHeader
          onClick={toggleAccordion}
          isExpanded={isExpanded}
          aria-expanded={isExpanded}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
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
              <APIListContainer isExpanded={isExpanded}>
                {apis.map(({ title, providerName, serviceName }, index) => (
                  <APIItem
                    key={index}
                    onClick={() => handleAPIClick(providerName, serviceName)}
                  >
                    {title}
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
  }
);

export default ProviderAccordion;
