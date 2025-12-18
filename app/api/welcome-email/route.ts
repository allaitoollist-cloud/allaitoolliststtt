import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, username } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Send welcome email
        const emailTemplate = emailTemplates.welcomeEmail(name || username || 'User', username || name || 'User');
        
        const result = await sendEmail({
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        if (!result.success) {
            console.error('Failed to send welcome email:', result.error);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Welcome email sent',
        });
    } catch (error) {
        console.error('Welcome email error:', error);
        // Don't fail the request if email fails
        return NextResponse.json({
            success: false,
            error: 'Failed to send welcome email',
        });
    }
}

