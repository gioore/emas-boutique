import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium" style={{ backgroundColor: '#d4a373', color: '#ffffff' }}>
        Saltar al contenido principal
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  );
}
