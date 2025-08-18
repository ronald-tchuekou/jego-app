# Posts Module

## Overview
The posts module provides complete functionality for managing posts in the application. It includes listing, filtering, status management with admin restrictions, and responsive grid layout.

## Features

### 📋 Posts Management
- **List posts** with pagination and filtering
- **Create, update, delete** posts (author or admin)
- **Status management** (draft, published, archived) - Admin only
- **Search functionality** with real-time filtering
- **Category and type filtering**

### 🔐 Admin-Only Features
- **Status updates**: Only administrators can change post status
- **Full management rights**: Admins can manage any post

### 📱 Responsive Design
- **Grid layout**: Responsive grid with maximum 5 items per row
- **Breakpoints**:
  - Mobile: 1 column
  - Small (sm): 2 columns
  - Large (lg): 3 columns
  - Extra Large (xl): 4 columns
  - 2XL: 5 columns (maximum)
- **Card-based design**: Each post displayed as a card similar to company details posts

## Components

### Core Components
- `PostsList`: Main list component with filters and grid
- `PostItem`: Individual post card component
- `PostItemActions`: Dropdown menu for post actions

### Filter Components
- `PostCategoryFilter`: Filter by category
- `PostTypeFilter`: Filter by post type
- `PostStatusFilter`: Filter by status

## Usage

```tsx
import { PostsList } from '@/features/posts'

export default function PostsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <PostsList />
    </div>
  )
}
```

## Permissions

### Regular Users
- Can create posts
- Can edit their own posts
- Can delete their own posts
- Cannot change post status

### Administrators
- Can manage all posts
- Can change post status (draft/published/archived)
- Full CRUD permissions

## API Integration
The module integrates with the existing post service and includes:
- Pagination support
- Advanced filtering
- Status management
- Search functionality

## Responsive Grid Layout
The grid adapts to screen size:
- **Mobile**: 1 column
- **Tablet**: 2-3 columns
- **Desktop**: 4-5 columns (max 5 per row)

Each post card includes:
- Optional image with hover effects
- Title and description
- Category and type badges
- Author and creation date
- Status indicator
- Action menu (based on permissions)
