import { Request, Response, NextFunction } from 'express';
import { PetService } from './pet.service';
import { sendResponse } from '../../shared/responses/apiResponse';

export class PetController {
  static async getPet(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.params.childId;
      const pet = await PetService.getPet(childId);
      return sendResponse(res, 200, pet);
    } catch (error) {
      next(error);
    }
  }

  static async feedPet(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.params.childId;
      const result = await PetService.feedPet(childId);
      return sendResponse(res, 200, result);
    } catch (error) {
      next(error);
    }
  }
}
