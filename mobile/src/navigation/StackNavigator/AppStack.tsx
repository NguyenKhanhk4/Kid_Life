import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Navigators, Routes } from '../constants';
import { AppStackParamList, RootStackParamList } from '../types';
import { defaultScreenOptions } from './StackNavigator.types';
import { BottomTabNavigator } from '../TabNavigator';

// Profile screens
import ChildManagementScreen from '@/modules/profile/screens/ChildManagementScreen';
import AddChildScreen from '@/modules/profile/screens/AddChildScreen';
import EditChildScreen from '@/modules/profile/screens/EditChildScreen';
import ChildDetailScreen from '@/modules/profile/screens/ChildDetailScreen';
import ParentProfileScreen from '@/modules/profile/screens/ParentProfileScreen';
import SettingsScreen from '@/modules/profile/screens/SettingsScreen';
import ChangePasswordScreen from '@/modules/auth/screens/ChangePasswordScreen';

// Parent sub-screens
import ApprovalQueueScreen from '@/modules/parent/screens/ApprovalQueueScreen';
import ApprovalDetailScreen from '@/modules/parent/screens/ApprovalDetailScreen';
import RewardsParentScreen from '@/modules/parent/screens/RewardsParentScreen';

// Lesson screens
import LessonLibraryScreen from '@/modules/lesson/screens/LessonLibraryScreen';
import LessonDetailScreen from '@/modules/lesson/screens/LessonDetailScreen';

// Quiz screens
import QuizScreen from '@/modules/quiz/screens/QuizScreen';
import QuizResultScreen from '@/modules/quiz/screens/QuizResultScreen';

// Mission screens
import MissionDetailScreen from '@/modules/mission/screens/MissionDetailScreen';
import CreateMissionScreen from '@/modules/mission/screens/CreateMissionScreen';
import AIVideoPromptScreen from '@/modules/mission/screens/AIVideoPromptScreen';
import AIVideoStatusScreen from '@/modules/mission/screens/AIVideoStatusScreen';

// Reward screens
import RewardShopScreen from '@/modules/reward/screens/RewardShopScreen';

// Pet screens
import PetScreen from '@/modules/child/screens/PetScreen';
import WalletScreen from '@/modules/child/screens/WalletScreen';

// Feature screens (new)
import FeaturesHubScreen from '@/modules/features/screens/FeaturesHubScreen';
import ViralMilestonesScreen from '@/modules/features/screens/ViralMilestonesScreen';
import LeaderboardScreen from '@/modules/features/screens/LeaderboardScreen';
import MemoryLaneScreen from '@/modules/features/screens/MemoryLaneScreen';
import AIReportScreen from '@/modules/features/screens/AIReportScreen';
import VirtualBankScreen from '@/modules/features/screens/VirtualBankScreen';
import MemoryLanePremiumScreen from '@/modules/features/screens/MemoryLanePremiumScreen';
import BedtimeStoriesScreen from '@/modules/features/screens/BedtimeStoriesScreen';
import ChildBedtimeStoriesScreen from '@/modules/features/screens/ChildBedtimeStoriesScreen';
import ParentBedtimeStoriesScreen from '@/modules/features/screens/ParentBedtimeStoriesScreen';
import CoParentingScreen from '@/modules/features/screens/CoParentingScreen';
import MultiStepTaskScreen from '@/modules/features/screens/MultiStepTaskScreen';
import PetEvolutionScreen from '@/modules/features/screens/PetEvolutionScreen';

const AppStackNav = createNativeStackNavigator<AppStackParamList>();

type AppStackProps = NativeStackScreenProps<RootStackParamList, typeof Navigators.Main>;

