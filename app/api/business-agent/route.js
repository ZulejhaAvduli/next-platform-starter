import { NextResponse } from 'next/server';

const COMPANY_NAME = 'Help Chat Support Online';

const RESPONSE_TEMPLATES = {
    email: {
        greeting: 'Dear Valued Customer,',
        signoff: `Best regards,\n${COMPANY_NAME} Support Team`
    },
    twitter: {
        greeting: 'Hi there! 👋',
        signoff: `- ${COMPANY_NAME} Team`
    },
    website: {
        greeting: 'Hello!',
        signoff: `Thank you for reaching out!\n${COMPANY_NAME}`
    }
};

export async function POST(request) {
    try {
        const { type, message } = await request.json();

        if (!message || !type) {
            return NextResponse.json({ error: 'Message and type are required' }, { status: 400 });
        }

        const template = RESPONSE_TEMPLATES[type] || RESPONSE_TEMPLATES.email;
        const response = generateResponse(type, message, template);

        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

function generateResponse(type, message, template) {
    const lowerMessage = message.toLowerCase();
    let body = '';

    // Detect common customer intents and generate appropriate responses
    if (containsAny(lowerMessage, ['refund', 'money back', 'return'])) {
        body = getRefundResponse(type);
    } else if (containsAny(lowerMessage, ['help', 'support', 'issue', 'problem', 'not working', 'broken'])) {
        body = getTechnicalSupportResponse(type);
    } else if (containsAny(lowerMessage, ['price', 'cost', 'pricing', 'subscription', 'plan'])) {
        body = getPricingResponse(type);
    } else if (containsAny(lowerMessage, ['cancel', 'unsubscribe', 'stop'])) {
        body = getCancellationResponse(type);
    } else if (containsAny(lowerMessage, ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'love'])) {
        body = getPositiveFeedbackResponse(type);
    } else if (containsAny(lowerMessage, ['complaint', 'angry', 'upset', 'frustrated', 'terrible', 'worst'])) {
        body = getComplaintResponse(type);
    } else if (containsAny(lowerMessage, ['order', 'shipping', 'delivery', 'track', 'package'])) {
        body = getOrderResponse(type);
    } else if (containsAny(lowerMessage, ['account', 'password', 'login', 'sign in', 'access'])) {
        body = getAccountResponse(type);
    } else {
        body = getGeneralResponse(type);
    }

    // Format based on channel type
    if (type === 'twitter') {
        // Twitter responses should be concise
        return `${template.greeting}\n\n${body}\n\n${template.signoff}`;
    }

    return `${template.greeting}\n\nThank you for contacting ${COMPANY_NAME}.\n\n${body}\n\n${template.signoff}`;
}

function containsAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
}

function getRefundResponse(type) {
    if (type === 'twitter') {
        return "We're sorry to hear you'd like a refund. Please DM us your order details and we'll process it within 3-5 business days. 💙";
    }
    return `We understand you would like to request a refund. We're here to help make this process as smooth as possible.

To process your refund request, please provide us with the following information:
• Your order number
• Date of purchase
• Reason for the refund

Once we receive this information, our team will review your request and process the refund within 3-5 business days. The refund will be credited to your original payment method.

If you have any questions about our refund policy, please don't hesitate to ask.`;
}

function getTechnicalSupportResponse(type) {
    if (type === 'twitter') {
        return "Sorry you're having trouble! 😔 Can you DM us with more details? Our tech team is ready to help you resolve this quickly!";
    }
    return `We're sorry to hear you're experiencing difficulties. Our technical support team is here to assist you.

To help us investigate and resolve your issue quickly, please provide:
• A detailed description of the problem
• Any error messages you're seeing
• The device and browser you're using
• Steps you've already tried

In the meantime, here are some quick troubleshooting steps:
1. Clear your browser cache and cookies
2. Try using a different browser
3. Restart your device

We're committed to resolving your issue as quickly as possible. A member of our support team will be in touch shortly.`;
}

