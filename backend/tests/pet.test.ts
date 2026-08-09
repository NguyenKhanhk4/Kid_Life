import test, { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { PetService } from '../src/modules/pet/pet.service';
import { Pet } from '../src/modules/pet/pet.model';
import { WalletService } from '../src/modules/wallet/wallet.service';
import { getErrorCode } from './testUtils';

describe('PetService', () => {
  test('feedPet should throw PET_ALREADY_FED if pet update fails due to condition', async () => {
    mock.method(PetService, 'getPet', () => Promise.resolve({ childId: 'child_1' }));
    mock.method(WalletService, 'deductPoints', () => Promise.resolve({}));

    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
    
    // findOneAndUpdate returning null simulates the condition failing
    mock.method(Pet, 'findOneAndUpdate', () => Promise.resolve(null));

    try {
      await PetService.feedPet('child_1');
      assert.fail('Should have thrown PET_ALREADY_FED error');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'PET_ALREADY_FED');
    }

    mock.restoreAll();
  });

  test('feedPet should deduct points and update pet if not fed today', async () => {
    mock.method(PetService, 'getPet', () => Promise.resolve({ childId: 'child_1' }));
    mock.method(WalletService, 'deductPoints', () => Promise.resolve({}));

    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
    
    const mockPet = {
      childId: 'child_1',
      lastFedAt: new Date(),
      xp: 10,
      level: 1,
      mood: 'HAPPY',
      save: () => Promise.resolve(),
    };
    mock.method(Pet, 'findOneAndUpdate', () => Promise.resolve(mockPet));

    const result = await PetService.feedPet('child_1');
    assert.strictEqual(result.pet.mood, 'HAPPY');
    assert.strictEqual(result.pet.xp, 10); 
    
    mock.restoreAll();
  });
});

