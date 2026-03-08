'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { storeInfo } from '@/data/store-info';

const exploreLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Your Cart', href: '/cart' },
  { label: 'Account', href: '/account' },
];

const serviceLinks = [
  { label: 'Laptop & Desktop Sales', href: '/products' },
  { label: 'Repair & Hardware Upgrades', href: '/contact' },
  { label: 'Data Recovery & Software', href: '/contact' },
  { label: 'IT Support', href: '/contact' },
];

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Refund Policy', href: '/refund-policy' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-transparent" />

      {/* Background grid pattern */}
      <div className="footer-grid-bg absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <img
                src="/satya_computers_logo.png"
                alt="Satya Computers"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-heading text-2xl tracking-widest text-white group-hover:text-[var(--color-brand-primary)] transition-colors duration-200">
                SATYA<span className="text-[var(--color-brand-primary)]">COMPUTERS</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-8">
              {storeInfo.mission}
            </p>
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${storeInfo.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              id="footer-whatsapp-link"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#25D366]/40 text-[#25D366] text-sm font-heading tracking-widest hover:bg-[#25D366] hover:text-black transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="font-heading text-xs tracking-[0.25em] text-[var(--color-brand-primary)] mb-6 uppercase">
              Explore
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    id={`footer-explore-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[var(--color-brand-primary)] group-hover:w-3 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="font-heading text-xs tracking-[0.25em] text-[var(--color-brand-primary)] mb-6 uppercase">
              Services
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    id={`footer-service-${service.label.toLowerCase().replace(/[\s&/]+/g, '-')}`}
                    className="text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[var(--color-brand-primary)] group-hover:w-3 transition-all duration-200" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-heading text-xs tracking-[0.25em] text-[var(--color-brand-primary)] mb-6 uppercase">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-white/60 list-none p-0 m-0">
              <li className="flex items-start gap-3 border-b border-white/10 pb-5">
                <MapPin className="w-5 h-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-body">{storeInfo.address}</span>
              </li>
              {/* Highlighted Email Section */}
              <li className="pt-2">
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="flex items-center gap-3 text-white hover:text-[var(--color-brand-primary)] transition-colors duration-300 group font-bold no-underline"
                >
                  <div className="relative flex items-center justify-center p-1">
                    {/* Animated Pulsing Ring */}
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                    <Mail className="w-5 h-5 text-red-500 relative z-10" />
                  </div>
                  <span className="text-white text-base font-body tracking-wide border-b border-transparent group-hover:border-[var(--color-brand-primary)] transition-colors">{storeInfo.email}</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`tel:+91${storeInfo.phone}`}
                  id="footer-phone-link"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group no-underline font-body"
                >
                  <Phone className="w-4 h-4 text-white/50 group-hover:text-[var(--color-brand-primary)] transition-colors" />
                  +91 {storeInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${storeInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  id="footer-contact-whatsapp"
                  className="flex items-center gap-3 text-[var(--color-brand-primary)] hover:text-white transition-colors duration-200 font-semibold font-body no-underline"
                >
                  WhatsApp: +{storeInfo.whatsapp}
                </a>
              </li>
              <li className="pt-4 text-center sm:text-left">
                <Link
                  href="/contact"
                  id="footer-contact-page-link"
                  className="inline-block text-xs tracking-widest font-heading text-white border border-[var(--color-brand-primary)]/50 px-6 py-3 hover:bg-[var(--color-brand-primary)] hover:border-transparent hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(241,90,36,0.15)] hover:shadow-[0_0_30px_rgba(241,90,36,0.4)] no-underline"
                >
                  SEND A MESSAGE →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-body">
            © {new Date().getFullYear()} {storeInfo.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30 flex-wrap justify-center">
            {policyLinks.map((policy) => (
              <Link
                key={policy.href}
                href={policy.href}
                id={`footer-policy-${policy.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-[var(--color-brand-primary)] transition-colors duration-200"
              >
                {policy.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
