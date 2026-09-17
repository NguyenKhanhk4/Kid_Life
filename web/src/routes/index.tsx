import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RoleSelectionPage from '@/modules/auth/pages/RoleSelectionPage';
import AdminDashboard from '@/modules/admin/pages/AdminDashboard';
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

import ChildLayout from '@/layouts/ChildLayout';
import ChildHomePage from '@/modules/child/pages/ChildHomePage';
import ChildTasksPage from '@/modules/child/pages/ChildTasksPage';
import ChildWalletPage from '@/modules/child/pages/ChildWalletPage';
import ChildPetPage from '@/modules/child/pages/ChildPetPage';
import ChildAccountPage from '@/modules/child/pages/ChildAccountPage';
import ChildStoriesPage from '@/modules/child/pages/ChildStoriesPage';
import ChildWishesPage from '@/modules/child/pages/ChildWishesPage';
import LessonLibraryPage from '@/modules/lesson/pages/LessonLibraryPage';
import QuizPage from '@/modules/quiz/pages/QuizPage';
import QuizResultPage from '@/modules/quiz/pages/QuizResultPage';
import { usePermission } from '@/modules/auth/usePermission';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = usePermission();
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

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Parent */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ParentHomePage />} />
          <Route path="tasks" element={<ParentTasksPage />} />
          <Route path="community" element={<ParentCommunityPage />} />
          <Route path="account" element={<ParentAccountPage />} />
          <Route path="approval" element={<ParentApprovalPage />} />
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
          <Route path="wallet" element={<ChildWalletPage />} />
          <Route path="pet" element={<ChildPetPage />} />
          <Route path="account" element={<ChildAccountPage />} />
          <Route path="stories" element={<ChildStoriesPage />} />
          <Route path="wishes" element={<ChildWishesPage />} />
          <Route path="lessons" element={<LessonLibraryPage />} />
          <Route path="quiz/:quizId" element={<QuizPage />} />
          <Route path="quiz-result" element={<QuizResultPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
