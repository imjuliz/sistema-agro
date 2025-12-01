"use client"
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
// import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart, 
  ThumbsDown, 
  MessageCircle, 
  Eye, 
  Calendar,
  User,
  LogIn
} from 'lucide-react';

const mockBlogs = [
  {
    id: 1,
    title: 'Getting Started with React Hooks',
    content: 'React Hooks have revolutionized the way we write React components. In this comprehensive guide, we\'ll explore the most commonly used hooks and learn how to leverage them effectively in your projects...',
    author: 'Blog Administrator',
    publishedAt: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    views: 234,
    likes: 12,
    dislikes: 1,
    comments: [
      {
        id: 1,
        author: 'John Doe',
        content: 'Great article! Very helpful for understanding hooks.',
        createdAt: '2024-01-16',
        replies: [
          {
            id: 1,
            author: 'Blog Administrator',
            content: 'Thank you! I\'m glad you found it helpful.',
            createdAt: '2024-01-16'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    content: 'TypeScript provides powerful type system features that can help you write more robust and maintainable code. Let\'s dive into some advanced patterns that every TypeScript developer should know...',
    author: 'Blog Administrator',
    publishedAt: '2024-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    views: 189,
    likes: 18,
    dislikes: 0,
    comments: []
  }
];

export const PublicBlogView = ({ onShowAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [userReactions, setUserReactions] = useState({});

  const handleReaction = (blogId, reaction) => {
    if (!isAuthenticated) {
      toast.error('Please log in to react to posts');
      return;
    }
    
    const currentReaction = userReactions[blogId];
    setUserReactions(prev => ({
      ...prev,
      [blogId]: currentReaction === reaction ? null : reaction
    }));
  };

  const handleComment = (blogId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
  console.log('Adding comment:', { blogId, comment: newComment, user: user?.name });
  setNewComment('');
  toast.success('Comment added successfully!');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (selectedBlog) {
    const blog = mockBlogs.find(b => b.id === selectedBlog);
    if (!blog) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedBlog(null)}
          className="mb-4"
        >
          ← Back to Blog List
        </Button>

        <article className="space-y-6">
          <div className="space-y-4">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{blog.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.views} views
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{blog.content}</p>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-b">
            <Button
              variant={userReactions[blog.id] === 'like' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction(blog.id, 'like')}
            >
              <Heart className="h-4 w-4 mr-1" />
              {blog.likes}
            </Button>
            
            <Button
              variant={userReactions[blog.id] === 'dislike' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction(blog.id, 'dislike')}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {blog.dislikes}
            </Button>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {blog.comments.length} comments
            </div>
          </div>

          <div className="space-y-4">
            <h3>Comments</h3>
            
            {isAuthenticated ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={() => handleComment(blog.id)}>
                  Post Comment
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-6">
                  <LogIn className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-3">
                    Please log in to leave a comment
                  </p>
                  <Button onClick={onShowAuth}>Sign In</Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {blog.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 pl-4 border-l space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(reply.author)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.author}</span>
                                    <Badge variant="secondary" className="text-xs">Admin</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Technical Blog</h1>
        <p className="text-muted-foreground">
          Insights on system design, software engineering, and technology
        </p>
      </div>

      {!isAuthenticated && (
        <Card>
          <CardContent className="text-center py-6">
            <LogIn className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-3">
              Faça login para criar, curtir e comentar posts
            </p>
            <Button onClick={onShowAuth}>Entrar</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockBlogs.map((blog) => (
          <Card key={blog.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {blog.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {blog.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {blog.comments.length}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSelectedBlog(blog.id)}
                >
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};