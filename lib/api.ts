/**
 * API client for backend services.
 * Uses relative /api when Next.js rewrites proxy to backend.
 * For standalone frontend, set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:5000)
 */
const API_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000")
  : ''

function getAuthHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// --- Admin Blogs API ---
export interface BlogListItem {
  id: number
  title: string
  slug: string
  excerpt: string | null
  category: { id: number; name: string; slug: string } | null
  is_published: boolean
  is_featured: boolean
  views: number
  reading_time: number | null
  created_at: string | null
  updated_at: string | null
  featured_image?: string | null
}

export interface BlogsListResponse {
  blogs: BlogListItem[]
  pagination: {
    page: number
    per_page: number
    total: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export async function getBlogs(
  params?: { page?: number; per_page?: number; search?: string; category_id?: number; category_slug?: string }
): Promise<BlogsListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.per_page) searchParams.set('per_page', String(params.per_page))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.category_id) searchParams.set('category_id', String(params.category_id))
  if (params?.category_slug) searchParams.set('category_slug', params.category_slug)

  const qs = searchParams.toString()
  const res = await fetch(`${API_BASE}/api/blogs${qs ? `?${qs}` : ''}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blogs')
  return data
}

export interface BlogDetail extends BlogListItem {
  content: string
  tags: string[] | { id: number; name: string }[]
  author: { id: number; username: string; profile_image: string | null } | null
  related_blogs: BlogListItem[]
}

export async function getBlog(slugOrId: string | number): Promise<BlogDetail> {
  const res = await fetch(`${API_BASE}/api/blogs/${slugOrId}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blog')
  return data.blog
}


export async function adminGetBlogs(
  token: string,
  params?: { page?: number; per_page?: number; search?: string; category_id?: number; status?: string }
): Promise<BlogsListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.per_page) searchParams.set('per_page', String(params.per_page))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.category_id) searchParams.set('category_id', String(params.category_id))
  if (params?.status) searchParams.set('status', params.status)
  const qs = searchParams.toString()
  const res = await fetch(`${API_BASE}/api/admin/blogs${qs ? `?${qs}` : ''}`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blogs')
  return data
}

