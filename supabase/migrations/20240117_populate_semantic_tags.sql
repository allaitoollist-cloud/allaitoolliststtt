-- Semantic Tagging & Categorization for Key Tools
-- This migration populates the database with the tags required for the new "Hub" pages to function immediately.

-- 1. Generative Video Tools
UPDATE tools 
SET 
  category = 'Generative Video',
  tags = array_cat(tags, ARRAY['text-to-video', 'video-editing', 'sora-alternative']),
  pricing_model = 'Freemium',
  user_type = array_cat(user_type, ARRAY['Creative', 'Marketing'])
WHERE name ILIKE '%Runway%' OR name ILIKE '%Pika%' OR name ILIKE '%Sora%' OR name ILIKE '%Kaiber%';

UPDATE tools 
SET 
  category = 'Generative Video',
  tags = array_cat(tags, ARRAY['avatar', 'talking-head', 'presenter']),
  pricing_model = 'Paid',
  user_type = array_cat(user_type, ARRAY['Business', 'Marketing'])
WHERE name ILIKE '%HeyGen%' OR name ILIKE '%Synthesia%' OR name ILIKE '%D-ID%';

-- 2. Voice Synthesis Tools
UPDATE tools 
SET 
  category = 'Voice Synthesis',
  tags = array_cat(tags, ARRAY['text-to-speech', 'voice-cloning', 'tts']),
  has_api = true,
  pricing_model = 'Freemium'
WHERE name ILIKE '%ElevenLabs%' OR name ILIKE '%PlayHT%' OR name ILIKE '%Murf%';

UPDATE tools 
SET 
  category = 'Voice Synthesis',
  tags = array_cat(tags, ARRAY['audio-enhancement', 'podcast']),
  pricing_model = 'Freemium'
WHERE name ILIKE '%Adobe Podcast%' OR name ILIKE '%Descript%';

-- 3. LLM & Vector DB Infrastructure
UPDATE tools 
SET 
  category = 'LLM & Vector DB',
  tags = array_cat(tags, ARRAY['vector-db', 'database', 'rag']),
  has_api = true,
  user_type = array_cat(user_type, ARRAY['Developer', 'Enterprise'])
WHERE name ILIKE '%Pinecone%' OR name ILIKE '%Weaviate%' OR name ILIKE '%Chroma%' OR name ILIKE '%Milvus%';

UPDATE tools 
SET 
  category = 'LLM & Vector DB',
  tags = array_cat(tags, ARRAY['framework', 'llm-ops', 'langchain']),
  has_api = true,
  user_type = array_cat(user_type, ARRAY['Developer'])
WHERE name ILIKE '%LangChain%' OR name ILIKE '%LlamaIndex%';

-- 4. General Cleanup: Ensure popular tools have at least one valid tag from our new list
-- This ensures 'search' works better for these terms
UPDATE tools 
SET tags = array_append(tags, 'chat-interface') 
WHERE name ILIKE '%ChatGPT%' OR name ILIKE '%Claude%' AND NOT ('chat-interface' = ANY(tags));

UPDATE tools 
SET tags = array_append(tags, 'image-generator') 
WHERE name ILIKE '%Midjourney%' OR name ILIKE '%DALL-E%' AND NOT ('image-generator' = ANY(tags));
