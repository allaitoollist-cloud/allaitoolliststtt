# The AllAiToolList Technical SEO Standards (2025)
*Mandatory Compliance Checklist for all Code & Content*

## 1. Core Web Vitals & Technical Health
*   **CLS (Cumulative Layout Shift) Zero Tolerance**:
    *   ALL images must have explicit `width` and `height` attributes.
    *   Use `<div className="aspect-video relative">` containers for dynamic content loading.
*   **LCP (Largest Contentful Paint)**:
    *   The H1 and Hero Image must be static HTML (server-rendered), not client-side pointers.
    *   Preload the LCP image in `head` if possible.

## 2. Semantic Hierarchy & Metadata
*   **Title Tags**:
    *   Format: `[Primary Keyword] - [Secondary Context] | AllAiToolList`
    *   Max Length: 60 chars.
    *   Example: `Best AI Video Generators - 4K Text-to-Video Reviews (2025)`
*   **H1 Tags**:
    *   Must match the `Title` intent but can be longer/more descriptive.
    *   **Strictly ONE H1 per page.**
*   **Headings (H2-H6)**:
    *   Never skip levels (e.g., H2 -> H4 is forbidden).
    *   H2s are for Main Sections, H3s for subsection specific features.

## 3. Schema Markup (The Knowledge Graph)
*   **Entities**: Every page must define its primary entity via JSON-LD.
    *   Tool Pages -> `SoftwareApplication`
    *   Blog Posts -> `TechArticle`
    *   Hub Pages -> `CollectionPage`
*   **Authorship**: All content must link to an `author` profile with `sameAs` links to LinkedIn/Twitter.

## 4. URL Structure
*   **Clean & Flat**: `/hub/slug`, `/review/slug`.
*   **No Stop Words**: Remove 'and', 'the', 'of'.
*   **Hyphenated**: `best-ai-video-generators`, not `best_ai_video_generators`.

## 5. E-E-A-T Enforcement (Frontend)
*   **"I Tested This" Badge**: Frontend must visually display a "Verified Test" badge if the backend data confirms it.
*   **Author Bylines**: Must appear ABOVE the fold on all articles.
*   **Last Updated**: Explicitly show the `last_updated` date near the title.
