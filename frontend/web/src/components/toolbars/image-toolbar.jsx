// "use client";

// import { Image as ImageIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToolbar } from "@/components/toolbars/toolbar-provider";

// export function ImageToolbar() {
//   const { editor } = useToolbar();

//   if (!editor) return null;

//   const handleAddImage = () => {
//     const url = prompt("Insira a URL da imagem:");
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   return (
//     <Button
//       type="button"
//       variant="ghost"
//       size="icon"
//       onClick={handleAddImage}
//       title="Inserir imagem"
//     >
//       <ImageIcon className="h-4 w-4" />
//     </Button>
//   );
// }
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

export function ImageToolbar() {
  const { editor } = useToolbar();
  const [tab, setTab] = useState("upload"); // "upload" ou "link"
  const [url, setUrl] = useState("");

  const fileInputRef = useRef(null);

  if (!editor) return null;

  const insertImage = (src) => {
    editor.chain().focus().setImage({ src }).run();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      insertImage(objectUrl);
      // opcional: limpar depois de usar
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    }
  };

  const handleUrlInsert = () => {
    if (url) {
      insertImage(url);
      setUrl("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Inserir imagem">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="flex justify-between mb-2 border-b">
          <button
            className={`flex-1 py-1 ${tab === "upload" ? "font-bold" : ""}`}
            onClick={() => setTab("upload")}
          >
            Carregar
          </button>
          <button
            className={`flex-1 py-1 ${tab === "link" ? "font-bold" : ""}`}
            onClick={() => setTab("link")}
          >
            Link
          </button>
        </div>

        {tab === "upload" && (
          <div className="flex flex-col gap-2">
            <div
              className="cursor-pointer border-dashed border rounded p-4 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-2 h-6 w-6" />
              Clique ou arraste para carregar
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {tab === "link" && (
          <div className="flex gap-2">
            <Input
              placeholder="Cole a URL da imagem"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleUrlInsert}>Inserir</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
