import axios from 'axios';
import { ProviderListResponse, APIItem } from '../types/apiTypes';

const BASE_URL = 'https://api.apis.guru/v2';

export const getProviders = async (): Promise<string[]> => {
  const response = await axios.get<ProviderListResponse>(`${BASE_URL}/providers.json`);
  return response.data.data;
};

export const getAPIsByProvider = async (provider: string): Promise<any> => {
  const response = await axios.get<APIItem>(`${BASE_URL}/${provider}.json`);
  return response.data.apis;
};
