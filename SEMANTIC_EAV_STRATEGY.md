# Semantic SEO Strategy: The EAV (Entity-Attribute-Value) Architecture
*Based on the Holisitic SEO methodology of Koray Tuğberk GÜBÜR*

## 1. Core Philosophy: "Attribute-First" Indexing
Most SEOs focus on **Entities** (e.g., "Runway Gen-2"). We must focus on **Attributes** (e.g., "Temporal Consistency", "Pricing Model", "API Latency").
*   **The Theory:** Search engines cluster entities *around* attributes. If you cover the attribute "Motion Brush" deeply, you rank for all tools that have it.
*   **The Rule:** Do not just list tools. Discuss them through the lens of their specific attributes.

## 2. The EAV Data Model for AI Tools
We must structure our database and content to reflect this model.

| Entity (Object) | Attribute (Predicate) | Value (Object) | Contextual Vector |
| :--- | :--- | :--- | :--- |
| **Runway Gen-2** | **supports_resolution** | **4K** | Video Quality Standards |
| **Runway Gen-2** | **pricing_model** | **Freemium** | Cost Efficiency |
| **ElevenLabs** | **voice_cloning_latency** | **<400ms** | Real-time Interaction |
| **Midjourney** | **generation_method** | **Discord** | Accessibility / UX |

### 🛠️ Application:
*   **Database:** Our Supabase `tools` table needs to be the "Single Source of Truth" for these values.
*   **Content:** Every sentence in our reviews should function as a "Triple" (Subject-Predicate-Object).
    *   *Bad:* "Runway is great for video." (Vague)
    *   *Good (S-P-O):* "Runway Gen-2 (Subject) utilitzes (Predicate) the Gen-2 latent diffusion model (Object)."

## 3. Algorithmic Authorship & Templates
To achieve "Topical Authority," we must prove consistency to the search engine. We will use **Algorithmic Templates** for our tool pages.

### The "Tool Review" Contextual Vector
Every tool page must follow this strict **Contextual Flow**:

1.  **Definition Node:** What is [Entity]? (Define by its primary Function attribute).
2.  **Attribute Expansion:**
    *   *Pricing Attribute:* Specific constraints (Credits vs Seconds).
    *   *Performance Attribute:* Speed tests (Time to First Token/Frame).
    *   *Integration Attribute:* API status and Python SDK availability.
3.  **Comparative Node:** How does [Entity] compare to [Competitor] regarding [Key Attribute]?
4.  **Verdict Node:** Who is the exact User Persona (e.g., "Enterprise Developers" vs "Hobbyists")?

## 4. Textual Optimization Rules
*   **Information Responsiveness:** Every paragraph must answer a potential micro-question.
*   **Zero Fluff / Discordancy:** Remove words that disrupt the "Contextual Bridge". If we are talking about "Video Resolution," do not jump to "Customer Support" in the next sentence without a bridge (e.g., "Despite high resolution, users report issues contacting support...").
*   **Definition First:** Always define unique attributes before rating them. "Temporal Consistency is the ability of an AI to keep a character's face stable across frames. Runway excels at Temporal Consistency..."

## 5. Implementation Plan (Next Actions)
1.  **Attribute Audit:** Identify the "Root Attributes" for each Semantic Hub.
    *   *Video:* FPS, Resolution, Consistency, Style Transfer.
    *   *Audio:* Sample Rate (44.1kHz), Voices, Cloning Quality.
2.  **Refine Briefs:** Update our Content Briefs to mandate "S-P-O" sentence structures.
3.  **Supabase Expansion:** Ensure every "Key Attribute" has a column in our database for programmatic SEO (e.g., creating "Best 4K Video Generators" lists automatically).
