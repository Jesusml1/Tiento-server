import { inject, injectable } from 'inversify';
import { ISocialMediaRepository } from '../dependency-injection';
import { TYPES } from '../shared/constants';
import { SocialMediaRepository } from '../repositories/social-media-repository';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { HttpException } from '../exceptions/custom-error';
import { DiscordMessage } from '../models/discord-messages-model';
import { discordErrors } from '../exceptions/messages';
import { CommunityMessage, PromiseAllResult } from '../shared/types';
import { readToken } from '../helpers/token-utils';
import { getGuildName } from '../helpers/discord-utils';

@injectable()
export class SocialMediaService {
  private readonly repository: SocialMediaRepository;

  constructor(@inject(TYPES.Social_Media.repository) readonly _repo: SocialMediaRepository) {
    this.repository = _repo;
  }

  public async getInstagramPhotos() {
    const result = await this.repository.getInstagramPhoto(readToken());
    console.log(result);

    if (result!.status !== HttpStatusCode.Ok) {
      throw new HttpException({ code: result!.status, message: result!.statusText, context: result!.data });
    }

    return result?.data;
  }

  // I'm not sure if I should to adapt message date to current user local date. Can be do on future phases
  public async getDiscordNews(limit: number): Promise<CommunityMessage[]> {
    try {
      // fetch messages from discord servers
      const rawMessages = <PromiseAllResult<AxiosResponse>[]>await this.repository.getDiscordNews(limit);
      // clean promise wrapper an merge response arrays
      const messages = rawMessages
        .filter((response) => response.status === 'fulfilled')
        .map((item) => <DiscordMessage>item.value?.data)
        .flat();
      // return only the information of interest
      return messages.map((msg) => {
        return {
          author: msg.author.username,
          content: cutDiscordPost(msg.content),
          date: new Date(msg.timestamp).toLocaleDateString('en-US'),
          channel_name: getGuildName(msg.channel_id),
          attachment: msg.attachments,
        };
      });
    } catch (error) {
      throw new HttpException({
        message: discordErrors.CANNOT_RECOVER_MESSAGES,
        code: HttpStatusCode.Conflict,
      });
    }
  }
}

const cutDiscordPost = (post: string) => {
  const limit = 300;
  return post.length > limit ? post.substring(0, limit) : post;
};
