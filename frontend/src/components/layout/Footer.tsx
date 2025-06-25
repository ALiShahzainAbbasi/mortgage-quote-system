
import { Calculator } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rose-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Calculator className="h-6 w-6" />
            <span className="text-xl font-bold">Rose Brokers</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium mb-2">Quick Links</h3>
              <ul className="space-y-1 text-rose-100 text-sm">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/login" className="hover:underline">Login</a></li>
                <li><a href="/register" className="hover:underline">Register</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Contact</h3>
              <ul className="space-y-1 text-rose-100 text-sm">
                <li>Email: contact@rosebrokers.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Finance St, City</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-rose-800 text-center text-sm text-rose-200">
          <p>&copy; {new Date().getFullYear()} Rose Brokers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
