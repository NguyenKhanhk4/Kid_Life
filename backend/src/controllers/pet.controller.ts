import { Request, Response, NextFunction } from 'express';
import { petService } from '../services/pet.service';

export const getPet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy childId từ auth middleware hoặc query string
    const childId = (req as any).user?.childId || req.query.childId;
    
    if (!childId) {
      return res.status(400).json({ message: 'childId is required' });
    }
    
    const pet = await petService.getPetByChildId(childId as string);
    res.json(pet);
  } catch (error) {
    next(error);
  }
};

export const feedPet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy childId từ auth middleware hoặc body
    const childId = (req as any).user?.childId || req.body.childId;
    
    if (!childId) {
      return res.status(400).json({ message: 'childId is required' });
    }

    const pet = await petService.feedPet(childId as string);
    res.json(pet);
  } catch (error) {
    next(error);
  }
};
