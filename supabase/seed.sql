-- Seed data for AI Tool Directory
-- This will migrate your existing mock data to Supabase

-- Insert sample tools (from your existing data)
insert into tools (name, short_description, full_description, url, icon, category, tags, pricing, views, trending, featured, rating, review_count, platform)
values
  (
    'ChatGPT',
    'Advanced conversational AI for natural language understanding and generation.',
    'ChatGPT is an advanced language model that can understand and generate human-like text...',
    'https://chat.openai.com',
    'https://cdn.openai.com/chatgpt/images/apple-touch-icon.png',
    'Text',
    ARRAY['chatbot', 'nlp', 'writing'],
    'Freemium',
    15420,
    true,
    true,
    4.8,
    12500,
    ARRAY['Web', 'Mobile', 'API']
  ),
  (
    'Midjourney',
    'AI-powered image generation from text descriptions.',
    'Midjourney creates stunning images from text prompts using advanced AI...',
    'https://midjourney.com',
    'https://midjourney.com/apple-touch-icon.png',
    'Image',
    ARRAY['art', 'design', 'generation'],
    'Paid',
    12350,
    true,
    true,
    4.9,
    8700,
    ARRAY['Web']
  ),
  (
    'GitHub Copilot',
    'AI pair programmer that helps you write code faster.',
    'GitHub Copilot suggests code and entire functions in real-time...',
    'https://github.com/features/copilot',
    'https://github.githubassets.com/favicons/favicon.png',
    'Code',
    ARRAY['coding', 'autocomplete', 'development'],
    'Paid',
    9870,
    false,
    true,
    4.7,
    8900,
    ARRAY['Desktop', 'Browser Extension']
  );

-- You can add more tools here or run this after migrating all your data
