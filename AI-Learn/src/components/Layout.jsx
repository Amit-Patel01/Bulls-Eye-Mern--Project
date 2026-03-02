import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, user, onSignOut }) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar user={user} onSignOut={onSignOut} />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      
    </div>
  );
}