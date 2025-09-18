// src/Components/Chat/types.js
// TypeScript-style interface for ChatMessage (for JS projects, use JSDoc)

/**
 * @typedef {Object} ChatMessage
 * @property {number} id
 * @property {string} sender
 * @property {string} content
// timestamp removed
 */

// Example usage (JS):
// /** @type {ChatMessage} */
// const msg = { id: 1, sender: 'alice', content: 'Hello', timestamp: '2025-09-15T12:00:00Z' };

// If using TypeScript, use:
// export interface ChatMessage {
//   id: number;
//   sender: string;
//   content: string;
//   timestamp: string; // ISO string
// }
