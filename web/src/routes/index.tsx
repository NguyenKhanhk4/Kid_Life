import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RoleSelectionPage from '@/modules/auth/pages/RoleSelectionPage';
import ChildLoginPage from '@/modules/auth/pages/ChildLoginPage';
import AdminLayout from '@/modules/admin/pages/AdminLayout';
import AdminOverviewPage from '@/modules/admin/pages/AdminOverviewPage';
import AdminUsersPage from '@/modules/admin/pages/AdminUsersPage';
import AdminCommunityPage from '@/modules/admin/pages/AdminCommunityPage';
import AdminMasterDataPage from '@/modules/admin/pages/AdminMasterDataPage';
import AdminSubscriptionsPage from '@/modules/admin/pages/AdminSubscriptionsPage';
import AdminSettingsPage from '@/modules/admin/pages/AdminSettingsPage';
import AdminLogsPage from '@/modules/admin/pages/AdminLogsPage';
import AdminQuizBankPage from '@/modules/admin/pages/AdminQuizBankPage';
import AdminVideoBankPage from '@/modules/admin/pages/AdminVideoBankPage';
import ParentLayout from '@/layouts/ParentLayout';
import ParentHomePage from '@/modules/parent/pages/ParentHomePage';
import ParentTasksPage from '@/modules/parent/pages/ParentTasksPage';
import ParentCommunityPage from '@/modules/parent/pages/ParentCommunityPage';
import ParentAccountPage from '@/modules/parent/pages/ParentAccountPage';
import ParentApprovalPage from '@/modules/parent/pages/ParentApprovalPage';
import ParentBankPage from '@/modules/parent/pages/ParentBankPage';
import ParentAiAnalyticsPage from '@/modules/parent/pages/ParentAiAnalyticsPage';
import ParentStoryStudioPage from '@/modules/parent/pages/ParentStoryStudioPage';
import ParentMemoryLanePage from '@/modules/parent/pages/ParentMemoryLanePage';
import ParentQuizManagePage from '@/modules/parent/pages/ParentQuizManagePage';
import ParentVideoManagePage from '@/modules/parent/pages/ParentVideoManagePage';

import ChildLayout from '@/layouts/ChildLayout';
import ChildHomePage from '@/modules/child/pages/ChildHomePage';
import ChildTasksPage from '@/modules/child/pages/ChildTasksPage';
import ChildWalletPage from '@/modules/child/pages/ChildWalletPage';
import PetPage from '@/features/pet/components/PetPage';
import ChildAccountPage from '@/modules/child/pages/ChildAccountPage';
import ChildStoriesPage from '@/modules/child/pages/ChildStoriesPage';
import ChildWishesPage from '@/modules/child/pages/ChildWishesPage';
import QuizLibraryPage from '@/modules/quiz/pages/QuizLibraryPage';
import VideoLessonLibraryPage from '@/modules/video-lesson/pages/VideoLessonLibraryPage';
import VideoPlayerPage from '@/modules/video-lesson/pages/VideoPlayerPage';
import QuizPage from '@/modules/quiz/pages/QuizPage';
import QuizResultPage from '@/modules/quiz/pages/QuizResultPage';
import { usePermission } from '@/modules/auth/usePermission';
import { useAuth } from '@/modules/auth/AuthContext';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = usePermission();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang khôi phục phiên...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/parent" replace />;
  }
  
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/role" element={<RoleSelectionPage />} />
        <Route path="/child-login" element={<ChildLoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="community" element={<AdminCommunityPage />} />
          <Route path="master-data" element={<AdminMasterDataPage />} />
          <Route path="quiz-bank" element={<AdminQuizBankPage />} />
          <Route path="video-bank" element={<AdminVideoBankPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
        </Route>

        {/* Parent */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ParentHomePage />} />
          <Route path="tasks" element={<ParentTasksPage />} />
          <Route path="community" element={<ParentCommunityPage />} />
          <Route path="account" element={<ParentAccountPage />} />
          <Route path="approval" element={<ParentApprovalPage />} />
          <Route path="quiz-manage" element={<ParentQuizManagePage />} />
          <Route path="video-manage" element={<ParentVideoManagePage />} />
          <Route path="bank" element={<ParentBankPage />} />
          <Route path="ai-analytics" element={<ParentAiAnalyticsPage />} />
          <Route path="stories" element={<ParentStoryStudioPage />} />
          <Route path="memory-lane" element={<ParentMemoryLanePage />} />
        </Route>

        {/* Child */}
        <Route path="/child" element={<ChildLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ChildHomePage />} />
          <Route path="tasks" element={<ChildTasksPage />} />
          <Route path="video-lessons" element={<VideoLessonLibraryPage />} />
          <Route path="video-lessons/:videoId" element={<VideoPlayerPage />} />
          <Route path="quiz-library" element={<QuizLibraryPage />} />
          <Route path="quiz/:quizId" element={<QuizPage />} />
          <Route path="quiz-result" element={<QuizResultPage />} />
          <Route path="wallet" element={<ChildWalletPage />} />
          <Route path="pet" element={<PetPage />} />
          <Route path="account" element={<ChildAccountPage />} />
          <Route path="stories" element={<ChildStoriesPage />} />
          <Route path="wishes" element={<ChildWishesPage />} />
          <Route path="lessons" element={<Navigate to="/child/quiz-library" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
