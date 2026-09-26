import cors from 'cors';
import express from 'express';
import { env, isProduction } from './config/env';
import { PetService } from './modules/pet/pet.service';
import { createPetRouter } from './modules/pet/pet.routes';
import { InMemoryChildXpService, type ChildXpService } from './modules/pet/pet.xp';
import { errorHandler, notFoundHandler } from './shared/http';

export interface AppDeps {
  xpService?: ChildXpService;
  now?: () => Date;
}

/** Tạo express app (tách khỏi server.ts để test gọi trực tiếp). */
export function createApp(deps: AppDeps = {}) {
  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  const petService = new PetService(deps.xpService ?? new InMemoryChildXpService(), env.tzOffsetMinutes, deps.now);
  app.use('/api/pet', createPetRouter(petService, { allowDelete: !isProduction }));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
