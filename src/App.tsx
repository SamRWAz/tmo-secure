import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GuardianProvider } from './context/GuardianContext'
import { ReadingHistoryProvider } from './context/ReadingHistoryContext'
import { UserProvider } from './context/UserContext'
import { Layout } from './components/Layout'
import { GuardianCat } from './components/GuardianCat'
import { SecurityBunker } from './components/SecurityBunker'
import { HomePage } from './pages/HomePage'
import { MangaDetailPage } from './pages/MangaDetailPage'
import { ReaderPage } from './pages/ReaderPage'
import { GuardianSettingsPage } from './pages/GuardianSettingsPage'
import { AccountPage } from './pages/AccountPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <UserProvider>
    <GuardianProvider>
      <ReadingHistoryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="manga/:id" element={<MangaDetailPage />} />
            <Route path="manga/:id/read/:chapterId" element={<ReaderPage />} />
            <Route path="guardian" element={<GuardianSettingsPage />} />
            <Route path="cuenta" element={<AccountPage />} />
            <Route path="acerca" element={<AboutPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <GuardianCat />
        <SecurityBunker />
      </BrowserRouter>
      </ReadingHistoryProvider>
    </GuardianProvider>
    </UserProvider>
  )
}
