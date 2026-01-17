-- Add Technical Attributes JSONB Column for EAV Architecture
-- This enables storing category-specific attributes (e.g., {"resolution": "4K"} vs {"voices": 120})
-- efficiently without creating sparse columns for every possible feature.

ALTER TABLE tools 
ADD COLUMN technical_attributes JSONB DEFAULT '{}'::jsonb;

-- Create GIN index for fast filtering on arbitrary JSON keys
CREATE INDEX tools_technical_attributes_idx ON tools USING GIN (technical_attributes);

-- Populate Initial EAV Data for Generative Video Tools (Sample Data)
UPDATE tools 
SET technical_attributes = '{
    "max_resolution": "4K",
    "generation_type": "Text-to-Video",
    "temporal_consistency": "High",
    "pricing_credits": "Freemium"
}'::jsonb
WHERE name ILIKE '%Runway%';

UPDATE tools 
SET technical_attributes = '{
    "max_resolution": "1080p",
    "generation_type": "Image-to-Video",
    "animation_style": "Anime",
    "discord_based": true
}'::jsonb
WHERE name ILIKE '%Pika%';

UPDATE tools 
SET technical_attributes = '{
    "lipsync_accuracy": "High",
    "languages": 140,
    "custom_avatar": true,
    "rendering_speed": "Real-time"
}'::jsonb
WHERE name ILIKE '%HeyGen%';

UPDATE tools 
SET technical_attributes = '{
    "voices_count": 120,
    "cloning_quality": "Ultra",
    "latency_ms": 400,
    "api_available": true
}'::jsonb
WHERE name ILIKE '%ElevenLabs%';
