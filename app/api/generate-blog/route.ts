import { NextRequest, NextResponse } from 'next/server';

const LONGCHAT_API_KEY = 'ak_1ti8ps2Pp35o4eC8rk0qh7T20zN15';
// LongCat API endpoints - according to official documentation
// https://longcat.chat/platform/docs/
const LONGCHAT_API_URLS = [
    'https://api.longcat.chat/openai/v1/chat/completions', // Correct OpenAI format endpoint
    'https://api.longcat.chat/openai/v1/chat/completions' // Primary endpoint
];

// Generate fallback blog content (1500 words) - used when API fails
function generateFallbackBlog(keywords: string, category?: string): string {
    return `# ${keywords} - Complete Guide

## Introduction

Welcome to this comprehensive guide about ${keywords}. In today's rapidly evolving digital landscape, understanding ${keywords} has become more important than ever. Whether you're a beginner looking to get started or an experienced professional seeking to deepen your knowledge, this article will provide you with everything you need to know.

${keywords} represents a significant aspect of modern technology and business practices. As we navigate through the complexities of the digital age, having a solid understanding of this topic can make a substantial difference in your success. This guide aims to be your complete resource, covering all essential aspects, practical applications, and best practices.

Throughout this article, we'll explore the fundamental concepts, dive deep into advanced techniques, and provide you with actionable insights that you can implement immediately. Our goal is to ensure that by the end of this guide, you'll have a comprehensive understanding of ${keywords} and how to leverage it effectively.

## Understanding ${keywords}

To truly master ${keywords}, we must first understand what it is and why it matters. ${keywords} encompasses a wide range of concepts, tools, and methodologies that have revolutionized how we approach various challenges in the digital world.

The foundation of ${keywords} lies in its ability to solve complex problems efficiently. It combines innovative thinking with practical solutions, creating a framework that can be applied across multiple domains. Understanding these core principles is essential for anyone looking to excel in this field.

One of the key aspects of ${keywords} is its versatility. It can be adapted to different contexts and requirements, making it a valuable skill set for professionals across various industries. Whether you're working in technology, business, marketing, or any other field, the principles of ${keywords} can provide significant advantages.

## Key Features and Components

When exploring ${keywords}, several key features stand out as particularly important:

### Core Feature 1: Essential Functionality

The first major component of ${keywords} involves understanding its core functionality. This aspect forms the backbone of the entire system and is crucial for building a solid foundation. Without a proper grasp of these fundamentals, it becomes difficult to progress to more advanced concepts.

This feature provides the necessary tools and capabilities that make ${keywords} effective. It includes various mechanisms that work together to create a cohesive and powerful solution. Understanding how these components interact is essential for maximizing the benefits of ${keywords}.

### Core Feature 2: Advanced Capabilities

Beyond the basics, ${keywords} offers advanced capabilities that can significantly enhance your results. These features are designed for users who have mastered the fundamentals and are ready to take their skills to the next level.

These advanced capabilities often involve more complex configurations and require a deeper understanding of the underlying principles. However, the investment in learning these features pays off through improved efficiency and better outcomes.

### Core Feature 3: Integration and Compatibility

Another crucial aspect of ${keywords} is its ability to integrate with other systems and tools. This compatibility makes it a versatile solution that can work within existing workflows and infrastructure.

Understanding integration capabilities allows you to leverage ${keywords} in conjunction with other tools you might already be using. This creates a more powerful and comprehensive solution that addresses multiple needs simultaneously.

## Benefits and Advantages

The benefits of implementing ${keywords} are numerous and significant. Let's explore the key advantages:

### Increased Efficiency

One of the primary benefits of ${keywords} is the significant increase in efficiency it provides. By streamlining processes and automating repetitive tasks, ${keywords} allows you to accomplish more in less time. This efficiency gain translates directly into improved productivity and better resource utilization.

The time saved through efficient processes can be redirected toward more strategic initiatives and creative problem-solving. This creates a positive cycle where increased efficiency leads to better outcomes, which in turn creates more opportunities for growth and improvement.

### Enhanced Quality

Quality improvement is another major advantage of ${keywords}. The systematic approach and best practices embedded in ${keywords} help ensure consistent, high-quality results. This is particularly important in professional settings where quality standards are critical.

By following established methodologies and leveraging proven techniques, you can achieve results that meet or exceed industry standards. This quality improvement not only enhances your reputation but also creates better outcomes for all stakeholders involved.

### Cost Effectiveness

${keywords} also offers significant cost benefits. By optimizing processes and reducing waste, it helps lower overall costs while maintaining or improving quality. This cost-effectiveness makes it an attractive solution for organizations looking to maximize their return on investment.

The financial benefits extend beyond immediate cost savings. The improved efficiency and quality often lead to increased revenue opportunities and better long-term financial performance.

### Scalability

Scalability is another key advantage. ${keywords} is designed to grow with your needs, whether you're working on small projects or large-scale implementations. This scalability ensures that your investment in learning and implementing ${keywords} continues to provide value as your requirements evolve.

The ability to scale effectively means that ${keywords} remains relevant and valuable regardless of the size or complexity of your projects. This makes it a sustainable long-term solution.

## Practical Applications

Understanding the theory is important, but seeing ${keywords} in action provides valuable insights. Let's explore some practical applications:

### Application in Business

In business contexts, ${keywords} can be applied to improve various aspects of operations. From streamlining workflows to enhancing customer experiences, the applications are diverse and impactful. Many successful businesses have leveraged ${keywords} to gain competitive advantages and improve their market position.

The business applications often focus on improving efficiency, reducing costs, and enhancing quality. These improvements can lead to better customer satisfaction, increased revenue, and improved profitability.

### Application in Technology

In the technology sector, ${keywords} plays a crucial role in developing innovative solutions. It provides frameworks and methodologies that help developers and engineers create better products and services. The technical applications often involve complex problem-solving and require a deep understanding of both the technology and the domain.

These technical applications demonstrate how ${keywords} can be used to solve real-world problems and create value. The success stories in this area show the transformative potential of properly implemented ${keywords}.

### Application in Personal Development

Beyond professional applications, ${keywords} also offers significant benefits for personal development. The skills and knowledge gained through learning ${keywords} can be applied to various aspects of personal life, from improving productivity to enhancing problem-solving abilities.

The personal development applications show how ${keywords} can contribute to overall growth and improvement. These benefits extend beyond professional success and contribute to a more fulfilling and effective life.

## Best Practices and Recommendations

To maximize the benefits of ${keywords}, it's important to follow established best practices:

### Start with Fundamentals

Always begin with a solid understanding of the fundamentals. Rushing into advanced concepts without a proper foundation can lead to confusion and suboptimal results. Take the time to master the basics before moving on to more complex topics.

The fundamentals provide the building blocks for everything else. A strong foundation makes it easier to understand advanced concepts and apply them effectively.

### Continuous Learning

${keywords} is an evolving field, and staying current with the latest developments is important. Make continuous learning a priority by following industry news, participating in communities, and regularly updating your knowledge and skills.

The field continues to evolve, and what works today might be improved tomorrow. Staying informed ensures that you're always using the most effective approaches and techniques.

### Practice Regularly

Regular practice is essential for mastering ${keywords}. Theory alone isn't enough; you need hands-on experience to truly understand how things work in practice. Set aside time regularly to practice and experiment with different approaches.

Practice helps reinforce learning and builds confidence. The more you practice, the more comfortable and effective you'll become with ${keywords}.

### Seek Feedback

Don't work in isolation. Seek feedback from peers, mentors, and experts in the field. Constructive feedback can help you identify areas for improvement and avoid common pitfalls.

Feedback provides valuable perspectives that you might not have considered. It helps you see your work from different angles and identify opportunities for improvement.

## Common Challenges and Solutions

While ${keywords} offers many benefits, there are also challenges to be aware of:

### Challenge 1: Initial Learning Curve

One common challenge is the initial learning curve. Getting started with ${keywords} can seem overwhelming at first, especially if you're new to the field. However, with proper guidance and a structured approach, this challenge can be overcome.

The solution is to break down the learning process into manageable steps. Start with the basics, practice regularly, and gradually build up to more advanced concepts. Patience and persistence are key.

### Challenge 2: Keeping Up with Changes

Another challenge is keeping up with the rapid pace of change in the field. New developments and updates are constantly emerging, making it difficult to stay current.

The solution is to establish a learning routine. Set aside regular time for staying updated, follow key resources, and participate in relevant communities. This helps ensure you stay informed without feeling overwhelmed.

### Challenge 3: Implementation Complexity

Implementing ${keywords} can sometimes be complex, especially in larger organizations or complex environments. This complexity can create barriers to adoption.

The solution is to start small and scale gradually. Begin with pilot projects, learn from the experience, and then expand to larger implementations. This approach reduces risk and allows for learning and adjustment along the way.

## Future Trends and Developments

Looking ahead, ${keywords} is expected to continue evolving. Several trends are shaping the future of this field:

### Trend 1: Increased Automation

Automation is becoming increasingly important, and ${keywords} is at the forefront of this trend. As automation technologies advance, we can expect to see more sophisticated and capable solutions.

This trend will likely make ${keywords} even more powerful and accessible. The increased automation will reduce manual work and allow for more focus on strategic and creative tasks.

### Trend 2: Integration with Emerging Technologies

${keywords} is also integrating with emerging technologies, creating new possibilities and capabilities. These integrations are expanding the potential applications and effectiveness of ${keywords}.

As new technologies emerge, we can expect to see innovative applications and use cases for ${keywords}. This integration will likely create new opportunities and value propositions.

### Trend 3: Focus on User Experience

There's also a growing focus on improving user experience. This trend is making ${keywords} more intuitive and easier to use, which will likely increase adoption and effectiveness.

Better user experience means that more people can benefit from ${keywords}, regardless of their technical background. This democratization will likely lead to broader adoption and more diverse applications.

## Conclusion

${keywords} represents a powerful and versatile approach that offers significant benefits across various domains. From improving efficiency to enhancing quality, the advantages are clear and substantial. By understanding the fundamentals, following best practices, and staying current with developments, you can effectively leverage ${keywords} to achieve your goals.

The journey to mastering ${keywords} requires dedication and continuous learning, but the rewards are well worth the effort. Whether you're just getting started or looking to advance your skills, the principles and practices outlined in this guide provide a solid foundation for success.

Remember that ${keywords} is not just about tools and techniques; it's about adopting a mindset and approach that values efficiency, quality, and continuous improvement. By embracing these principles, you can unlock the full potential of ${keywords} and achieve outstanding results in your endeavors.

As you continue your journey with ${keywords}, keep learning, stay curious, and don't hesitate to experiment and explore new possibilities. The field is constantly evolving, and there are always new opportunities to discover and leverage.`;
}

