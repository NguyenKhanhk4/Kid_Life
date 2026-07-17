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
  Modal: {
    Dialog: 'DialogScreen',
    Confirmation: 'ConfirmationScreen',
    ImagePreview: 'ImagePreviewScreen',
  },
} as const;
