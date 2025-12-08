// app/layout.jsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CSBS Department Budget System",
  description: "Academic and financial management for departmental expenses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Sidebar />
        <Header />

        {/* Page Container */}
        <main className="ml-64 px-8 py-6 min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
