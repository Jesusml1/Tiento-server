import { Router } from 'express';
import { TokenHandler } from '../middleware/token-handler';
import { AuthController } from '../controllers/auth-controller';
import { verifyEmailValidator } from '../validators';
import { VerifyValidator } from '../validators/verify-email-validator';
import { DiscordCallbackValidator } from '../validators/discord-callback-validator';

export class AuthRouter {
  protected router: Router;
  protected controller: AuthController;
  protected service: any;
  // protected middleware: verifyEmailValidator;

  constructor() {
    this.router = Router();
    this.service = '';
    this.controller = new AuthController();
    // this.middleware = verifyEmailValidator
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/discord', (req, res) => this.controller.discord(req, res));
    this.router.get(
      '/discord/callback',
      (req, res, next) => DiscordCallbackValidator(req, res, next),
      (req, res) => this.controller.discordCallback(req, res)
    );
    this.router.get('/user', (req, res) => this.controller.user(req, res));

    this.router.post(
      '/verify',
      (req, res, next) => VerifyValidator.useInstance().verifyBody(req, res, next),
      (req, res) => this.controller.verifyEmail(req, res)
    );
    this.router.put(
      '/verify-email',
      (req, res, next) => verifyEmailValidator(req, res, next),
      (req, res, next) => this.controller.verifyCode(req, res, next),
      (req, res, next) => this.controller.searchInDiscord(req, res, next),
      (req, res, next) => this.controller.setUserData(req, res, next)
    );
  }

  getRouter() {
    return this.router;
  }
}
