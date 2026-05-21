import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BuilderPage from './pages/BuilderPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SportSelectionPage from './pages/SportSelectionPage'
import TemplateSelectionPage from './pages/TemplateSelectionPage'
import useStore from './store/useStore'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/sports" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sports" 
          element={
            <ProtectedRoute>
              <SportSelectionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/templates/:sport" 
          element={
            <ProtectedRoute>
              <TemplateSelectionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/builder/:productId" 
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/builder" 
          element={
            <ProtectedRoute>
              <Navigate to="/sports" replace />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

