# Chat Database Collection Setup

## Collection Name: `order_chats`

This document describes the database collection structure needed for the order chat feature.

## Attributes

| Field Name      | Type    | Required | Default | Description                           |
|----------------|---------|----------|---------|---------------------------------------|
| `$id`           | String  | Auto     | -       | Document ID (auto-generated)          |
| `orderId`       | String  | Yes      | -       | Reference to order document           |
| `senderId`      | String  | Yes      | -       | User ID of message sender             |
| `senderName`    | String  | Yes      | -       | Name of sender                        |
| `senderRole`    | String  | Yes      | -       | 'customer' or 'delivery'              |
| `message`       | String  | Yes      | -       | Message content                       |
| `createdAt`     | DateTime| Yes      | -       | Timestamp when message was created    |
| `read`          | Boolean | No       | false   | Read status (for future use)          |

## Indexes

1. **idx_orderId** → `orderId` (ASC) - For querying messages by order
2. **idx_createdAt** → `createdAt` (ASC) - For sorting messages chronologically
3. **idx_senderId** → `senderId` (ASC) - For querying messages by sender (optional)

## Permissions

### Create
- Users (customers and delivery persons) can create messages
- Condition: User must be either the customer or delivery person for the order

### Read
- Users can read messages
- Condition: User must be either the customer or delivery person for the order

### Update
- None (messages are immutable once sent)

### Delete
- Admins only (for moderation purposes)

## Environment Variable

Add this to your `.env.local`:

```
NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID=your_collection_id_here
```

## Appwrite Console Setup Steps

1. Go to Appwrite Console → Database → Your Database
2. Click "Create Collection"
3. Name it: `order_chats`
4. Add the attributes as described above
5. Set up indexes as described
6. Configure permissions:
   - **Create**: Users role (with condition that user is customer or delivery person)
   - **Read**: Users role (with condition that user is customer or delivery person)
   - **Update**: None
   - **Delete**: Admins role only
7. Copy the Collection ID and add it to your environment variables

## Notes

- Messages are stored permanently and are not deleted
- Real-time updates are handled via Appwrite real-time subscriptions
- The `read` field is included for future read receipt functionality
- Message ordering is handled by `createdAt` timestamp

