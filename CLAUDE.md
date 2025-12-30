# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HealthyCatLitter.com is a satellite site designed to drive traffic to **Purrify** (purrify.ca), a cat litter odor control product. The site provides cat litter health information with strategic contextual links to Purrify.

**Site URL**: https://healthycatlitter.com

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Production build to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

### Framework
- **Astro 5** with static site generation
- **CSS Modules** for component styling (no Tailwind)
- **TypeScript** with strict mode

### Directory Structure
```
src/
├── components/          # Reusable Astro components
│   └── seo/            # Schema.org structured data components
├── layouts/            # BaseLayout.astro (single layout)
├── pages/              # File-based routing
│   ├── conditions/     # Health topic pages (7 pages)
│   └── ingredients/    # Ingredient guide pages
├── styles/             # global.css + fonts.css
└── fonts/              # Self-hosted WOFF2 fonts
```

### Key Components
- **BaseLayout.astro** - Wraps all pages with head meta, Header, Footer, WebsiteSchema
- **SafetyRating.astro** - Visual concern indicator (Lower/Some/Higher/Significant)
- **DisclaimerBox.astro** - Legal disclaimers (general/affiliate types)
- **CitationBlock.astro** - Academic reference formatting
- **SEO components** - WebsiteSchema, FAQSchema, ArticleSchema, ProductSchema

### Styling System
Uses CSS custom properties defined in `src/styles/global.css`:
- Primary color: `--color-primary: #1a5f7a` (medical blue)
- Fonts: Merriweather (headings) + Open Sans (body)
- Container widths: `--max-width: 1200px`, `--max-width-content: 800px`

## Critical Requirements

### Legal Compliance
All content must maintain these safeguards:
- **Never use** "Vet-Approved", "Veterinary-Informed", or similar authoritative language
- **Use opinion-based framing**: "Some Concerns", "What Some Owners Report"
- **Include disclaimers** on every page: "We are not veterinarians"
- **No medical directives** like "seek emergency care"

### Purrify Integration
Every page should include 3-6 contextual links to Purrify with:
- UTM parameters: `?utm_source=healthycatlitter&utm_medium=[page-name]`
- External link attributes: `target="_blank" rel="noopener noreferrer"`

Key Purrify pages to link:
- `/products`, `/products/trial-size`, `/products/standard`, `/products/family-pack`
- `/learn/how-it-works`, `/learn/science`, `/learn/activated-carbon-benefits`

### SEO Checklist for New Pages
- Unique `<title>` via BaseLayout title prop
- Unique `description` meta via BaseLayout description prop
- Single `<h1>` per page
- Add appropriate Schema component (Article, FAQ, or Product)
- Include canonical URL (automatic via BaseLayout)
