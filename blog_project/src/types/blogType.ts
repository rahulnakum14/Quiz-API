/**
 * Interface representing attributes of a blog post.
 * @interface BlogAttributes
 * @property {number} [id] - The unique identifier of the blog post.
 * @property {string} title - The title of the blog post.
 * @property {string} description - The description or content of the blog post.
 * @property {string} imageUrl - The URL of the image associated with the blog post.
 * @property {string} [createdBy] - The user ID of the creator of the blog post.
 */

interface BlogAttributes {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  createdBy?: string;
}

export default BlogAttributes;
