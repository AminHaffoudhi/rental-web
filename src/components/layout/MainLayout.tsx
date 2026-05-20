import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
