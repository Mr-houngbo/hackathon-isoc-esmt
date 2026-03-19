import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
    <Navbar />
    <main className="flex-1 pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
