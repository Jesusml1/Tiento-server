import { inject, injectable } from 'inversify';
import { Router } from 'express';
import { ISocialMediaController } from '../dependency-injection';
import { TYPES } from '../shared/constants';
import { SocialMediaController } from '../controllers/social-media-controller';
import { verifyAuth } from '../middleware/authorizer';

@injectable()
export class SocialMediaRouter {
  public readonly controller: SocialMediaController;
  private readonly router: Router;

  constructor(@inject(TYPES.Social_Media.controller) _controller: SocialMediaController) {
    this.controller = _controller;
    this.router = Router();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/instagram', (req, res) => this.controller.getInstagramPhotos(req, res));
    this.router.post('/discord', verifyAuth, (req, res) => this.controller.getDiscordNews(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