export async function adminGetBlog(token: string, blogId: number) {
  const res = await fetch(`${API_BASE}/api/admin/getblogs/${blogId}`, { headers: getAuthHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blog')
  return data
}

export async function adminCreateBlog(token: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/admin/blogs`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.errors ? JSON.stringify(data.errors) : 'Failed to create blog')
  return data
}

export async function adminUpdateBlog(token: string, blogId: number, payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/admin/blogs/${blogId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.errors ? JSON.stringify(data.errors) : 'Failed to update blog')
  return data
}
// export async function adminGetBlog(token: string, blogId: number) {
//   const res = await fetch(`${API_BASE}/api/admin/blogs/${blogId}`, { 
//     headers: getAuthHeaders(token) 
//   })
//   const data = await res.json()
//   if (!res.ok) throw new Error(data.message || 'Failed to fetch blog')
//   return data
// }

export async function adminDeleteBlog(token: string, blogId: number) {
  const res = await fetch(`${API_BASE}/api/admin/blogs/${blogId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete blog')
  return data
}

// --- Admin Categories API ---
export interface CategoryItem {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export async function adminGetCategories(token: string): Promise<{ categories: CategoryItem[]; count: number }> {
  const res = await fetch(`${API_BASE}/api/admin/categories`, { headers: getAuthHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories')
  return data
}

export async function getCategories(): Promise<{ categories: CategoryItem[]; count: number }> {
  const res = await fetch(`${API_BASE}/api/categories`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories')
  return data
}

export async function adminCreateCategory(token: string, payload: { name: string; description?: string; image?: string }) {
  const res = await fetch(`${API_BASE}/api/admin/categories`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || (data.errors && JSON.stringify(data.errors)) || 'Failed to create category')
  return data
}

export async function adminUpdateCategory(
  token: string,
  categoryId: number,
  payload: { name?: string; description?: string; image?: string; is_active?: boolean }
) {
  const res = await fetch(`${API_BASE}/api/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || (data.errors && JSON.stringify(data.errors)) || 'Failed to update category')
  return data
}

export async function adminDeleteCategory(token: string, categoryId: number) {
  const res = await fetch(`${API_BASE}/api/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete category')
  return data
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface EinsteineChatPayload {
  message: string
  chat_history?: ChatMessage[]
  entry_source?: string
  landing_context?: string
}

export interface BlogGeneratorChatPayload {
  message: string
  chat_history?: ChatMessage[]
  category_hint?: string
  level_hint?: string
}

export async function einsteineChat(payload: EinsteineChatPayload): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat/einsteine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to get response')
  return data.response
}

export async function blogGeneratorChat(
  payload: BlogGeneratorChatPayload,
  token: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat/blog-generator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to generate content')
  return data.response
}
export async function adminUploadImage(token: string, file: File): Promise<{ filename: string; url: string }> {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_BASE}/api/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to upload image')
  return data
}

export async function adminAutoGenerateBlog(
  token: string,
  payload: { topic: string; category?: string; level?: string }
): Promise<any> {
  const res = await fetch(`${API_BASE}/api/chat/blog-generator`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      message: payload.topic,
      category_hint: payload.category,
      level_hint: payload.level,
      generate_json: true
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to auto-generate blog')
  return data.blog
}

// --- Comments API ---

export interface Comment {
  id: number
  blog_id: number
  content: string
  name: string
  email?: string
  is_published: boolean
  created_at: string
  blog_title?: string
}

export async function getComments(blogId: number): Promise<{ comments: Comment[] }> {
  const res = await fetch(`${API_BASE}/api/blogs/${blogId}/comments`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch comments')
  return data
}

export async function postComment(blogId: number, payload: { name: string; email?: string; content: string }) {
  const res = await fetch(`${API_BASE}/api/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to post comment')
  return data
}

export async function adminGetComments(token: string, status?: string): Promise<{ comments: Comment[] }> {
  const url = status ? `${API_BASE}/api/admin/comments?status=${status}` : `${API_BASE}/api/admin/comments`
  const res = await fetch(url, {
    headers: getAuthHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch comments')
  return data
}

export async function adminPublishComment(token: string, commentId: number) {
  const res = await fetch(`${API_BASE}/api/admin/comments/${commentId}/publish`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to publish comment')
  return data
}

export async function adminDenyComment(token: string, commentId: number) {
  const res = await fetch(`${API_BASE}/api/admin/comments/${commentId}/deny`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to deny comment')
  return data
}

export async function adminDeleteComment(token: string, commentId: number) {
  const res = await fetch(`${API_BASE}/api/admin/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete comment')
  return data
}
// --- Admin Users API ---
export interface UserItem {
  id: number
  username: string
  name: string
  profile_image: string | null
  role: string
  bio: string
  is_active: boolean
  created_at: string | null
}

export async function adminGetUsers(token: string): Promise<{ users: UserItem[]; count: number }> {
  const res = await fetch(`${API_BASE}/api/auth/users`, { headers: getAuthHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users')
  return data
}

export async function adminCreateUser(token: string, payload: { username: string; password?: string; name?: string; profile_image?: string; role?: string; bio?: string }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || (data.errors && JSON.stringify(data.errors)) || 'Failed to create user')
  return data
}

export async function adminToggleUserStatus(token: string, userId: number) {
  const res = await fetch(`${API_BASE}/api/auth/users/${userId}/toggle-status`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update user status')
  return data
}

export async function adminDeleteUser(token: string, userId: number) {
  const res = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete user')
  return data
}

export async function adminGetStats(token: string): Promise<{
  stats: {
    total_blogs: number
    total_categories: number
    total_users: number
    total_views: number
    published_blogs: number
    draft_blogs: number
    featured_blogs: number
    average_views: number
  }
  category_distribution: { category: string; count: number }[]
  latest_blogs: BlogListItem[]
}> {
  const res = await fetch(`${API_BASE}/api/admin/blogs/stats`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch stats')
  return data
}

// --- Contact Us API ---
export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  inquiry_type: string
  is_read: boolean
  created_at: string
}

export async function submitContactForm(payload: {
  name: string
  email: string
  subject: string
  message: string
  inquiry_type: string
}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to submit contact form')
  return data
}

export async function adminGetContacts(
  token: string,
  status?: 'all' | 'read' | 'unread'
): Promise<{ contacts: ContactMessage[]; count: number; unread_count: number }> {
  const url = status && status !== 'all'
    ? `${API_BASE}/api/admin/contacts?status=${status}`
    : `${API_BASE}/api/admin/contacts`
  const res = await fetch(url, { headers: getAuthHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch contacts')
  return data
}

export async function adminMarkContactRead(token: string, contactId: number) {
  const res = await fetch(`${API_BASE}/api/admin/contacts/${contactId}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to mark as read')
  return data
}

export async function adminDeleteContact(token: string, contactId: number) {
  const res = await fetch(`${API_BASE}/api/admin/contacts/${contactId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete contact')
  return data
}

