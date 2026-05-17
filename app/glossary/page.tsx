import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { BookOpen, Search } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AI Glossary — 100+ AI Terms Explained | All AI Tool List',
    description: 'The complete AI glossary. Understand LLM, RAG, fine-tuning, embeddings, agents, and 100+ more AI terms in plain English.',
};

const TERMS = [
    { term: 'AGI', category: 'Core', def: 'Artificial General Intelligence — AI that can perform any intellectual task a human can. Not yet achieved.' },
    { term: 'Agent', category: 'Core', def: 'An AI system that autonomously takes actions, uses tools, and makes decisions to complete multi-step goals.' },
    { term: 'API', category: 'Technical', def: 'Application Programming Interface — a way for software to communicate. AI APIs let you send prompts and receive responses.' },
    { term: 'Attention Mechanism', category: 'Technical', def: 'The neural network component that allows models to focus on relevant parts of input — the core of Transformers.' },
    { term: 'Autoregressive', category: 'Technical', def: 'A model that generates output one token at a time, each token conditioned on all previous tokens.' },
    { term: 'Benchmark', category: 'Evaluation', def: 'A standardized test used to compare AI model performance (e.g. MMLU, HumanEval, HellaSwag).' },
    { term: 'CLIP', category: 'Model', def: 'Contrastive Language-Image Pre-training — OpenAI model connecting images and text, used in many image AI tools.' },
    { term: 'Chain-of-Thought', category: 'Prompting', def: 'A prompting technique where you ask the model to reason step-by-step before giving the final answer.' },
    { term: 'Context Window', category: 'Core', def: 'The maximum amount of text (tokens) an LLM can process at once. Larger = more text it can "remember" per conversation.' },
    { term: 'Diffusion Model', category: 'Model', def: 'A type of generative AI that creates images by learning to reverse a noise-adding process. Powers Stable Diffusion, DALL-E.' },
    { term: 'Embedding', category: 'Technical', def: 'A numerical vector representation of text/images that captures semantic meaning. Used in search and RAG systems.' },
    { term: 'Emergent Behavior', category: 'Core', def: 'Abilities that appear in large models that were not explicitly trained — like multi-step reasoning, coding, or translation.' },
    { term: 'Few-Shot Learning', category: 'Prompting', def: 'Providing a few examples in the prompt to guide the model\'s output style or format without retraining.' },
    { term: 'Fine-tuning', category: 'Training', def: 'Further training a pre-trained model on a specific dataset to specialize it for a particular task or style.' },
    { term: 'Foundation Model', category: 'Core', def: 'A large AI model trained on broad data that can be adapted for many tasks (GPT-4, Claude, Gemini, Llama).' },
    { term: 'GAN', category: 'Model', def: 'Generative Adversarial Network — two networks (generator vs discriminator) competing to create realistic outputs.' },
    { term: 'GPT', category: 'Model', def: 'Generative Pre-trained Transformer — OpenAI\'s architecture. GPT-4 powers ChatGPT.' },
    { term: 'Hallucination', category: 'Core', def: 'When an AI confidently generates false information. A key challenge with current LLMs.' },
    { term: 'RLHF', category: 'Training', def: 'Reinforcement Learning from Human Feedback — training technique where humans rate outputs to guide model behavior.' },
    { term: 'Inference', category: 'Technical', def: 'The process of running a trained model to generate outputs. Opposite of training.' },
    { term: 'Instruct Model', category: 'Model', def: 'A model fine-tuned to follow instructions rather than just predict the next token (e.g. GPT-4-turbo-instruct).' },
    { term: 'Knowledge Cutoff', category: 'Core', def: 'The date after which an LLM has no training data. Events after this date are unknown to the model.' },
    { term: 'Latent Space', category: 'Technical', def: 'The compressed mathematical space where AI models represent learned concepts and relationships.' },
    { term: 'LLM', category: 'Core', def: 'Large Language Model — an AI trained on massive text datasets to understand and generate human language.' },
    { term: 'LoRA', category: 'Training', def: 'Low-Rank Adaptation — efficient fine-tuning method that adds small trainable matrices without modifying the full model.' },
    { term: 'MoE', category: 'Model', def: 'Mixture of Experts — architecture where only a subset of model parameters activate per token, enabling larger models cheaply.' },
    { term: 'Multimodal', category: 'Core', def: 'AI that processes multiple types of data — text + images + audio + video (e.g. GPT-4o, Gemini Ultra).' },
    { term: 'Neural Network', category: 'Technical', def: 'Layers of interconnected mathematical nodes inspired by the brain. The foundation of modern AI.' },
    { term: 'NLP', category: 'Core', def: 'Natural Language Processing — AI field focused on understanding and generating human language.' },
    { term: 'One-Shot Learning', category: 'Prompting', def: 'Providing exactly one example in a prompt to guide model output.' },
    { term: 'Perplexity', category: 'Evaluation', def: 'A measure of how well a language model predicts a text sample. Lower perplexity = better model.' },
    { term: 'Prompt', category: 'Core', def: 'The input text you give to an AI model. Quality of output heavily depends on prompt quality.' },
    { term: 'Prompt Engineering', category: 'Prompting', def: 'The practice of crafting prompts to get optimal outputs from AI models.' },
    { term: 'Quantization', category: 'Technical', def: 'Reducing model precision (e.g. 16-bit to 4-bit) to run large models on consumer hardware with minimal quality loss.' },
    { term: 'RAG', category: 'Core', def: 'Retrieval-Augmented Generation — combining an LLM with external knowledge retrieval to reduce hallucinations.' },
    { term: 'Safety Alignment', category: 'Core', def: 'Techniques to make AI behave safely and according to human values (RLHF, Constitutional AI, etc.).' },
    { term: 'Semantic Search', category: 'Technical', def: 'Search using meaning/embeddings rather than exact keyword matching. Enables much better relevance.' },
    { term: 'System Prompt', category: 'Prompting', def: 'Instructions given to an LLM before the user message — sets behavior, persona, and constraints.' },
    { term: 'Temperature', category: 'Technical', def: 'A parameter controlling output randomness. Low (0.1) = focused/deterministic. High (1.0) = creative/random.' },
    { term: 'Token', category: 'Core', def: 'The basic unit LLMs process — roughly 4 characters or 0.75 words. Pricing is usually per 1000 tokens.' },
    { term: 'Transformer', category: 'Model', def: 'The neural network architecture (from "Attention Is All You Need" 2017) powering most modern LLMs.' },
    { term: 'Vector Database', category: 'Technical', def: 'A database optimized for storing and querying embeddings. Powers RAG systems (Pinecone, Weaviate, Chroma).' },
    { term: 'Vision Language Model', category: 'Model', def: 'A model that understands both images and text — can describe images, answer visual questions, read documents.' },
    { term: 'Zero-Shot', category: 'Prompting', def: 'Asking a model to perform a task with no examples in the prompt — just instructions.' },
    { term: 'DALL-E', category: 'Model', def: 'OpenAI\'s image generation model. DALL-E 3 is integrated into ChatGPT Plus.' },
    { term: 'Stable Diffusion', category: 'Model', def: 'Open-source image generation model by Stability AI. Runs locally, highly customizable.' },
    { term: 'Whisper', category: 'Model', def: 'OpenAI\'s open-source speech-to-text model. Powers many transcription tools.' },
    { term: 'Constitutional AI', category: 'Training', def: 'Anthropic\'s method of training AI to be helpful, harmless, and honest using a set of principles.' },
    { term: 'Model Weights', category: 'Technical', def: 'The numerical parameters of a trained neural network. "Open weights" means you can download and run the model.' },
    { term: 'Tokenizer', category: 'Technical', def: 'The component that converts text to tokens before feeding to an LLM. Different models use different tokenizers.' },
];

