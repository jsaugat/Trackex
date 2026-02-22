import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-destructive/30">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block mb-8"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-destructive/20 blur-[60px] rounded-full" />

          <div className="relative bg-card border border-border/50 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-linear-to-br from-destructive/10 to-transparent rounded-[2.5rem]" />
            <ShieldAlert className="w-20 h-20 text-destructive relative z-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
        >
          Access Denied
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-lg mb-10 leading-relaxed px-4"
        >
          Oops! It looks like you don't have permission to access this page or
          organization. Please contact your administrator if you believe this is
          an error.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-4 rounded-2xl border border-border/50 transition-all duration-300 font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            to="/login"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-primary/10"
          >
            <Home className="w-5 h-5" />
            Return to Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16"
        >
          <span className="text-muted-foreground/40 text-xs font-mono tracking-widest uppercase">
            Error Code: 403 Forbidden
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default NotAuthorized;
