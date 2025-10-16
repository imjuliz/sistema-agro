"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon
} from "lucide-react";

import React from "react";

const defaultAuthor = {
  name: "Sarah Chen",
  avatarSrc: "https://randomuser.me/api/portraits/women/75.jpg",
  initials: "SC",
  role: "Senior Web Architect",
  bio: "Sarah Chen is a respected web architect with over a decade of experience in building scalable web applications. She frequently speaks at tech conferences and contributes to open-source projects.",
};

const defaultRelatedArticles = [
  {
    title: "The Rise of Serverless Architecture",
    href: "#",
  },
  {
    title: "Building Accessible Web Applications",
    href: "#",
  },
  {
    title: "The Future of State Management",
    href: "#",
  },
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

function BlogSingle1({
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
  shareTitle = "Share this article",
  relatedArticlesTitle = "Related Articles",
  relatedArticles = defaultRelatedArticles,
  newsletterTitle = "Stay Updated",
  newsletterDescription = "Subscribe to our newsletter for more hilarious stories and satirical insights.",
  newsletterButtonText = "Subscribe to Newsletter",
}) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative mb-12 h-[600px] overflow-hidden">
          <Image
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
                      <TwitterIcon className="size-4" />
                      <span className="sr-only">Share on Twitter</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <FacebookIcon className="size-4" />
                      <span className="sr-only">Share on Facebook</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <LinkedinIcon className="size-4" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
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
      </div>
    </section>
  );
}

export { BlogSingle1 };
