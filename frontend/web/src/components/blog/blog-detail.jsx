"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {CalendarIcon,ClockIcon,TwitterIcon,FacebookIcon,LinkedinIcon,} from "lucide-react";
import React, { useState } from "react";
import { Heart, ThumbsDown, MessageCircle, LogIn } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Home/sections/navbar/default";
import Footer from "@/components/Home/sections/footer/default";

const defaultAuthor = {
    name: "Sarah Chen",
    avatarSrc: "https://randomuser.me/api/portraits/women/75.jpg",
    initials: "SC",
    role: "Senior Web Architect",
    bio: "Sarah Chen is a respected web architect with over a decade of experience in building scalable web applications. She frequently speaks at tech conferences and contributes to open-source projects.",
};

const defaultRelatedArticles = [
    {title: "The Rise of Serverless Architecture",href: "#",},
    {title: "Building Accessible Web Applications",href: "#",},
    {title: "The Future of State Management",href: "#",},
];

const defaultContent = (
    <article className="prose prose-lg max-w-none dark:prose-invert">
        <h2 id="the-evolution-of-frameworks">The Evolution of Frameworks</h2>

        <h3 id="chapter-1-the-beginning">
            Chapter 1: The Web Development Renaissance
        </h3>
        <p>
            The landscape of web development has undergone a remarkable transformation
            in recent years. What started as simple HTML pages has evolved into
            complex, interactive applications that push the boundaries of what's
            possible in the browser. Modern frameworks have become the cornerstone of
            this evolution, enabling developers to build sophisticated applications
            with unprecedented efficiency.
        </p>

        <p>
            Among these innovations, <strong>Next.js</strong> has emerged as a
            game-changing framework, revolutionizing how we approach React
            applications. Its server-side rendering capabilities and intuitive routing
            system have set new standards for performance and developer experience.
        </p>

        <h3 id="chapter-2-modern-approaches">
            Chapter 2: The Rise of Component-Based Architecture
        </h3>
        <p>
            Component-based architecture has fundamentally changed how we structure
            web applications. By breaking down interfaces into reusable, modular
            components, developers can now build more maintainable and scalable
            applications. This approach has not only improved code organization but
            has also fostered better collaboration between design and development
            teams.
        </p>

        <h3 id="chapter-3-performance">Chapter 3: The Performance Revolution</h3>
        <p>
            Performance optimization has become a critical focus in modern web
            development. With users expecting near-instant load times and smooth
            interactions, developers have embraced techniques like code splitting,
            lazy loading, and advanced caching strategies. These optimizations ensure
            that applications remain fast and responsive, even as they grow in
            complexity.
        </p>

        <h3 id="chapter-4-future-trends">
            Chapter 4: Emerging Trends and Technologies
        </h3>
        <p>
            The web development landscape continues to evolve at a rapid pace. New
            tools and technologies emerge regularly, each promising to solve complex
            problems in innovative ways. From WebAssembly to Edge Computing, these
            advancements are shaping the future of how we build and deploy web
            applications.
        </p>

        <blockquote>
            <p>
                "The most exciting aspect of modern web development is how it empowers
                developers to focus on creating exceptional user experiences rather than
                wrestling with technical limitations," notes Sarah Chen, reflecting on
                the industry's evolution.
            </p>
        </blockquote>

        <p>
            As we look to the future, it's clear that web development will continue to
            evolve. The frameworks and tools we use today are just the beginning of
            what's possible. With each new innovation, we move closer to a web that's
            more powerful, accessible, and user-friendly than ever before.
        </p>

        <table>
            <thead>
                <tr>
                    <th>King&apos;s Treasury</th>
                    <th>People&apos;s happiness</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Empty</td>
                    <td>Overflowing</td>
                </tr>
                <tr>
                    <td>Modest</td>
                    <td>Satisfied</td>
                </tr>
                <tr>
                    <td>Full</td>
                    <td>Ecstatic</td>
                </tr>
            </tbody>
        </table>

        <p>
            As the designers continued to push the boundaries of their craft, they
            became revered throughout the kingdom for their innovative approach and
            the seamless user experiences they created. Their success inspired other
            teams to follow in their footsteps, and soon the entire digital realm was
            abuzz with the transformative power of Tailwind CSS.
        </p>
    </article>
);

