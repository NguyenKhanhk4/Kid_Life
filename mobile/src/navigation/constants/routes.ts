export const Routes = {
  Root: {
    Splash: 'SplashScreen',
  },
  Auth: {
    Onboarding: 'OnboardingScreen',
    Login: 'LoginScreen',
    Register: 'RegisterScreen',
    ForgotPassword: 'ForgotPasswordScreen',
    OTP: 'OTPScreen',
    ResetPassword: 'ResetPasswordScreen',
    RoleSelection: 'RoleSelectionScreen',
  },
  Main: {
    Home: 'HomeScreen',
    Tasks: 'TasksScreen',
    Community: 'CommunityScreen',
    Notifications: 'NotificationsScreen',
    Profile: 'ProfileScreen',
  },
  // Sub-screens (pushed onto AppStack)
  Profile: {
    ChildManagement: 'ChildManagementScreen',
    AddChild: 'AddChildScreen',
    EditChild: 'EditChildScreen',
    ChildDetail: 'ChildDetailScreen',
    ParentProfile: 'ParentProfileScreen',
    Settings: 'SettingsScreen',
    ChangePassword: 'ChangePasswordScreen',
  },
  Parent: {
    ApprovalQueue: 'ApprovalQueueScreen',
    ApprovalDetail: 'ApprovalDetailScreen',
  },
  Lesson: {
    Library: 'LessonLibraryScreen',
    Detail: 'LessonDetailScreen',
  },
  Quiz: {
    Play: 'QuizScreen',
    Result: 'QuizResultScreen',
  },
  Mission: {
    Detail: 'MissionDetailScreen',
    Create: 'CreateMissionScreen',
    AIVideoPrompt: 'AIVideoPromptScreen',
    AIVideoStatus: 'AIVideoStatusScreen',
  },
  Reward: {
    Shop: 'RewardShopScreen',
  },
  Modal: {
    Dialog: 'DialogScreen',
    Confirmation: 'ConfirmationScreen',
    ImagePreview: 'ImagePreviewScreen',
  },
} as const;
