import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './config';

export function makeHttp(): AxiosInstance {
  return axios.create({ baseURL: BASE_URL });
}
