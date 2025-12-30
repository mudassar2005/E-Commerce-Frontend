import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";

export const metadata = {
  title: "Admin Panel - StyleHub",
  description: "StyleHub Admin Dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen">
      <AlertProvider>
        <AuthProvider>
          <ProductsProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  {/* No Navbar or Footer for admin panel */}
                  {children}
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </ProductsProvider>
        </AuthProvider>
      </AlertProvider>
    </div>
  );
}