function getPricingResponse(type) {
    if (type === 'twitter') {
        return "Great question about our pricing! 💰 Check out our plans at our website, or DM us for personalized recommendations based on your needs!";
    }
    return `Thank you for your interest in our services!

We offer flexible pricing plans to meet various needs:
• Basic Plan - Perfect for individuals getting started
• Professional Plan - Ideal for growing businesses
• Enterprise Plan - Custom solutions for large organizations

Each plan includes our core features with varying levels of support and additional capabilities. We'd be happy to discuss which plan would best suit your specific requirements.

Would you like to schedule a call with our sales team to discuss your needs in detail? We can provide a customized quote based on your specific requirements.`;
}

function getCancellationResponse(type) {
    if (type === 'twitter') {
        return "We're sad to see you go! 💔 Please DM us your account details and we'll help with the cancellation. Is there anything we can do to improve your experience?";
    }
    return `We're sorry to hear you're considering canceling your subscription. Before you go, we'd love to understand how we might improve your experience.

If you'd still like to proceed with the cancellation:
• Please confirm your account email address
• Let us know the reason for cancellation (this helps us improve)
• Your cancellation will be effective at the end of your current billing period

Please note that you'll retain access to all features until your subscription period ends. If you change your mind, you can reactivate your account at any time.

Is there anything we can do to address your concerns before you cancel?`;
}

function getPositiveFeedbackResponse(type) {
    if (type === 'twitter') {
        return "Thank you so much for the kind words! 🎉 We love hearing from happy customers! Your support means the world to us! 💙";
    }
    return `Wow, thank you so much for your kind words! Messages like yours truly make our day and motivate our entire team.

We're thrilled to hear that you've had a positive experience with us. Your satisfaction is our top priority, and we're committed to continuing to deliver excellent service.

If there's anything else we can help you with, or if you have any suggestions for how we can make your experience even better, please don't hesitate to reach out.

We truly appreciate your support!`;
}

function getComplaintResponse(type) {
    if (type === 'twitter') {
        return "We sincerely apologize for your experience. 😔 This isn't the service we aim to provide. Please DM us so we can make this right immediately.";
    }
    return `We sincerely apologize for the experience you've had. This is not the level of service we strive to provide, and we take your feedback very seriously.

Your concerns have been escalated to our management team for immediate review. We would like to understand more about what happened so we can:
1. Address your specific situation
2. Prevent similar issues from occurring in the future

Please share any additional details about your experience. We're committed to making this right and regaining your trust.

A senior member of our team will personally follow up with you within 24 hours.`;
}

function getOrderResponse(type) {
    if (type === 'twitter') {
        return "Thanks for reaching out about your order! 📦 DM us your order number and we'll get you an update right away!";
    }
    return `Thank you for contacting us about your order.

To provide you with the most accurate information, please share your order number. Once we have that, we can:
• Check the current status of your order
• Provide tracking information if available
• Update you on expected delivery times

If you haven't received your order within the expected timeframe, we'll investigate and ensure it reaches you as soon as possible.

For urgent inquiries, you can also track your order directly through your account dashboard.`;
}

function getAccountResponse(type) {
    if (type === 'twitter') {
        return "Need help with your account? 🔐 For security, please DM us and we'll help you get access restored safely!";
    }
    return `We're here to help you with your account access.

For security purposes, please do not share your password in any communication with us.

If you're having trouble logging in:
1. Try the "Forgot Password" option on our login page
2. Check your spam folder for the password reset email
3. Ensure you're using the correct email address

If you're still unable to access your account after trying these steps, please provide:
• The email address associated with your account
• Any error messages you're seeing

Our team will verify your identity and help restore your access securely.`;
}

function getGeneralResponse(type) {
    if (type === 'twitter') {
        return "Thanks for reaching out! 🙌 We're here to help. Could you share more details about what you need, or DM us for personalized assistance?";
    }
    return `Thank you for reaching out to us.

We've received your message and want to ensure we provide you with the most helpful response possible.

Could you please provide a bit more detail about your inquiry? This will help us direct your question to the right team and provide you with accurate information.

In the meantime, you might find answers to common questions on our website's FAQ section.

We look forward to assisting you!`;
}
