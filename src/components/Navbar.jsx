import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, loginConGoogle, logout } = useContext(AuthContext);

  return (
    <nav className="bg-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-widest hover:text-red-200 transition">
          对对对
        </Link>

        {/* Enlaces y Login */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-red-200 transition font-medium">Inicio</Link>
          
          {user && (
            <Link to="/mis-mazos" className="hover:text-red-200 transition font-medium">Mis Mazos</Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l border-red-500 pl-4">
              <span className="text-sm font-semibold">{user.nombre}</span>
              <button 
                onClick={logout} 
                className="bg-red-800 px-3 py-1.5 rounded hover:bg-red-900 transition text-sm"
              >
                Salir
              </button>
            </div>
          ) : (
            <button 
              onClick={loginConGoogle} 
              className="bg-white text-red-700 px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition shadow-sm ml-2"
            >
              Ingresar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;