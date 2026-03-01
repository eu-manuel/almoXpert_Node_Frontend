import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EstoquePage from './pages/EstoquePage';
import WarehousePage from './pages/WarehousePage';
import SupplierPage from './pages/SupplierPage';
import MovementPage from './pages/MovementPage';

import { useContext } from 'react';
import { UserContext } from './context/UserContext';

function App() {
  const { user } = useContext(UserContext); // pega usuário do contexto

  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página de dashboard (privada) */}
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/items"
          element={user ? <EstoquePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/warehouses"
          element={user ? <WarehousePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/suppliers"
          element={user ? <SupplierPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/movements"
          element={user ? <MovementPage /> : <Navigate to="/login" />}
        />

        {/* Redireciona qualquer rota inválida para o login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