const CATEGORIES = ['All', 'Core', 'Technical', 'Model', 'Training', 'Prompting', 'Evaluation'];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GlossaryPage() {
    const grouped = ALPHA.reduce<Record<string, typeof TERMS>>((acc, letter) => {
        const matches = TERMS.filter(t => t.term.toUpperCase().startsWith(letter));
        if (matches.length) acc[letter] = matches;
        return acc;
    }, {});

    const CATEGORY_COLORS: Record<string, string> = {
        Core: 'bg-blue-100 text-blue-700',
        Technical: 'bg-purple-100 text-purple-700',
        Model: 'bg-green-100 text-green-700',
        Training: 'bg-orange-100 text-orange-700',
        Prompting: 'bg-pink-100 text-pink-700',
        Evaluation: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 to-blue-900 text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <BookOpen className="w-4 h-4" />
                        AI Glossary
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">AI Terms, Explained Simply</h1>
                    <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
                        {TERMS.length}+ AI and ML terms — from LLMs to RAG to Transformers. Plain English, no PhD required.
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search any AI term..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>
            </div>

            {/* Alpha Index */}
            <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-1 justify-center">
                    {Object.keys(grouped).map(letter => (
                        <a key={letter} href={`#${letter}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                            {letter}
                        </a>
                    ))}
                </div>
            </div>

            <main className="flex-grow max-w-4xl mx-auto px-4 py-10 w-full">

                {/* Category Legend */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
                        <span key={cat} className={`text-xs font-bold px-3 py-1 rounded-full ${cls}`}>{cat}</span>
                    ))}
                </div>

                {/* Terms by Letter */}
                <div className="space-y-10">
                    {Object.entries(grouped).map(([letter, terms]) => (
                        <div key={letter} id={letter}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl">
                                    {letter}
                                </div>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="space-y-3">
                                {terms.map(item => (
                                    <div key={item.term} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    <h3 className="font-black text-gray-900 text-base">{item.term}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{item.def}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 text-white text-center">
                    <h2 className="text-2xl font-black mb-3">Missing a Term?</h2>
                    <p className="text-indigo-100 mb-6">Suggest an AI term and we&apos;ll add it to the glossary.</p>
                    <a href="mailto:hello@allaitoollist.com?subject=Glossary Term Suggestion" className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
                        Suggest a Term →
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
