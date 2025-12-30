'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateBlogPost } from '@/hook/blog';
import { BlogPostStatus } from '@/interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, FileText, Image as ImageIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import '../tiptap-custom.css';
import Image from 'next/image';

const NewBlogPage = () => {
  const router = useRouter();
  const createMutation = useCreateBlogPost();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    alt_text: '',
    category_id: '',
    status: BlogPostStatus.DRAFT,
    is_featured: false,
    published_at: '',
    reading_time: 0,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TiptapLink.configure({
        openOnClick: false,
      }),
      TiptapImage,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleInputChange('content', html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'title' && typeof value === 'string' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          <s>S</s>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          &quot;
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : ''}`}
          type="button"
        >
          ➡
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          type="button"
        >
          ↶
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          type="button"
        >
          ↷
        </button>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const readingTime = calculateReadingTime(formData.content);
    
    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      featured_image: formData.featured_image || undefined,
      alt_text: formData.alt_text || undefined,
      category_id: formData.category_id || undefined,
      status: formData.status,
      is_featured: formData.is_featured,
      reading_time: readingTime,
      published_at: formData.status === BlogPostStatus.PUBLISHED && !formData.published_at
        ? new Date().toISOString()
        : formData.published_at || undefined,
      seo_title: formData.seo_title || undefined,
      seo_description: formData.seo_description || undefined,
      seo_keywords: formData.seo_keywords || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create post</h1>
            <p className="text-sm text-muted-foreground">Write and publish a new article.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleInputChange('status', BlogPostStatus.DRAFT)}
            disabled={createMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save draft
          </Button>
          <Button
            type="submit"
            form="blog-form"
            disabled={createMutation.isPending}
          >
            Publish
          </Button>
        </div>
      </div>

      <form id="blog-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-900 font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter post title..."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-gray-900 font-medium">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /blog/{formData.slug || 'post-url-slug'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-gray-900 font-medium">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief summary of your post..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg">Content</CardTitle>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formData.content.replace(/<[^>]*>/g, '').length} characters • ~{calculateReadingTime(formData.content)} min read
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border border-border rounded-lg overflow-hidden bg-background">
                    <MenuBar />
                    <EditorContent editor={editor} />
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 Use the toolbar above for formatting: headings, bold, lists, alignment, and more
                  </p>

                  {formData.content && formData.content.trim() !== '<p></p>' && formData.content.trim() !== '' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Preview:</h4>
                      <article className="prose prose-sm max-w-none p-4 bg-muted rounded-lg border border-border">
                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                      </article>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">SEO Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <Label htmlFor="seo_title" className="text-gray-900 font-medium">
                    SEO Title
                  </Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    placeholder="SEO optimized title"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="seo_description" className="text-gray-900 font-medium">
                    SEO Description
                  </Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    placeholder="SEO meta description"
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="seo_keywords" className="text-gray-900 font-medium">
                    SEO Keywords
                  </Label>
                  <Input
                    id="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <Label htmlFor="status" className="text-gray-900 font-medium">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlogPostStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={BlogPostStatus.PUBLISHED}>Published</SelectItem>
                      <SelectItem value={BlogPostStatus.ARCHIVED}>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured" className="text-gray-900 font-medium">
                    Featured Post
                  </Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="published_at" className="text-gray-900 font-medium">
                    Publish Date
                  </Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) => handleInputChange('published_at', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Featured Image</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <Label htmlFor="featured_image" className="text-gray-900 font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="featured_image"
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => handleInputChange('featured_image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1.5"
                  />
                </div>

                {formData.featured_image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                    <Image
                      fill
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-full h-full object-cover"

                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.alt = 'Invalid image URL';
                      }}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="alt_text" className="text-gray-900 font-medium">
                    Alt Text
                  </Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => handleInputChange('alt_text', e.target.value)}
                    placeholder="Image description for accessibility"
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="category_id" className="text-gray-900 font-medium">
                  Select Category
                </Label>
                <Input
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  placeholder="Category ID"
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter category ID or select from list
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewBlogPage;