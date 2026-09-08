import { useEffect, useState } from 'react';
import { getVendors } from '../../services/vendorService';
import { Link } from 'react-router-dom';

function Vendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors()
      .then((res) => setVendors(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Vendors</h1>
      <Link to="/vendors/add">+ Add Vendor</Link>
      <ul>
        {vendors.map((v) => (
          <li key={v.id}>
            {v.name} — {v.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Vendors;