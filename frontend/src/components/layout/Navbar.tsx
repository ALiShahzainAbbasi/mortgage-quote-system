import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Calculator className="h-6 w-6" />
          <span className="text-xl font-bold">Rose Brokers</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:block text-sm">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </div>
              <Link to="/dashboard">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/products">
                  <Button variant="secondary" size="sm">Admin</Button>
                </Link>
              )}
              {user?.role === 'broker' && (
                <Link to="/admin/products">
                  <Button variant="secondary" size="sm">Products</Button>
                </Link>
              )}
              <Button className="bg-white text-rose-900 border border-rose-700 hover:bg-rose-50" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-rose-900 border border-rose-700 hover:bg-rose-50">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
