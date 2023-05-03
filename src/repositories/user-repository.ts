import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { TDiscordUser } from '../models/discord-user-model';
import { DiscordMessage } from '../models/discord-messages-model';

export class UserRepository extends ConstraintsConfigurator {
  protected httpClient: AxiosInstance;
  constructor() {
    super();
    this.httpClient = this.setHttpClient();
  }

  public findRole(username: string): Promise<AxiosResponse<TDiscordUser>> {
    return this.httpClient.get(`/guilds/${this.guildId}/members/search?query=${username}`);
  }

  // returns  Promise<AxiosResponse<IDiscordUser[] | IDiscordUser>>
  public async messagesByRole(role: string) {
    const legend = this.httpClient.get(`/channels/${this.channels.legend}/messages`);
    const first_team = this.httpClient.get(`/channels/${this.channels.first_team}/messages`);
    const academy = this.httpClient.get(`/channels/${this.channels.academy}/messages`);
    const tryout = this.httpClient.get(`/channels/${this.channels.tryout}/messages`);

    switch (role) {
      case this.roles.legend:
        const legend_response: AxiosResponse<DiscordMessage[]> = await legend;
        return legend_response.data;
        break;

      case this.roles.first_team:
        const first_team_response: AxiosResponse<DiscordMessage[]> = await first_team;
        return first_team_response.data;
        break;

      case this.roles.academy:
        const academy_response: AxiosResponse<DiscordMessage[]> = await academy;
        return academy_response.data;

      case this.roles.tryout:
        //
        const tryout_response: AxiosResponse<DiscordMessage[]> = await tryout;
        return tryout_response.data;
        break;

      default:
        throw new Error('Role not provided');
        break;
    }
  }

  setHttpClient(): AxiosInstance {
    return axios.create({
      baseURL: 'https://discord.com/api/v9',
      headers: {
        Authorization: `Bot ${this.token}`,
      },
    });
  }
}
