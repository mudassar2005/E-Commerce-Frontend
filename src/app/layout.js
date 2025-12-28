import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";
import CartSidebar from "@/components/pages/common/cart-sidebar";
import Navbar from "@/components/nav-bar/nav-bar";
import Footer from "@/components/footer/footer";

export const metadata = {
  title: "StyleHub - Fashion & Clothing Marketplace",
  description: "Shop the latest fashion trends and clothing from multiple vendors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AlertProvider>
          <AuthProvider>
            <ProductsProvider>
              <WishlistProvider>
                <CompareProvider>
                  <CartProvider>
                    <Navbar />
                    {children}
                    <Footer />
                    <CartSidebar />
                  </CartProvider>
                </CompareProvider>
              </WishlistProvider>
            </ProductsProvider>
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