export default function BlogSingle1({
    // Header section
    coverImage = "https://images.unsplash.com/photo-1719937206109-7f4e933230c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title = "The Future of Web Development: A Journey Through Modern Frameworks",

    // Author section
    author = defaultAuthor,
    date = "October 29, 2024",
    readTime = "5 min read",
    tags = ["Web Development", "JavaScript", "React"],

    // Content section
    content = defaultContent,

    // Sidebar section
    shareTitle = "Compartilhe esse post",
    relatedArticlesTitle = "Artigos Relacionados",
    relatedArticles = defaultRelatedArticles,
    newsletterTitle = "Stay Updated",
    newsletterDescription = "Subscribe to our newsletter for more hilarious stories and satirical insights.",
    newsletterButtonText = "Subscribe to Newsletter",
}) {

    const [userReactions, setUserReactions] = useState({});
    const [newComment, setNewComment] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(true); // simulação
    const [blogs, setBlogs] = useState([
        {
            id: 1,
            // content: "Esse é o conteúdo do post.",
            likes: 12,
            dislikes: 3,
            comments: [
                {
                    id: 1,
                    author: "Marcos Silva",
                    content: "Excelente artigo!",
                    createdAt: "2025-10-10",
                    replies: [
                        {
                            id: 11,
                            author: "Sarah Chen",
                            content: "Obrigada pelo feedback! 😊",
                            createdAt: "2025-10-11",
                        },
                    ],
                },
            ],
        },
    ]);

    function handleReaction(blogId, type) {
        setUserReactions((prev) => ({
            ...prev,
            [blogId]: prev[blogId] === type ? null : type,
        }));

        setBlogs((prevBlogs) =>
            prevBlogs.map((b) => {
                if (b.id !== blogId) return b;
                const increment = userReactions[blogId] === type ? -1 : 1;
                if (type === "like") return { ...b, likes: b.likes + increment };
                if (type === "dislike") return { ...b, dislikes: b.dislikes + increment };
                return b;
            })
        );
    }

    function handleComment(blogId) {
        if (!newComment.trim()) return;
        setBlogs((prevBlogs) =>
            prevBlogs.map((b) =>
                b.id === blogId
                    ? {
                        ...b,
                        comments: [
                            ...b.comments,
                            {
                                id: Date.now(),
                                author: "Você",
                                content: newComment,
                                createdAt: new Date().toISOString(),
                                replies: [],
                            },
                        ],
                    }
                    : b
            )
        );
        setNewComment("");
    }

    function getInitials(name) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }


    return (
        <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
            <Navbar />
            <section className="pb-16 pt-6 flex flex-col items-center">
                <div className="container">
                    <div className="relative mb-12 h-[600px] overflow-hidden">
                        <img
                            src={coverImage}
                            alt="Blog post cover image"
                            width={1200}
                            height={600}
                            className="h-full w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-r from-black/70 to-black/30 p-8 text-white">
                            <h1 className="mb-4 text-5xl font-bold leading-tight">{title}</h1>
                            <div className="mb-4 flex items-center space-x-4">
                                <Avatar className="size-12 ring-2 ring-primary ring-offset-2 ring-offset-background">
                                    <AvatarImage src={author.avatarSrc} alt={author.name} />
                                    <AvatarFallback>{author.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xl font-semibold">{author.name}</p>
                                    <p className="text-sm opacity-75">{author.role}</p>
                                </div>
                            </div>
                            <div className="mb-4 flex items-center text-sm">
                                <CalendarIcon className="mr-2 size-5" />
                                <time dateTime="2024-10-29" className="mr-4">
                                    {date}
                                </time>
                                <ClockIcon className="mr-2 size-5" />
                                <span>{readTime}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-12 md:grid-cols-12 md:gap-8">
                        <div className="md:col-span-8 lg:col-span-9">{content}</div>
                        <aside className="md:col-span-4 lg:col-span-3">
                            <div className="sticky top-20 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{shareTitle}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="icon">
                                                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M34.6526 0H41.3995L26.6594 16.847L44 39.7719H30.4225L19.7881 25.8681L7.61989 39.7719H0.868864L16.6349 21.7522L0 0H13.9222L23.5348 12.7087L34.6526 0ZM32.2846 35.7336H36.0232L11.8908 3.82626H7.87892L32.2846 35.7336Z" fill="currentColor" />
                                                </svg>
                                                <span className="sr-only">Share on Twitter</span>
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24 0C10.7453 0 0 10.7453 0 24C0 35.255 7.74912 44.6995 18.2026 47.2934V31.3344H13.2538V24H18.2026V20.8397C18.2026 12.671 21.8995 8.8848 29.9194 8.8848C31.44 8.8848 34.0637 9.18336 35.137 9.48096V16.129C34.5706 16.0694 33.5866 16.0397 32.3645 16.0397C28.4294 16.0397 26.9088 17.5306 26.9088 21.4061V24H34.7482L33.4013 31.3344H26.9088V47.8243C38.7926 46.3891 48.001 36.2707 48.001 24C48 10.7453 37.2547 0 24 0Z" fill="currentColor" />
                                                </svg>
                                                <span className="sr-only">Share on Facebook</span>
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M44.4469 0H3.54375C1.58437 0 0 1.54688 0 3.45938V44.5312C0 46.4437 1.58437 48 3.54375 48H44.4469C46.4063 48 48 46.4438 48 44.5406V3.45938C48 1.54688 46.4063 0 44.4469 0ZM14.2406 40.9031H7.11563V17.9906H14.2406V40.9031ZM10.6781 14.8688C8.39063 14.8688 6.54375 13.0219 6.54375 10.7437C6.54375 8.46562 8.39063 6.61875 10.6781 6.61875C12.9563 6.61875 14.8031 8.46562 14.8031 10.7437C14.8031 13.0125 12.9563 14.8688 10.6781 14.8688ZM40.9031 40.9031H33.7875V29.7656C33.7875 27.1125 33.7406 23.6906 30.0844 23.6906C26.3812 23.6906 25.8187 26.5875 25.8187 29.5781V40.9031H18.7125V17.9906H25.5375V21.1219H25.6312C26.5781 19.3219 28.9031 17.4188 32.3625 17.4188C39.5719 17.4188 40.9031 22.1625 40.9031 28.3313V40.9031V40.9031Z" fill="currentColor" />
                                                </svg>

                                                <span className="sr-only">Share on LinkedIn</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sobre o autor</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="size-10 ring-2 ring-primary ring-offset-2 ring-offset-background">
                                                <AvatarImage src={author.avatarSrc} alt={author.name} />
                                                <AvatarFallback>{author.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{author.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {author.role}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <p className="text-sm">{author.bio}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{relatedArticlesTitle}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {relatedArticles.map((article) => (
                                                <li key={article.title}>
                                                    <Link
                                                        href={article.href}
                                                        className="text-sm hover:underline"
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{newsletterTitle}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4 text-sm">{newsletterDescription}</p>
                                        <Button className="w-full">{newsletterButtonText}</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </aside>
                    </div>

                    {/* --- BLOCO DE INTERAÇÃO (likes, comentários etc.) --- */}
                    <div className="mt-16 space-y-8">
                        {blogs.map((blog) => (
                            <div key={blog.id}>
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
                                        {blog.comments.length} comentários
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold mt-4">Comentários</h3>

                                    {isAuthenticated ? (
                                        <div className="space-y-3">
                                            <Textarea
                                                placeholder="Escreva um comentário..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <Button onClick={() => handleComment(blog.id)}>
                                                Publicar comentário
                                            </Button>
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="text-center py-6">
                                                <LogIn className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-muted-foreground mb-3">
                                                    Faça login para comentar
                                                </p>
                                                <Button onClick={() => alert("Login simulado")}>
                                                    Entrar
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <div className="space-y-4">
                                        {blog.comments.map((comment) => (
                                            <Card key={comment.id} className={"shadow-none"}>
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
                                                                                    <Badge variant="secondary" className="text-xs">Autor</Badge>
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
                            </div>
                        ))}
                    </div>
                </div>

            </section>
            <Footer />
        </main>
    );
}