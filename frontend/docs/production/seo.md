# Search Engine Optimization (SEO)

## Strategy
While the core dating app is gated behind authentication, our landing pages, blog, and public profile shares are optimized for search engines.

## Key Implementations
- **Server-Side Rendering (SSR) / Static Site Generation (SSG)**: Public pages are pre-rendered for instant indexing.
- **Meta Tags**: Dynamic `title`, `description`, and `keywords` tags on all public routes.
- **Open Graph & Twitter Cards**: Fully populated metadata for rich link sharing (e.g., sharing a public event or blog post).
- **Sitemap**: Auto-generated `sitemap.xml` updated weekly.
- **Robots.txt**: Restricts indexing of private application routes (`/app/*`, `/messages/*`).
