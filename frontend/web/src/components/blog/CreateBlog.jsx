"use client"
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Save, Eye } from 'lucide-react';

export default function CreateBlog () {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleSaveDraft = () => {
    console.log('Saving as draft:', { title, content, thumbnail });
    toast.success('Blog saved as draft!');
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    console.log('Publishing blog:', { title, content, thumbnail });
    toast.success('Blog published successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Create and publish technical blog content
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter blog post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  className="min-h-96"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  In a real application, this would be a rich text editor with image upload capabilities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>

              {thumbnail && (
                <div className="space-y-2">
                  <Label>Thumbnail Preview</Label>
                  <img
                    src={thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  In production, this would handle file uploads
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button className="w-full" onClick={handlePublish}>
                Publish Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};