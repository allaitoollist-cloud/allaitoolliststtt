-- Add Automation category
INSERT INTO categories (name, slug, description, icon, color)
VALUES ('Automation', 'automation', 'AI tools for automating tasks and workflows', '🤖', '#6366f1')
ON CONFLICT (name) DO NOTHING;

-- Update Productivity description to not include automation if desired (optional)
-- UPDATE categories SET description = 'AI productivity tools' WHERE name = 'Productivity';
