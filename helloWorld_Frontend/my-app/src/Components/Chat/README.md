# Chat System Structure

This folder contains all logic and UI for the chat system, fully integrated with your backend API on port 9091.

## Files

- `api.js`: All chat API calls (send, fetch, search, delete, etc.)
- `ChatContext.js`: React context for chat state and actions, using the API utility
- `ChatWindow.js`: UI for displaying and sending messages (refactor to use context)
- `InboxList.js`: UI for listing chat users/conversations (refactor to use context)

## Usage

1. **API Integration**: All chat features use the endpoints you provided.
2. **Context**: Wrap your app (or chat section) in `<ChatProvider>` to provide chat state/actions.
3. **Components**: Use `useChat()` in components to access messages, send, search, delete, etc.

## Extending
- Add more API functions to `api.js` as needed.
- Add more context actions in `ChatContext.js` (e.g., fetch by sender, recent, after timestamp).
- UI components can be further customized for your needs.

---

**Example:**

```jsx
import { ChatProvider, useChat } from './ChatContext';

function App() {
  return (
    <ChatProvider>
      <ChatWindow />
      <InboxList />
    </ChatProvider>
  );
}
```

See code comments for more details.
