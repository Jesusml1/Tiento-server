import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../shared/constants/identifiers';
import { UserRepository } from '../repositories/user-repository';
import { UserService } from '../services/user-services';
import { MainRouter } from '../routes';
import type { IRouter, IUserRouter } from './interfaces/routers-interfaces';
import { ISocialMediaRepository, type IUserRepository } from './interfaces/repositories-interfaces';
import { UserRouter } from '../routes/users-routes';
import type { IServer } from './interfaces/server-interface';
import { Server } from '../server';
import { UserController } from '../controllers/user-controllers';
import { Authorizer } from '../middleware/authorizer';
import { AuthServices } from '../services/auth-services';
import { AuthController } from '../controllers/auth-controller';
import { AuthRouter } from '../routes/auth-routes';
import { SocialMediaRepository } from '../repositories/social-media-repository';
import { SocialMediaController } from '../controllers/social-media-controller';
import { SocialMediaService } from '../services/social-media-service';
import { SocialMediaRouter } from '../routes/social-media.routes';
import { AxiosInstance } from 'axios';
import { setupHttpClient } from '../helpers/setup-http-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { getClient } from '../shared/supabase';
import { EmailTransporter } from '../helpers/Email-transporter';

export const container = new Container();

// setup middlewares
container.bind<Authorizer>(TYPES.Authorizer).to(Authorizer);

// setup controllers
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind(TYPES.Auth.controller).to(AuthController);
container.bind(TYPES.Social_Media.controller).to(SocialMediaController);

// setup services
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind(TYPES.Auth.service).to(AuthServices);
container.bind(TYPES.Social_Media.service).to(SocialMediaService);

// setup repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<SocialMediaRepository>(TYPES.Social_Media.repository).to(SocialMediaRepository);

// setup routers
container.bind<IRouter>(TYPES.Router).to(MainRouter);
container.bind<IUserRouter>(TYPES.UserRotuer).to(UserRouter);
container.bind(TYPES.Auth.router).to(AuthRouter);
container.bind(TYPES.Social_Media.router).to(SocialMediaRouter);

// setup server
container.bind<IServer>(TYPES.Server).to(Server);

// setup helpers
container.bind<EmailTransporter>(TYPES.helpers.email).to(EmailTransporter);

// setup another dependencies
container.bind<AxiosInstance>(TYPES.client.http).toDynamicValue(() => setupHttpClient());
container.bind<SupabaseClient>(TYPES.client.supabase).toDynamicValue(() => getClient());
