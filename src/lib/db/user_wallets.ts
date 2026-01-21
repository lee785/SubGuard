/**
 * User Wallet Database with JSON File Persistence
 * Links Privy user IDs to Circle wallet addresses
 * 
 * For demo: Uses JSON file for persistence across server restarts
 * For production: Replace with proper database (PostgreSQL, etc.)
 */

import fs from 'fs';
import path from 'path';

interface UserWallet {
    walletId: string;
    address: string;
    blockchain: string;
    createdAt: string;
    tier: string;
}

// Path to the JSON database file
const DB_PATH = path.join(process.cwd(), 'data', 'user_wallets.json');

// In-memory store (server-side)
let walletStore: Record<string, UserWallet> = {};

// Load data from file on startup
function loadFromFile() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            walletStore = JSON.parse(data);
            console.log(`[DB] Loaded ${Object.keys(walletStore).length} wallets from file`);
        }
    } catch (e) {
        console.error('[DB] Failed to load data:', e);
    }
}

// Save data to file
function saveToFile() {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(walletStore, null, 2));
    } catch (e) {
        console.error('[DB] Failed to save data:', e);
    }
}

// Initialize: load data on module load
loadFromFile();

/**
 * Get wallet by Privy user ID
 */
export function getWalletByUserId(userId: string): UserWallet | null {
    return walletStore[userId] || null;
}

/**
 * Save user wallet mapping
 */
export function saveUserWallet(
    userId: string,
    walletId: string,
    address: string,
    blockchain: string = 'ARC-TESTNET'
): UserWallet {
    const wallet: UserWallet = {
        walletId,
        address,
        blockchain,
        createdAt: new Date().toISOString(),
        tier: 'free'
    };
    walletStore[userId] = wallet;
    saveToFile(); // Persist to disk
    console.log(`[DB] Saved wallet for user ${userId}: ${address}`);
    return wallet;
}

/**
 * Check if user has a wallet
 */
export function hasWallet(userId: string): boolean {
    return !!walletStore[userId];
}

/**
 * Get all wallets (for debugging)
 */
export function getAllWallets(): Record<string, UserWallet> {
    return { ...walletStore };
}

/**
 * Update user's tier
 */
export function updateUserTier(userId: string, tier: string): void {
    if (walletStore[userId]) {
        walletStore[userId].tier = tier;
        saveToFile(); // Persist to disk
        console.log(`[DB] Updated tier for user ${userId}: ${tier}`);
    }
}

/**
 * Get user's current tier
 */
export function getUserTier(userId: string): string {
    return walletStore[userId]?.tier || 'free';
}