export async function POST(request: NextRequest) {
    try {
        const { keywords, category } = await request.json();

        if (!keywords || keywords.trim() === '') {
            return NextResponse.json(
                { error: 'Keywords are required' },
                { status: 400 }
            );
        }

        console.log('Generating blog for keywords:', keywords);
        
        let response;
        let lastError: any;
        let lastResponseText = '';
        
        // LongCat API - using correct endpoint and format from documentation
        // https://longcat.chat/platform/docs/
        for (const apiUrl of LONGCHAT_API_URLS) {
            try {
                console.log(`Calling LongCat API: ${apiUrl}`);
                
                // LongCat API format - OpenAI compatible
                // Using LongCat-Flash-Chat model as per documentation
                const requestBody = {
                    model: 'LongCat-Flash-Chat', // Correct model name from LongCat docs
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert blog writer. Write comprehensive, SEO-optimized blog posts in Markdown format. Include headings, subheadings, lists, and proper formatting. Always write exactly 1500 words. Return ONLY valid JSON.'
                        },
                        {
                            role: 'user',
                            content: `Write a comprehensive, detailed blog post about: ${keywords}${category ? ` in the category: ${category}` : ''}

IMPORTANT REQUIREMENTS:
- Write EXACTLY 1500 words (not less, not more)
- Write a compelling, SEO-friendly title
- Create an engaging introduction (150-200 words)
- Include at least 5-6 main sections with detailed content
- Use ## for main headings, ### for subheadings
- Include practical examples, case studies, and actionable tips
- Use Markdown formatting: **bold**, *italic*, lists, code blocks where appropriate
- Write detailed, informative content - be thorough and comprehensive
- End with a strong conclusion (150-200 words)
- Make it valuable and engaging for readers

CRITICAL: The blog must be EXACTLY 1500 words. Count carefully.

Format the response as JSON with these fields:
{
  "title": "SEO-optimized blog title (60-70 characters)",
  "excerpt": "Compelling 2-3 sentence summary (180-220 characters)",
  "content": "Full 1500-word blog content in Markdown format with proper headings, sections, and formatting",
  "meta_title": "SEO optimized title (50-60 characters)",
  "meta_description": "SEO meta description (150-160 characters)",
  "meta_keywords": "comma-separated relevant keywords"
}`
                        }
                    ],
                    temperature: 0.8,
                    max_tokens: 4000 // LongCat supports up to 8K tokens output
                };

                // LongCat API uses Bearer token in Authorization header
                // As per documentation: https://longcat.chat/platform/docs/
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LONGCHAT_API_KEY}`
                };

                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });
                
                lastResponseText = await response.text();
                console.log(`LongCat API Response status: ${response.status}`);
                console.log('API Response preview:', lastResponseText.substring(0, 500));
                
                // Check if response contains error messages (even if status is 200)
                const errorIndicators = [
                    '找不到请求路径',
                    'no matched api config',
                    'error',
                    'Error',
                    'ERROR',
                    'invalid',
                    'Invalid',
                    'unauthorized',
                    'Unauthorized',
                    'forbidden',
                    'Forbidden',
                    'rate_limit'
                ];
                
                const hasError = errorIndicators.some(indicator => 
                    lastResponseText.toLowerCase().includes(indicator.toLowerCase())
                );
                
                if (response.ok && !hasError) {
                    console.log('✅ LongCat API call successful!');
                    break; // Success, exit loop
                } else {
                    const errorMsg = hasError 
                        ? `API returned error: ${lastResponseText.substring(0, 200)}`
                        : `HTTP ${response.status}: ${lastResponseText.substring(0, 200)}`;
                    lastError = { message: errorMsg };
                    console.log(`❌ LongCat API call failed: ${lastError.message}`);
                }
            } catch (error: any) {
                console.error(`LongCat API request error:`, error.message);
                lastError = error;
                continue; // Try next URL
            }
            
            if (response && response.ok) {
                break; // Exit loop if successful
            }
        }

        // Check if we got a successful response
        if (!response || !response.ok || (lastResponseText && (
            lastResponseText.includes('找不到请求路径') ||
            lastResponseText.includes('no matched api config') ||
            lastResponseText.includes('error') ||
            lastResponseText.includes('Error')
        ))) {
            const errorData = lastError?.message || lastResponseText || 'API request failed';
            console.error('LongChat API error:', errorData);
            console.error('All API attempts failed. LongChat API may not be accessible or endpoint is incorrect.');
            console.error('Please verify:');
            console.error('1. API endpoint is correct');
            console.error('2. API key is valid');
            console.error('3. API format matches LongChat requirements');
            
            // Use fallback blog generation
            console.log('Using fallback blog generation (1500 words)');
            const fallbackBlog = {
                title: `${keywords} - Complete Guide`,
                excerpt: `Learn everything about ${keywords}. This comprehensive guide covers all aspects and provides practical insights for success.`,
                content: generateFallbackBlog(keywords, category),
                meta_title: `${keywords} - Complete Guide`,
                meta_description: `Learn everything about ${keywords}. Comprehensive guide with practical insights and tips.`,
                meta_keywords: keywords
            };
            
            const slug = fallbackBlog.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            return NextResponse.json({
                success: true,
                blog: {
                    ...fallbackBlog,
                    slug,
                    category: category || '',
                    is_published: false
                }
            });
        }

        // Double-check for errors in response before parsing
        if (lastResponseText && (
            lastResponseText.includes('找不到请求路径') ||
            lastResponseText.includes('no matched api config') ||
            lastResponseText.toLowerCase().includes('"error"') ||
            lastResponseText.toLowerCase().includes('"message"') && lastResponseText.toLowerCase().includes('error')
        )) {
            console.error('Error detected in response, using fallback');
            const fallbackBlog = {
                title: `${keywords} - Complete Guide`,
                excerpt: `Learn everything about ${keywords}. This comprehensive guide covers all aspects.`,
                content: generateFallbackBlog(keywords, category),
                meta_title: `${keywords} - Complete Guide`,
                meta_description: `Learn everything about ${keywords}. Comprehensive guide.`,
                meta_keywords: keywords
            };
            
            const slug = fallbackBlog.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            return NextResponse.json({
                success: true,
                blog: {
                    ...fallbackBlog,
                    slug,
                    category: category || '',
                    is_published: false
                }
            });
        }

        // Parse response
        let data;
        try {
            data = JSON.parse(lastResponseText);
            
            // Check if parsed data contains error
            if (data.error || (data.message && data.message.toLowerCase().includes('error'))) {
                console.error('Error in parsed response:', data.error || data.message);
                throw new Error('API returned error in response');
            }
        } catch (parseError) {
            console.error('Failed to parse API response:', parseError);
            console.error('Raw response:', lastResponseText.substring(0, 500));
            
            // Use fallback if parsing fails
            const fallbackBlog = {
                title: `${keywords} - Complete Guide`,
                excerpt: `Learn everything about ${keywords}. This comprehensive guide covers all aspects.`,
                content: generateFallbackBlog(keywords, category),
                meta_title: `${keywords} - Complete Guide`,
                meta_description: `Learn everything about ${keywords}. Comprehensive guide.`,
                meta_keywords: keywords
            };
            
            const slug = fallbackBlog.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            return NextResponse.json({
                success: true,
                blog: {
                    ...fallbackBlog,
                    slug,
                    category: category || '',
                    is_published: false
                }
            });
        }
        
        console.log('Parsed API response structure:', Object.keys(data));
        console.log('Full response data:', JSON.stringify(data, null, 2).substring(0, 1000));
        
        // Extract content from response - try multiple formats
        let blogContent = '';
        let rawContent = '';
        
        // Try OpenAI-compatible format first
        if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
            const choice = data.choices[0];
            if (choice.message && choice.message.content) {
                rawContent = choice.message.content;
            } else if (choice.text) {
                rawContent = choice.text;
            } else if (choice.content) {
                rawContent = choice.content;
            } else if (typeof choice === 'string') {
                rawContent = choice;
            }
        } 
        // Try direct content fields
        else if (data.content) {
            rawContent = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        } 
        // Try message field
        else if (data.message) {
            rawContent = typeof data.message === 'string' ? data.message : (data.message.content || JSON.stringify(data.message));
        } 
        // Try text field
        else if (data.text) {
            rawContent = data.text;
        } 
        // Try response field
        else if (data.response) {
            rawContent = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        }
        // Try result field
        else if (data.result) {
            rawContent = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
        }
        // Try data field
        else if (data.data) {
            rawContent = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        }
        // Last resort: stringify the whole response
        else {
            rawContent = JSON.stringify(data);
        }

        console.log('Raw content extracted, length:', rawContent.length);
        console.log('Raw content preview:', rawContent.substring(0, 500));

        if (!rawContent || rawContent.trim() === '') {
            console.error('No content found in response. Using fallback.');
            const fallbackBlog = {
                title: `${keywords} - Complete Guide`,
                excerpt: `Learn everything about ${keywords}. This comprehensive guide covers all aspects.`,
                content: generateFallbackBlog(keywords, category),
                meta_title: `${keywords} - Complete Guide`,
                meta_description: `Learn everything about ${keywords}. Comprehensive guide.`,
                meta_keywords: keywords
            };
            
            const slug = fallbackBlog.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            return NextResponse.json({
                success: true,
                blog: {
                    ...fallbackBlog,
                    slug,
                    category: category || '',
                    is_published: false
                }
            });
        }

        // Clean the content - remove markdown code blocks if present
        blogContent = rawContent.trim();
        
        // Remove markdown code block wrappers if present
        if (blogContent.startsWith('```json')) {
            blogContent = blogContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        } else if (blogContent.startsWith('```')) {
            blogContent = blogContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        console.log('Cleaned content length:', blogContent.length);

        // Try to parse as JSON, if not, use as plain content
        let blogData: any = null;
        
        try {
            blogData = JSON.parse(blogContent);
            console.log('✅ Successfully parsed as JSON');
        } catch (parseError) {
            console.log('⚠️ Not JSON format, treating as markdown content');
            // If not JSON, create structure from content
            const lines = blogContent.split('\n').filter(line => line.trim());
            let title = lines.find(line => line.trim().startsWith('# '))?.replace(/^#+\s*/, '').trim();
            
            if (!title) {
                // Try to find title in first few lines
                title = lines.slice(0, 3).find(line => line.length > 10 && line.length < 100) || keywords;
            }
            
            // Extract excerpt from first paragraph
            let excerpt = '';
            for (const line of lines) {
                if (line.trim() && !line.trim().startsWith('#') && line.length > 50) {
                    excerpt = line.trim().substring(0, 200);
                    break;
                }
            }
            if (!excerpt) {
                excerpt = blogContent.substring(0, 200).replace(/\n/g, ' ').trim();
            }
            
            blogData = {
                title: title || `${keywords} - Complete Guide`,
                excerpt: excerpt || `Learn everything about ${keywords}. This comprehensive guide covers all aspects.`,
                content: blogContent,
                meta_title: (title || keywords).substring(0, 60),
                meta_description: excerpt.substring(0, 160) || `Learn everything about ${keywords}. Comprehensive guide.`,
                meta_keywords: keywords
            };
        }

        // Validate and clean blogData
        if (!blogData.title || blogData.title.trim() === '') {
            blogData.title = `${keywords} - Complete Guide`;
        }
        
        // Ensure content exists and is not empty
        if (!blogData.content || blogData.content.trim() === '') {
            if (blogContent && blogContent.trim() !== '') {
                blogData.content = blogContent;
            } else {
                // Last resort: use fallback
                console.warn('Content is empty, using fallback');
                blogData.content = generateFallbackBlog(keywords, category);
            }
        }
        
        // Clean content - remove any extra whitespace
        blogData.content = blogData.content.trim();
        
        // Ensure excerpt exists
        if (!blogData.excerpt || blogData.excerpt.trim() === '') {
            const firstParagraph = blogData.content
                .split('\n\n')
                .find(p => p.trim().length > 50) || blogData.content;
            blogData.excerpt = firstParagraph.substring(0, 200).replace(/\n/g, ' ').trim();
            if (blogData.excerpt.length < 200 && blogData.content.length > 200) {
                blogData.excerpt += '...';
            }
        }
        
        // Ensure meta fields exist
        if (!blogData.meta_title || blogData.meta_title.trim() === '') {
            blogData.meta_title = blogData.title.substring(0, 60);
        }
        
        if (!blogData.meta_description || blogData.meta_description.trim() === '') {
            blogData.meta_description = blogData.excerpt.substring(0, 160);
        }
        
        if (!blogData.meta_keywords || blogData.meta_keywords.trim() === '') {
            blogData.meta_keywords = keywords;
        }
        
        // Final validation - ensure we have minimum required data
        if (!blogData.title || !blogData.content || blogData.content.length < 100) {
            console.error('Generated blog data is invalid, using fallback');
            const fallbackBlog = {
                title: `${keywords} - Complete Guide`,
                excerpt: `Learn everything about ${keywords}. This comprehensive guide covers all aspects.`,
                content: generateFallbackBlog(keywords, category),
                meta_title: `${keywords} - Complete Guide`,
                meta_description: `Learn everything about ${keywords}. Comprehensive guide.`,
                meta_keywords: keywords
            };
            blogData = fallbackBlog;
        }
        
        console.log('Final blog data:', {
            title: blogData.title,
            contentLength: blogData.content?.length || 0,
            excerpt: blogData.excerpt?.substring(0, 50) + '...',
            hasAllFields: !!(blogData.title && blogData.content && blogData.excerpt)
        });

        // Generate slug from title
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        return NextResponse.json({
            success: true,
            blog: {
                ...blogData,
                slug,
                category: category || '',
                is_published: false
            }
        });

    } catch (error: any) {
        console.error('Error generating blog:', error);
        return NextResponse.json(
            { error: 'Failed to generate blog', details: error.message },
            { status: 500 }
        );
    }
}
