import querystring from 'querystring';
import { HttpRepository } from '../http-client-repository';
import { IDiscordUser } from '../../models/discord-user-model';
import { AxiosResponse, AxiosError } from 'axios';
import { CustomError } from '../../exceptions/custom-error';
import { HttpCodes } from '../../exceptions/custom-error';

export class OauthRepository extends HttpRepository<IDiscordUser> {
  constructor() {
    super();
  }
  public async getToken(data: any): Promise<string> {
    try {
      const response: AxiosResponse = await this.httpClient.post('https://discord.com/api/oauth2/token', querystring.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return response.data.access_token;
    } catch (err) {
      throw new CustomError({
        description: 'Oauth service was failed',
        httpCode: HttpCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async getUser(accessToken: string): Promise<IDiscordUser> {
    try {
      const response = await this.httpClient.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (err) {
      throw new CustomError({
        description: 'get auth failed',
        httpCode: HttpCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public checkBan(id: string): Promise<Boolean> {
    return this.httpClient
      .get(`https://discord.com/api/v9/guilds/1086689618197483540/bans/${id}`, {
        headers: {
          Authorization: `Bot ${this.getEnvVar('BOT_TOKEN')}`,
        },
        validateStatus: status => status === 404,
      })
      .then(() => {
        return false;
      })
      .catch(err => {
        return true;
      });
  }

  public async insertInDiscord(access_token: any, id: string): Promise<AxiosResponse<IDiscordUser>> {
    try {
      const result: AxiosResponse<IDiscordUser> = await this.httpClient.put(
        `https://discord.com/api/v9/guilds/1086689618197483540/members/${id}`,
        { access_token: access_token?.data },
        {
          headers: {
            Authorization: `Bot ${this.token}`,
          },
        }
      );
      return result;
    } catch (err) {
      throw new CustomError({
        description: 'User insertion was failed',
        httpCode: HttpCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
  public async fetchFromDiscord(userId: string): Promise<AxiosResponse<IDiscordUser>> {
    try {
      const guildId = '1086689618197483540';
      const result = await this.httpClient.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      });

      return result;
    } catch (err) {
      throw new CustomError({
        description: 'Cannot check is the user is inside the TIENTO server',
        httpCode: HttpCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
