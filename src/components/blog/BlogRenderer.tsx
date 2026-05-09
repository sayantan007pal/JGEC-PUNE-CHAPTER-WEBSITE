"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface BlogRendererProps {
  content: object;
}

export default function BlogRenderer({ content }: BlogRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto mx-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-accent underline hover:text-accent/80",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-secondary rounded w-full mb-4"></div>
        <div className="h-4 bg-secondary rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-secondary rounded w-2/3"></div>
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}
