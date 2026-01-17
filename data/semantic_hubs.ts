import { LucideIcon, Video, Mic, Code, Database, Scale, Layers } from 'lucide-react';

export interface SemanticHub {
    slug: string;
    title: string;
    description: string;
    icon: any; // LucideIcon
    subIntents: {
        title: string;
        description: string;
        queryTags: string[]; // Tags to filter tools by for this specific user intent
        href: string; // Internal link to a filtered view or sub-page
    }[];
    relatedGuides: {
        title: string;
        href: string;
    }[];
}

export const semanticHubs: Record<string, SemanticHub> = {
    'generative-video': {
        slug: 'generative-video',
        title: 'Generative Video AI',
        description: 'The complete ecosystem of AI tools for video creation, editing, and animation. From text-to-video to AI avatars.',
        icon: Video,
        subIntents: [
            {
                title: 'Text to Video',
                description: 'Generate complete video scenes from simple text prompts.',
                queryTags: ['text-to-video', 'generator', 'sora-alternative'],
                href: '/use-case/text-to-video'
            },
            {
                title: 'AI Avatars',
                description: 'Create realistic talking heads and virtual presenters.',
                queryTags: ['avatar', 'talking-head', 'presenter'],
                href: '/use-case/ai-avatars'
            },
            {
                title: 'Video Editing',
                description: 'Automate cutting, captioning, and post-production.',
                queryTags: ['video-editing', 'captions', 'repurposing'],
                href: '/use-case/video-editing'
            },
            {
                title: 'Animation',
                description: 'Turn static images into motion or create 3D animations.',
                queryTags: ['animation', '3d', 'motion'],
                href: '/use-case/animation'
            }
        ],
        relatedGuides: [
            { title: 'Sora vs Runway Gen-2: The Battle for Video AI', href: '/compare/sora-vs-runway' },
            { title: 'Best AI Video Generators for Marketing 2024', href: '/blog/best-video-generators' }
        ]
    },
    'voice-synthesis': {
        slug: 'voice-synthesis',
        title: 'Voice Synthesis & Cloning',
        description: 'AI tools for text-to-speech, realistic voice cloning, and audio post-production.',
        icon: Mic,
        subIntents: [
            {
                title: 'Text to Speech (TTS)',
                description: 'Convert written content into lifelike spoken audio.',
                queryTags: ['text-to-speech', 'tts', 'voiceover'],
                href: '/use-case/text-to-speech'
            },
            {
                title: 'Voice Cloning',
                description: 'Clone your own voice or any other voice with high fidelity.',
                queryTags: ['voice-cloning', 'deepfake', 'custom-voice'],
                href: '/use-case/voice-cloning'
            },
            {
                title: 'Audio Enhancement',
                description: 'Remove background noise and improve audio quality.',
                queryTags: ['audio-enhancement', 'noise-reduction'],
                href: '/use-case/audio-enhancement'
            }
        ],
        relatedGuides: [
            { title: 'ElevenLabs vs PlayHT: Best Voice AI?', href: '/compare/elevenlabs-vs-playht' },
            { title: 'Is Voice Cloning Legal? (2025 Guide)', href: '/blog/voice-cloning-legality' }
        ]
    },
    'llm-vector-db': {
        slug: 'llm-vector-db',
        title: 'LLM & Vector Databases',
        description: 'Infrastructure and models for building AI applications. The developer\'s hub for RAG and LLM ops.',
        icon: Database,
        subIntents: [
            {
                title: 'Vector Stores',
                description: 'Databases optimized for high-dimensional vector embeddings.',
                queryTags: ['vector-db', 'pinecone', 'chroma'],
                href: '/use-case/vector-databases'
            },
            {
                title: 'LLM Frameworks',
                description: 'Tools for chaining prompts and managing LLM context.',
                queryTags: ['langchain', 'llamaindex', 'framework'],
                href: '/use-case/llm-frameworks'
            },
            {
                title: 'Open Source Models',
                description: 'Self-hosted LLMs that you can run locally or on private cloud.',
                queryTags: ['open-source', 'mistral', 'llama'],
                href: '/use-case/open-source-llms'
            }
        ],
        relatedGuides: [
            { title: 'Pinecone vs Weaviate: Choosing a Vector DB', href: '/compare/pinecone-vs-weaviate' },
            { title: 'How to Build a RAG Chatbot', href: '/blog/build-rag-chatbot' }
        ]
    }
};
