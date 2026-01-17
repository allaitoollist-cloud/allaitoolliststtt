import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        console.log('📧 Submit tool email API called');
        const body = await request.json();
        console.log('Request body:', body);
        const { toolName, submitterEmail } = body;

        if (!toolName || !submitterEmail) {
            console.error('Missing required fields:', { toolName, submitterEmail });
            return NextResponse.json(
                { error: 'Tool name and email are required' },
                { status: 400 }
            );
        }

        console.log('Sending email to:', submitterEmail, 'for tool:', toolName);

        // Send submission confirmation email
        const emailTemplate = emailTemplates.toolSubmitted(toolName, submitterEmail);

        const result = await sendEmail({
            to: submitterEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        console.log('Email send result:', result);

        if (!result.success) {
            console.error('Failed to send submission email:', result.error);

            // Check if it's a domain verification error
            const errorMessage = (result.error && typeof result.error === 'object' && 'message' in result.error)
                ? (result.error as any).message
                : '';
            const isDomainError = (result.error && typeof result.error === 'object' && 'statusCode' in result.error && (result.error as any).statusCode === 403) ||
                errorMessage.includes('testing emails') ||
                errorMessage.includes('domain') ||
                errorMessage.includes('verify');

            return NextResponse.json({
                success: false,
                error: result.error,
                message: isDomainError
                    ? 'Resend domain not verified. Please verify your domain in Resend dashboard (https://resend.com/domains) or use your account email for testing.'
                    : 'Failed to send email',
                needsDomainVerification: isDomainError,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Submission confirmation email sent',
        });
    } catch (error) {
        console.error('Submit tool email error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

