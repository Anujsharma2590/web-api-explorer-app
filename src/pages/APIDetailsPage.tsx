import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { APIItem } from "../types/apiTypes";
import ProviderDrawer from "../components/ProviderDrawer";
import { getAPIsByProvider } from "../services/apiServices";

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  color: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
  border-radius: 8px;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;

  code {
    background-color: #1e2a38;
    padding: 2px 4px;
    border-radius: 3px;
  }

  pre {
    background-color: #1e2a38;
    padding: 10px;
    border-radius: 5px;
    overflow: auto;
  }

  a {
    color: #00bfff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const InfoLabel = styled.strong`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Link = styled.a`
  color: #00bfff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #00bfff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #008fcc;
  }
`;

const ExploreButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #00bfff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #008fcc;
  }
`;

const APIDetailsPage: React.FC = () => {
  const { provider } = useParams<{
    provider: string;

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

  const currentAPI = apiDetails ? apiDetails[`${provider}`] : null;

  if (!currentAPI) {
    return <Container>Loading...</Container>;
  }

  console.log("akjscbakjscbakjsc", currentAPI)
  return (
    <Container>
      <ProviderDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
      <Header>
        <Logo src={currentAPI.info["x-logo"].url} alt={currentAPI.info.title} />
        <Title>{currentAPI.info.title}</Title>
      </Header>

      <Description>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {currentAPI.info.description}
        </ReactMarkdown>
      </Description>

      <InfoSection>
        <InfoLabel>Swagger:</InfoLabel>
        <Link
          href={currentAPI.swaggerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {currentAPI.swaggerUrl}
        </Link>
      </InfoSection>

      <InfoSection>
        <InfoLabel>Contact:</InfoLabel>
        <p>
          <strong>Name:</strong> {currentAPI.info.contact.name}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <Link href={`mailto:${currentAPI.info.contact.email}`}>
            {currentAPI.info.contact.email}
          </Link>
        </p>
        <p>
          <strong>Website:</strong>{" "}
          <Link
            href={currentAPI.info.contact.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentAPI.info.contact.url}
          </Link>
        </p>
      </InfoSection>

      <ExploreButton onClick={handleOpenDrawer}>
        Explore more APIs
      </ExploreButton>
    </Container>
  );
};

export default APIDetailsPage;
