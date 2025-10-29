import apiClient from './apiClient';
import { masterEndpoints } from './endpoints';
import { AllMasterData, MasterResponse } from './types';

export const fetchMasterData = async (): Promise<MasterResponse> => {
  const response = await apiClient.get<MasterResponse>(masterEndpoints.getMasterData);
  return response.data;
};