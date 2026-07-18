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
      <AppStackNav.Screen name="PetScreen" component={PetScreen as any} />
    </AppStackNav.Navigator>
  );
};
