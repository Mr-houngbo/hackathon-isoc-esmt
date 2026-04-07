import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingFeedbackButton from "@/components/feedback/FloatingFeedbackButton";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
    <Navbar />
    <main className="flex-1 pt-16 md:pt-28">
      {children}
    </main>
    <Footer />
    <FloatingFeedbackButton />
  </div>
);

export default Layout;
