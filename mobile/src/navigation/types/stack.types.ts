import type { NavigatorScreenParams } from '@react-navigation/native';
import { Routes } from '../constants';
import { MainTabParamList } from './tab.types';

// Hardcoded string to avoid circular dependency if Navigators is needed
// but we can just import Navigators.
import { Navigators } from '../constants';

export type AuthStackParamList = {
  [Routes.Auth.Onboarding]: undefined;
  [Routes.Auth.Login]: undefined;
  [Routes.Auth.Register]: undefined;
  [Routes.Auth.ForgotPassword]: undefined;
  [Routes.Auth.OTP]: { email: string };
  [Routes.Auth.ResetPassword]: { token: string };
  [Routes.Auth.RoleSelection]: undefined;
};

export type AppStackParamList = {
  [Navigators.Main]:
    | (NavigatorScreenParams<MainTabParamList> & { role?: 'parent' | 'child' })
    | undefined;

  // Profile sub-screens
  [Routes.Profile.ChildManagement]: undefined;
  [Routes.Profile.AddChild]: undefined;
  [Routes.Profile.EditChild]: { childId: string };
  [Routes.Profile.ChildDetail]: { childId: string };
  [Routes.Profile.ParentProfile]: undefined;
  [Routes.Profile.Settings]: undefined;
  [Routes.Profile.ChangePassword]: undefined;

  // Parent sub-screens
  [Routes.Parent.ApprovalQueue]: undefined;
  [Routes.Parent.ApprovalDetail]: { submissionId: string };

  // Lesson sub-screens
  [Routes.Lesson.Library]: undefined;
  [Routes.Lesson.Detail]: { lessonId: string };

  // Quiz sub-screens
  [Routes.Quiz.Play]: { quizId: string; lessonTitle?: string };
  [Routes.Quiz.Result]: { score: number; total: number; passed: boolean; pointsAwarded: number; quizId: string };

  // Mission sub-screens
  [Routes.Mission.Detail]: { missionId: string; mode?: 'parent' | 'child' };
  [Routes.Mission.Create]: { editMissionId?: string } | undefined;
  [Routes.Mission.AIVideoPrompt]: { missionTitle?: string };
  [Routes.Mission.AIVideoStatus]: { prompt: string; templateId: string };

  // Reward sub-screens
  [Routes.Reward.Shop]: { mode?: 'parent' | 'child' } | undefined;

  // Feature sub-screens
  [Routes.Features.Hub]: undefined;
  [Routes.Features.ViralMilestones]: undefined;
  [Routes.Features.Leaderboard]: undefined;
  [Routes.Features.MemoryLane]: undefined;
  [Routes.Features.AIReport]: undefined;
  [Routes.Features.VirtualBank]: undefined;
  [Routes.Features.MemoryLanePremium]: undefined;
  [Routes.Features.BedtimeStories]: undefined;
  [Routes.Features.ChildBedtimeStories]: undefined;
  [Routes.Features.ParentBedtimeStories]: undefined;
  [Routes.Features.CoParenting]: undefined;
  [Routes.Features.MultiStepTask]: undefined;
  [Routes.Features.PetEvolution]: undefined;
};
