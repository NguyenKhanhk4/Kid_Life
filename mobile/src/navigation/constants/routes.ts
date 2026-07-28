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
  Features: {
    Hub: 'FeaturesHubScreen',
    ViralMilestones: 'ViralMilestonesScreen',
    Leaderboard: 'LeaderboardScreen',
    MemoryLane: 'MemoryLaneScreen',
    AIReport: 'AIReportScreen',
    VirtualBank: 'VirtualBankScreen',
    MemoryLanePremium: 'MemoryLanePremiumScreen',
    BedtimeStories: 'BedtimeStoriesScreen',
    ChildBedtimeStories: 'ChildBedtimeStoriesScreen',
    ParentBedtimeStories: 'ParentBedtimeStoriesScreen',
    CoParenting: 'CoParentingScreen',
    MultiStepTask: 'MultiStepTaskScreen',
    PetEvolution: 'PetEvolutionScreen',
  },
  Modal: {
    Dialog: 'DialogScreen',
    Confirmation: 'ConfirmationScreen',
    ImagePreview: 'ImagePreviewScreen',
  },
} as const;
