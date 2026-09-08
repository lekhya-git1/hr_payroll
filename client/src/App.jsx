import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Dashboard from './pages/app/Dashboard';
import Employees from './pages/app/Employees';
import Vendors from './pages/app/Vendors';
import AppLayout from './layouts/AppLayout';
import AddEmployee from './pages/app/AddEmployee';
import AddVendor from './pages/app/AddVendor';
import EditEmployee from './pages/app/EditEmployee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/employees"
          element={
            <AppLayout>
              <Employees />
            </AppLayout>
          }
        />
        <Route
          path="/employees/add"
          element={
            <AppLayout>
              <AddEmployee />
            </AppLayout>
          }
        />
        <Route
          path="/vendors"
          element={
            <AppLayout>
              <Vendors />
            </AppLayout>
          }
        />
        <Route
          path="/vendors/add"
          element={
            <AppLayout>
              <AddVendor />
            </AppLayout>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <AppLayout>
              <EditEmployee />
           </AppLayout>
         }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;