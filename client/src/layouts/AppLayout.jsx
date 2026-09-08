import Sidebar from '../components/Sidebar';

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
