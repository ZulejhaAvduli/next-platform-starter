import { BusinessAgentChat } from 'components/business-agent-chat';

export const metadata = {
    title: 'Business Agent - Help Chat Support Online'
};

export default function BusinessAgentPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <h1 className="mb-4">Help Chat Support Online</h1>
                <p className="mb-6 text-lg">
                    Your AI-powered business agent that responds to emails, Twitter messages, and website inquiries.
                </p>
            </section>
            <section>
                <BusinessAgentChat />
            </section>
        </div>
    );
}
