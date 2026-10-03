
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Menu,
  X,
  LogOut,
  Plus,
  ShoppingCart,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Layout,
  Crown,
  Brain,
  Dumbbell,
} from "lucide-react";
import Image from "next/image";

interface NavLink {
  name: string;
  to: string;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // ── Scroll-driven shrink ──
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Blocca lo scroll quando il menu è aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks: NavLink[] = [
    { name: "Funzionalità", to: "/#features" },
    { name: "Piani", to: "/#pricing" },
    { name: "Programmi", to: "/programs" },
    { name: "Guida", to: "/guide" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div
          className={`w-full bg-zinc-950/90 backdrop-blur-xl border border-white/10 pointer-events-auto transition-all duration-300 ${
            scrolled
              ? 'max-w-5xl mx-4 mt-4 rounded-full px-3 sm:px-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
              : 'max-w-7xl mx-4 mt-3 rounded-[2rem] px-4 sm:px-6 lg:px-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
          }`}
        >
          <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="shrink-0 relative z-50">
            <Link
              to="/"
              className="group flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/maxthenics.png"
                alt="Maxthenics"
                width={28}
                height={28}
                className="h-7 w-auto"
                priority
              />
              <span className="text-base sm:text-xl font-black tracking-tighter text-white group-hover:text-red-500 transition-colors duration-300">
                MAX
                <span className="text-red-600 group-hover:text-white transition-colors duration-300">
                  THENICS
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden nav:flex items-center space-x-5 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors relative group px-2 py-1"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1.5 text-zinc-400 hover:text-white transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-linear-to-tr from-red-600 to-orange-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-zinc-950 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-3 lg:pl-4 border-l border-white/10"
                  >
                    <div className="flex items-center gap-1.5">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-full object-cover border-2 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                          <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-10 mt-1 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="p-4 border-b border-white/10">
                        <p className="font-bold text-white text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/my-program"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Layout className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            Il mio Programma
                          </span>
                        </Link>
                        <Link
                          to="/my-workouts"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Dumbbell className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-zinc-300">
                            I Miei Workout
                          </span>
                        </Link>
                        <Link
                          to="/purchase-history"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            I Miei Acquisti
                          </span>
                        </Link>
                        <Link
                          to="/calisthenics-room"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Crown className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-zinc-300">
                            Coaching Elite
                          </span>
                        </Link>
                        <Link
                          to="/create"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Plus className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            Crea Programma
                          </span>
                        </Link>
                        <Link
                          to="/chat"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Brain className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            Chat AI
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                            navigate("/login");
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-red-600/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">Esci</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5"
              >
                ACCEDI
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex nav:hidden items-center gap-2 relative z-50">
            <Link
              to="/cart"
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-zinc-400 hover:text-white p-2 transition-transform active:scale-90"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-7 w-7 text-white" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 nav:hidden bg-zinc-950 overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1)_0%,transparent_50%)] pointer-events-none" />

          <div className="relative z-10 min-h-screen flex flex-col">
            <div className="flex-1 px-6 pt-24 pb-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.to}
                    className="block py-3 text-2xl sm:text-3xl font-black text-white hover:text-red-500 transition-colors uppercase tracking-tighter"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 px-6 pb-8 space-y-4 bg-zinc-950">
              {user ? (
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                        <UserIcon size={18} className="text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none mb-0.5">
                          Livello Atleta
                        </p>
                        <p className="text-base font-bold text-white truncate">
                          {user.name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        to="/create"
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[11px] font-bold border border-white/10 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <Plus size={15} />
                        CREA
                      </Link>
                      <Link
                        to="/my-workouts"
                        className="flex items-center justify-center gap-2 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl text-[11px] font-bold border border-red-500/20 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <Dumbbell size={15} />
                        WORKOUT
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-500 rounded-xl text-[11px] font-bold border border-red-500/20 transition-all"
                      >
                        <LogOut size={15} />
                        LOGOUT
                      </button>
                    </div>
                  </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl shadow-red-900/40"
                    onClick={() => setIsOpen(false)}
                  >
                    Inizia Ora
                  </Link>
                </div>
              )}
              <p className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                Maxthenics
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export default Navbar;
