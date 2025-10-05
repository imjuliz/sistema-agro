"use client";

import Link from "next/link";
import React from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import LaunchUI from "@/components/Home/logos/launch-ui";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

export default function Navigation({
  menuItems = [
    { title: "Para você", content: "components" },
    { title: "Sobre Nós", href: '/sobreNos', isLink: true },
    { title: "Blog", href: '/blog', isLink: true },
  ],
  components = [
    {
      title: "Para Matriz/Empresa",
      href: "/paraEmpresa",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Proprietário de fazenda",
      href: "/paraFazenda",
      description: "For sighted users to preview content available behind a link.",
    },
    // {
    //   title: "Progress",
    //   href: "/docs/primitives/progress",
    //   description:
    //     "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    // },
    // {
    //   title: "Scroll-area",
    //   href: "/docs/primitives/scroll-area",
    //   description: "Visually or semantically separates content.",
    // },
    // {
    //   title: "Tabs",
    //   href: "/docs/primitives/tabs",
    //   description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    // },
    // {
    //   title: "Tooltip",
    //   href: "/docs/primitives/tooltip",
    //   description:
    //     "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    // },
  ],
  // logo = <LaunchUI />,
  // logoTitle = "Launch UI",
  // logoDescription = "Landing page template built with React, Shadcn/ui and Tailwind that you can copy/paste into your project.",
  // logoHref = siteConfig.url,
  // introItems = [
  //   {
  //     title: "Introduction",
  //     href: siteConfig.url,
  //     description: "Re-usable components built using Radix UI and Tailwind CSS.",
  //   },
  //   {
  //     title: "Installation",
  //     href: siteConfig.url,
  //     description: "How to install dependencies and structure your app.",
  //   },
  //   {
  //     title: "Typography",
  //     href: siteConfig.url,
  //     description: "Styles for headings, paragraphs, lists...etc",
  //   },
  // ],
}) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link href={item.href || ""}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <></>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ className, title, children, ...props }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
