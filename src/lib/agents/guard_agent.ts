import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Tools available to the SubGuard Agent
 */
const tools = [
    {
        functionDeclarations: [
            {
                name: "approve_payment",
                description: "Approves the payment and authorizes the transfer of USDC on Arc L1.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        merchant: { type: SchemaType.STRING },
                        amount: { type: SchemaType.NUMBER },
                        reason: { type: SchemaType.STRING }
                    },
                    required: ["merchant", "amount", "reason"]
                }
            },
            {
                name: "block_payment",
                description: "Declines the payment request to protect the user's treasury.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        merchant: { type: SchemaType.STRING },
                        reason: { type: SchemaType.STRING }
                    },
                    required: ["merchant", "reason"]
                }
            }
        ]
    }
] as any; // Using 'as any' as a quick fix for complex tool-type inference in this environment

export const guardAgent = {
    // Rapid Approval: Now uses Function Calling for formal decisions
    shouldApproveTransaction: async (merchant: string, amount: string, isBlocked: boolean) => {
        if (isBlocked) return { approved: false, reason: "Card for this merchant is manually disabled." };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // Using 1.5 Flash for tool support & speed
            tools
        });

        const chat = model.startChat();
        const prompt = `
      TRANSACTION ALERT:
      Merchant: ${merchant}
      Amount: ${amount} USDC
      
      You are the SubGuard Autonomous Gatekeeper. 
      Analyze this request. Is it a known subscription? Does it look like a duplicate or phishing?
      Call 'approve_payment' if it is legitimate. 
      Call 'block_payment' if it looks suspicious or is a known trial trap.
    `;

        const result = await chat.sendMessage(prompt);
        const call = result.response.functionCalls()?.[0];

        if (call) {
            if (call.name === "approve_payment") {
                return { approved: true, reason: (call.args as any).reason };
            } else {
                return { approved: false, reason: (call.args as any).reason };
            }
        }

        // Fallback if no function called
        return { approved: true, reason: "Auto-approved by heuristic fallback." };
    },

    vibeCheck: async (subscriptionData: any, userHistory: any) => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
      Deep Analysis Required:
      Subscription: ${JSON.stringify(subscriptionData)}
      History: ${JSON.stringify(userHistory)}
      
      Vibe Check this subscription. Is the user getting value? 
      Recommend: Keep, Pause, or Cancel.
    `;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
};
