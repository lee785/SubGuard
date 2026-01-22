import { z } from 'zod';
import { isAddress } from 'ethers';

/**
 * Validation schema for sending USDC
 */
export const sendUSDCSchema = z.object({
    toAddress: z.string()
        .refine(isAddress, { message: 'Invalid Ethereum address' }),
    amount: z.string()
        .regex(/^\d+(\.\d{1,6})?$/, 'Invalid amount format. Must be a positive number with up to 6 decimal places.')
        .refine(val => {
            const num = parseFloat(val);
            return num > 0 && num <= 1000000;
        }, { message: 'Amount must be between 0 and 1,000,000 USDC' })
});

/**
 * Validation schema for onboarding (optional fields)
 */
export const onboardSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().min(1).max(100, 'Name too long').optional()
});

/**
 * Validation schema for tier upgrades
 */
export const tierUpgradeSchema = z.object({
    tierId: z.enum(['free', 'tier1', 'tier2'], {
        errorMap: () => ({ message: 'Invalid tier ID. Must be: free, tier1, or tier2' })
    })
});
