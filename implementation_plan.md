# STONE & GOLD Implementation Plan

## Goal Description
Implement the STONE & GOLD template (Template 2 of 5) for Satya Computers. This is a Next.js application with a dark, premium aesthetic focusing on corporate professionals and premium buyers. It requires specific fonts (Bebas Neue, Raleway), colors (Dark Stone, Premium Gold, Warm Cream), CSS variables, and components (SplitHero, BrutalButton, ProductCard).

## Proposed Changes

### Setup
- Initialize Next.js app in `d:\Satya_Computers\satya-computers-gold`.
- Install `framer-motion`, `@fontsource/bebas-neue`, `@fontsource/raleway`.

### Styling
- **`app/globals.css`**: Define `--bg-primary`, `--color-gold`, etc.
- **`tailwind.config.ts`**: Extend colors (`brand.primary`, `brand.bg`, `brand.text`) and fonts (`heading`, `body`).

### Components
- **`components/ui/BrutalButton.tsx`**: Sharp corners, color-swap on hover.
- **`components/ui/GrainOverlay.tsx`**: SVG overlay with 40% opacity.
- **`components/ui/SectionNumber.tsx`**: Asymmetric section numbers.
- **`components/store/ProductCard.tsx`**: Dark product card with gold price and hover animation.
- **`components/layout/GoldNavBar.tsx`**: Black header with gold logo and gold underline hover.
- **`components/layout/AnnouncementBar.tsx`**: Gold background bar.
- **`components/sections/SplitHero.tsx`**: Left text, right solid gold panel with diagonal hatch.
- **`components/whatsapp/WhatsAppWidget.tsx`**: WhatsApp floating widget.

### Layout & Pages
- **`app/layout.tsx`**: Wrap with WhatsAppWidget and font imports.
- **`app/page.tsx`**: Construct Homepage combining AnnouncementBar, GoldNavBar, SplitHero, ProductGrid.

## Verification Plan
1. Ensure the app builds successfully.
2. Verify visual appearance matches the "Industrial luxury" theme (dark background, gold accents, sharp corners).
3. Test WhatsApp widget functionality.
