"use client";
import Image from '@tiptap/extension-image'
import StarterKit from "@tiptap/starter-kit";
import BlogPage from "@/components/blog/blog-page";
import Navbar from "@/components/Home/sections/navbar/default";
import Footer from "@/components/Home/sections/footer/default";

const extensions = [
	StarterKit.configure({
		orderedList: {HTMLAttributes: {class: "list-decimal",},},
		bulletList: {HTMLAttributes: {class: "list-disc",},
		},
		code: {HTMLAttributes: {class: "bg-accent rounded-md p-1",},},
		horizontalRule: {HTMLAttributes: {class: "my-2",},},
		codeBlock: {HTMLAttributes: {class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",},},
		heading: {
			levels: [1, 2, 3, 4],
			HTMLAttributes: {class: "tiptap-heading",},
		},
	}),
      Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {class: 'imagem-editor', }, // opcional
    }),
];

const content = `<h2 class="tiptap-heading" style="text-align: center">Hello world 🌍</h2>`;

export default function Page() {
  return (
    <>
    <Navbar />
    <BlogPage />
    <Footer />
    </>
  )
}