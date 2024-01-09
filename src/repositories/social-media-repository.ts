import { inject, injectable } from 'inversify';
import { SupabaseClient } from '@supabase/supabase-js';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { TYPES, buckets } from '../shared/constants';
import { discordChannelsId } from '../shared/constants/discord';
import axios, { HttpStatusCode } from 'axios';
import { HttpException } from '../exceptions/custom-error';

@injectable()
export class SocialMediaRepository {
  private readonly supabase: SupabaseClient;
  private readonly client: AxiosInstance;

  constructor(
    @inject(TYPES.client.supabase) _supabase: SupabaseClient,
    @inject(TYPES.client.http) _axios: AxiosInstance
  ) {
    this.supabase = _supabase;
    this.client = _axios;
  }

  public async getInstagramPhoto(token: string) {
    try {
      const fields = 'media_url,caption';

      return axios.get(`https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}`);
    } catch (error) {
      throw new HttpException({ code: HttpStatusCode.ServiceUnavailable, context: { error } });
    }
  }

  public async getDiscordNews(limit: number = 2): Promise<any[]> {
    const delimiter = limit <= 5 ? limit : 5;
    return Promise.allSettled([
      this.client.get(`/channels/${discordChannelsId.announcemets}/messages?limit=${delimiter}`),
      this.client.get(`/channels/${discordChannelsId.news}/messages?limit=${delimiter}`),
      this.client.get(`/channels/${discordChannelsId.updates}/messages?limit=${delimiter}`),
    ]);
  }
}
