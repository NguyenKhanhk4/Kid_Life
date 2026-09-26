import cors from 'cors';
import express from 'express';
import { env } from './config/env';

// Pet module (DEV 0 - original)
import { PetService } from './modules/pet/pet.service';
import { createPetRouter } from './modules/pet/pet.routes';
import { WalletXpService, type ChildXpService } from './modules/pet/pet.xp';
import { PetAccessoryService } from './modules/pet/accessories/pet-accessory.service';
import { createPetAccessoryAdminRouter } from './modules/pet/accessories/pet-accessory.routes';

import { errorHandler, notFoundHandler } from './shared/http';

export interface AppDeps {
  xpService?: ChildXpService;
  now?: () => Date;
}

/** Tạo express app (core middleware + pet routes). Các route DEV 1/2 được mount trong server.ts. */
export function createApp(deps: AppDeps = {}) {
  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/', (_req, res) => {
    res.send('KidLife API is running');
  });

  // Pet routes (DEV 0) + tủ đồ phụ kiện
  const xpService = deps.xpService ?? new WalletXpService();
  const petService = new PetService(xpService, env.tzOffsetMinutes, deps.now);
  const accessoryService = new PetAccessoryService(xpService);
  app.use('/api/pet', createPetRouter(petService, accessoryService));
  // Admin quản lý danh mục phụ kiện (mount trước /api/admin của server.ts)
  app.use('/api/admin/master-data/accessories', createPetAccessoryAdminRouter(accessoryService));

  return { app, registerErrorHandlers };

  function registerErrorHandlers() {
    app.use(notFoundHandler);
    app.use(errorHandler);
  }
}
