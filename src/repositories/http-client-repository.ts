import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ServerConfig } from '../config/server-config';
import { Error } from '../models/error-model';
import { CustomError } from '../exceptions/custom-error';

export abstract class HttpRepository<T> extends ServerConfig {
  protected readonly httpClient: AxiosInstance;
  protected readonly token: string;

  constructor() {
    super();
    this.token = super.getEnvVar('BOT_TOKEN');
    this.httpClient = axios.create({
      baseURL: 'https://discord.com/api/v9',
      headers: {
        Authorization: `Bot ${this.token}`,
      },
    });
  }

  protected abstract getToken(data: any): Promise<string>;
  protected abstract getUser(accessToken: string): Promise<T>;
  protected abstract checkBan(id: string): Promise<Boolean>;
  protected abstract insertInDiscord(access_token: any, id: string): Promise<AxiosResponse<T>>;
  protected abstract fetchFromDiscord(userId: string): Promise<AxiosResponse<T>>;
}
