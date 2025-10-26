import apiClient from './apiClient';
import { masterEndpoints } from './endpoints';
import { MasterResponse } from './types';

export const fetchMasterData = async <T>(type: string): Promise<MasterResponse<T>> => {
  const response = await apiClient.get<MasterResponse<T>>(masterEndpoints.getMasterData(type));
  return response.data;
};
