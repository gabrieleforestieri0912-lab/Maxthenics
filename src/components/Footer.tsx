import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface IconProps {
  size?: number | string;
}

const InstagramIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);



const YoutubeIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

interface FooterLink {
  name: string;
  to: string;
}

interface FooterLinks {
  protocolli: FooterLink[];
  risorse: FooterLink[];
  legale: FooterLink[];
}

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks: FooterLinks = {
    protocolli: [
      { name: "Tutti i Programmi", to: "/programs" },
      { name: "Front Lever", to: "/programs" },
      { name: "Planche", to: "/programs" },
      { name: "Personalizzato", to: "/create" },
    ],
    risorse: [
      { name: "Guida Tecnica", to: "/guide" },
      { name: "Chat AI", to: "/chat" },
      { name: "Calisthenics Room", to: "/calisthenics-room" },
      { name: "FAQ", to: "/#faq" },
      { name: "Contattaci", to: "/feedback" },
    ],
    legale: [
      { name: "Privacy Policy", to: "/privacy" },
      { name: "Termini di Servizio", to: "/terms" },
      { name: "Cookie Policy", to: "/privacy" },
    ],
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-20 lg:pt-28 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-75 bg-red-600/5 blur-[80px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <Image
                src="/maxthenics.png"
                alt="Maxthenics"
                width={32}
                height={32}
                className="h-8 sm:h-10 w-auto group-hover:scale-110 transition-transform duration-500"
                priority
              />
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                MAX<span className="text-red-600">THENICS</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm leading-relaxed font-medium">
              La prima piattaforma neurale dedicata all&apos;eccellenza nel
              Calisthenics. Progettata per atleti che non accettano limiti e
              puntano alla maestria del movimento.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <InstagramIcon size={16} />, href: "https://www.instagram.com/maxthenics" },
                { icon: <YoutubeIcon size={16} />, href: "https://www.youtube.com/@maxthenics" },
                {
                  icon: <Mail size={16} />,
                  href: "mailto:info@maxthenics.com",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-red-500/50 hover:bg-red-600/10 transition-all group"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6">
              Protocolli
            </h4>
            <ul className="space-y-3">
              {footerLinks.protocolli.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors flex items-center group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={10}
                      className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Risorse
            </h4>
            <ul className="space-y-3">
              {footerLinks.risorse.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors flex items-center group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={10}
                      className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Legale
            </h4>
            <ul className="space-y-3">
              {footerLinks.legale.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors flex items-center group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={10}
                      className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              © {currentYear} Maxthenics
            </p>
          </div>
        </div>

        {/* Decorative Tech Detail */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-24 bg-linear-to-r from-transparent via-zinc-800 to-transparent rounded-full" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
