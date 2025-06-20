import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import UserForm from './components/userform';
import ProductTable from './components/producttable';
import Order from './components/order';

function App() {
  return (
    <Router>
      <>
        {/* Navegación */}
        <nav>
          <ul>
            <li><Link to="/userform">User Form</Link></li>
            <li><Link to="/producttable">Product Table</Link></li>
            <li><Link to="/order">Order</Link></li>
          </ul>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/userform" element={<UserForm />} />
          <Route path="/producttable" element={<ProductTable />} />
          <Route path="/order" element={<Order />} />
        </Routes>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </Router>
  );
}

export default App;
