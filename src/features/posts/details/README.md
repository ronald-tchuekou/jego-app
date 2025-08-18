# Post Details Components

This folder contains components for displaying detailed views of posts for both regular users and administrators.

## Components

### `PostDetails`
The main wrapper component that automatically determines whether to show the user or admin view based on the current user's role.

**Props:**
- `post: PostModel | null` - The post to display
- `loading?: boolean` - Loading state
- `error?: string` - Error message to display
- `onEdit?: () => void` - Callback for edit action (admin only)
- `onDelete?: () => void` - Callback for delete action (admin only)
- `onStatusChange?: (status: string) => void` - Callback for status changes (admin only)

### `PostDetailsUser`
User-focused view that displays post content in a clean, readable format.

**Features:**
- Responsive design optimized for mobile and desktop
- Clean typography with proper content spacing
- Author information section
- Post metadata (creation date, category, type)
- Image display with loading states

### `PostDetailsAdmin`
Admin view with additional management features and detailed metadata.

**Features:**
- All features from user view
- Admin action panel with status management
- Detailed user information sidebar
- Post metadata panel with IDs and timestamps
- Status change dropdown with visual indicators
- Edit, delete, and status change actions

### `PostDetailsPage`
Complete page component that handles all the business logic for post details.

**Features:**
- Authentication checks
- Permission validation
- Action handling (edit, delete, status change)
- Error handling and loading states
- Toast notifications
- Navigation management

### `useCanViewPost`
Hook to determine if the current user can view a specific post based on its status and user permissions.

**Rules:**
- Published posts: visible to everyone
- Draft/Archived posts: only visible to:
  - The post author
  - Administrators
  - Company agents (for posts from their company)

## Usage Examples

### Basic Usage in a Page Component

```tsx
import { PostDetailsPage } from '@/features/posts/details'
import PostService from '@/services/post-service'

export default async function PostPage({ params }: { params: { id: string } }) {
  let post = null
  let error = null

  try {
    post = await PostService.getById(params.id)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load post'
  }

  return <PostDetailsPage post={post} error={error} />
}
```

### Using Individual Components

```tsx
import { PostDetails } from '@/features/posts/details'
import { useRouter } from 'next/navigation'

function MyPostComponent({ post }: { post: PostModel }) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/posts/edit/${post.id}`)
  }

  const handleDelete = () => {
    // Handle delete logic
  }

  const handleStatusChange = (status: string) => {
    // Handle status change logic
  }

  return (
    <PostDetails
      post={post}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
    />
  )
}
```

### Server Actions

The module exports server actions for post management:

```tsx
import { deletePostAction, updatePostStatusAction } from '@/features/posts/details'
import { useAction } from 'next-safe-action/hooks'

function usePostActions(postId: string) {
  const { execute: deletePost } = useAction(deletePostAction, {
    onSuccess: () => {
      // Handle success
    }
  })

  const { execute: updateStatus } = useAction(updatePostStatusAction, {
    onSuccess: () => {
      // Handle success
    }
  })

  return {
    deletePost: () => deletePost({ postId }),
    updateStatus: (status: string) => updateStatus({ postId, status })
  }
}
```

## Responsive Design

All components are fully responsive with:

- **Mobile (< 640px)**: Single column layout, stacked elements
- **Tablet (640px - 1024px)**: Optimized spacing and typography
- **Desktop (> 1024px)**: Multi-column layouts for admin view

## Accessibility

Components include:

- Proper semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly content
- High contrast color schemes

## User Roles and Permissions

The components respect the following user roles:

- **`ADMIN`**: Full access to all posts and management features
- **`COMPANY_ADMIN`**: Can manage posts from their company
- **`COMPANY_AGENT`**: Can view posts from their company
- **`USER`**: Can only view published posts and manage their own posts

## Status Management

Posts can have the following statuses:

- **`published`**: Visible to all users
- **`draft`**: Only visible to author and admins
- **`archived`**: Only visible to author and admins

Status changes are handled through the admin interface with proper validation and user feedback.
