import { Routes, Route } from 'react-router-dom';

import AuthPage from './components/AuthPage.tsx';
import DashboardPage from './components/DashboardPage.tsx';
import EditProfilePage from './components/EditProfilePage.tsx';
import InitialPage from './components/InitialPage.tsx';
import MatchesPage from './components/MatchesPage.tsx';

export const App = () => {
  return (
    <Routes>
      {/* Pages of the application. */}
      <Route path="/" element={<InitialPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
    </Routes>
  );
};
