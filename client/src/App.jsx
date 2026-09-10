import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Dashboard from './pages/app/Dashboard';
import Employees from './pages/app/Employees';
import AddEmployee from './pages/app/AddEmployee';
import EditEmployee from './pages/app/EditEmployee';
import Vendors from './pages/app/Vendors';
import AddVendor from './pages/app/AddVendor';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Attendance from './pages/app/Attendance';
import Payroll from './pages/app/Payroll';
import Leave from './pages/app/Leave';
import Expenses from './pages/app/Expenses';
import Documents from './pages/app/Documents';
import Reports from './pages/app/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected app routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Employees />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AddEmployee />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditEmployee />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Vendors />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/add"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AddVendor />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Attendance />
              </AppLayout>
           </ProtectedRoute>
         }
       />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Payroll />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Leave />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Expenses />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Documents />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;