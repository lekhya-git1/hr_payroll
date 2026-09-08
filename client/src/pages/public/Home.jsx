import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home Page (Public)</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}

export default Home;