export const AppStack = ({ route }: AppStackProps) => {
  const role = (route.params as { role?: 'parent' | 'child' } | undefined)?.role ?? 'parent';

  return (
    <AppStackNav.Navigator screenOptions={defaultScreenOptions}>
      <AppStackNav.Screen
        name={Navigators.Main}
        children={() => (
          <BottomTabNavigator
            role={role}
          />
        )}
      />

      {/* Profile Sub-screens */}
      <AppStackNav.Screen name={Routes.Profile.ChildManagement} component={ChildManagementScreen} />
      <AppStackNav.Screen name={Routes.Profile.AddChild} component={AddChildScreen} />
      <AppStackNav.Screen name={Routes.Profile.EditChild} component={EditChildScreen} />
      <AppStackNav.Screen name={Routes.Profile.ChildDetail} component={ChildDetailScreen} />
      <AppStackNav.Screen name={Routes.Profile.ParentProfile} component={ParentProfileScreen} />
      <AppStackNav.Screen name={Routes.Profile.Settings} component={SettingsScreen} />
      <AppStackNav.Screen name={Routes.Profile.ChangePassword} component={ChangePasswordScreen} />

      {/* Parent Sub-screens */}
      <AppStackNav.Screen name={Routes.Parent.ApprovalQueue} component={ApprovalQueueScreen} />
      <AppStackNav.Screen name={Routes.Parent.ApprovalDetail} component={ApprovalDetailScreen} />
      <AppStackNav.Screen name={Routes.Parent.Rewards} component={RewardsParentScreen} />

      {/* Lesson Sub-screens */}
      <AppStackNav.Screen name={Routes.Lesson.Library} component={LessonLibraryScreen} />
      <AppStackNav.Screen name={Routes.Lesson.Detail} component={LessonDetailScreen} />

      {/* Quiz Sub-screens */}
      <AppStackNav.Screen name={Routes.Quiz.Play} component={QuizScreen} />
      <AppStackNav.Screen name={Routes.Quiz.Result} component={QuizResultScreen} />

      {/* Mission Sub-screens */}
      <AppStackNav.Screen name={Routes.Mission.Detail} component={MissionDetailScreen} />
      <AppStackNav.Screen name={Routes.Mission.Create} component={CreateMissionScreen} />
      <AppStackNav.Screen name={Routes.Mission.AIVideoPrompt} component={AIVideoPromptScreen} />
      <AppStackNav.Screen name={Routes.Mission.AIVideoStatus} component={AIVideoStatusScreen} />

      {/* Reward Sub-screens */}
      <AppStackNav.Screen name={Routes.Reward.Shop} component={RewardShopScreen} />

      {/* Pet Sub-screens */}
      <AppStackNav.Screen name={Routes.Features.Pet} component={PetScreen} />
      <AppStackNav.Screen name={Routes.Features.Wallet} component={WalletScreen} />

      {/* Feature Sub-screens (NEW) */}
      <AppStackNav.Screen name={Routes.Features.Hub} component={FeaturesHubScreen} />
      <AppStackNav.Screen name={Routes.Features.ViralMilestones} component={ViralMilestonesScreen} />
      <AppStackNav.Screen name={Routes.Features.Leaderboard} component={LeaderboardScreen} />
      <AppStackNav.Screen name={Routes.Features.MemoryLane} component={MemoryLaneScreen} />
      <AppStackNav.Screen name={Routes.Features.AIReport} component={AIReportScreen} />
      <AppStackNav.Screen name={Routes.Features.VirtualBank} component={VirtualBankScreen} />
      <AppStackNav.Screen name={Routes.Features.MemoryLanePremium} component={MemoryLanePremiumScreen} />
      <AppStackNav.Screen name={Routes.Features.BedtimeStories} component={BedtimeStoriesScreen} />
      <AppStackNav.Screen name={Routes.Features.ChildBedtimeStories} component={ChildBedtimeStoriesScreen} />
      <AppStackNav.Screen name={Routes.Features.ParentBedtimeStories} component={ParentBedtimeStoriesScreen} />
      <AppStackNav.Screen name={Routes.Features.CoParenting} component={CoParentingScreen} />
      <AppStackNav.Screen name={Routes.Features.MultiStepTask} component={MultiStepTaskScreen} />
      <AppStackNav.Screen name={Routes.Features.PetEvolution} component={PetEvolutionScreen} />
    </AppStackNav.Navigator>
  );
};
