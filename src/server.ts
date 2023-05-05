import express from 'express';
import cookieparser from 'cookie-parser';
import bearerToken from 'express-bearer-token';
import cors from 'cors';
import ErrorHandler from './middleware/error-handler';

import { MainRouter } from './routes';
import { ServerConfig } from './config/server-config';

export class Server extends ServerConfig {
  public app: express.Application;
  private router;
  private port;
  private server: any;

  constructor() {
    super();
    this.app = express();

    this.app.use(
      cors({
        origin: this.getEnvVar('FRONTEND_REDIRECT_URI'),
      })
    );
    this.app.use(express.json());
    this.app.use(cookieparser());
    this.app.use(bearerToken());
    this.app.use(express.urlencoded({ extended: true }));
    this.router = new MainRouter();
    this.port = this.getEnvVar('PORT');
    this.loadRoutes();
    this.app.use(ErrorHandler);
  }

  public start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }

  protected loadRoutes() {
    this.app.use('/api', this.router.getRouter());
  }

  getApp() {
    return this.app;
  }
}
