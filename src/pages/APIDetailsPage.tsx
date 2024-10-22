// src/pages/APIDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { APIItem } from "../types/apiTypes";
import ProviderDrawer from "../components/ProviderDrawer";
import { getAPIsByProvider } from "../services/apiServices";

const Container = styled.div`
  padding: 20px;
`;

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 8px 16px;
  cursor: pointer;
`;

const APIDetailsContainer = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
`;

const APIDetailsPage: React.FC = () => {
  const { provider, apiName } = useParams<{
    provider: string;
    apiName: string;
  }>();
  const [apiDetails, setApiDetails] = useState<APIItem | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (provider) {
      getAPIsByProvider(provider)
        .then((data) => setApiDetails(data))
        .catch((error) => console.error(error));
    }
  }, [provider]);


  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const currentAPI = apiDetails ? apiDetails[`${provider}:${apiName}`] : null;

  if (!currentAPI) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <BackButton onClick={handleOpenDrawer}>Back to Providers</BackButton>
      <ProviderDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
      <APIDetailsContainer>
        <h2>{currentAPI.info.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: currentAPI.info.description }} />
        <p>
          <strong>Version:</strong> {currentAPI.info.version}
        </p>
        <p>
          <strong>Terms of Service:</strong>{" "}
          <a
            href={currentAPI.info.termsOfService}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentAPI.info.termsOfService}
          </a>
        </p>
        <p>
          <strong>Contact:</strong> {currentAPI.info.contact.name} (
          <a href={`mailto:${currentAPI.info.contact.email}`}>
            {currentAPI.info.contact.email}
          </a>
          )
        </p>
      </APIDetailsContainer>
    </Container>
  );
};

export default APIDetailsPage;
