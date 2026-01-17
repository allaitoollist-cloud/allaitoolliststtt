---
description: Run the Quantitative Density content audit script to check for 2025 SEO compliance.
---

1. Run the audit script to check tools in the database:
   ```bash
// turbo
   node scripts/audit_density.js
   ```

2. Review the output.
   - **Pass Rate < 80%?**: Initiatite a "Content Refactoring" sprint.
   - **Failures**: For every failed tool, edit the `full_description` in Supabase (or the CMS) to inject specific numbers into the first paragraph.
     - *Example:* Change "This is a video tool" to "Released in **2023**, this video tool renders **4K** at **$10/mo**".
