"use client";;
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip";
import {Avatar,AvatarFallback,AvatarImage,} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {DropdownMenu,DropdownMenuCheckboxItem,DropdownMenuContent,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

const data = [
    {
      id: "1",
      title: "ShadCN Clone",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "UI Guild",
      tech: "Next.js",
      criadoEm: "2024-06-01",
      contribuidores: [
        {name: "Srinath G",email: "srinath@example.com",avatar: "https://github.com/srinath.png",role: "UI Lead",},
        {name: "Kavya M",email: "kavya@example.com",avatar: "https://github.com/kavya.png",role: "Designer",},
      ],
    },
    {
      id: "2",
      title: "RUIXEN Components",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "In Progress",
      time: "Component Devs",
      tech: "React",
      criadoEm: "2024-05-22",
      contribuidores: [
        {name: "Arjun R",email: "arjun@example.com",avatar: "https://github.com/arjun.png",role: "Developer",
        },
        {name: "Divya S",email: "divya@example.com",avatar: "https://github.com/divya.png",role: "QA",},
        {name: "Nikhil V",email: "nikhil@example.com",avatar: "https://github.com/nikhil.png",role: "UX",},
      ],
    },
    {
      id: "3",
      title: "CV Jobs Platform",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "CV Core",
      tech: "Spring Boot",
      criadoEm: "2024-06-05",
      contribuidores: [
        {name: "Manoj T",email: "manoj@example.com",avatar: "https://github.com/manoj.png",role: "Backend Lead",},
      ],
    },
    {
      id: "4",
      title: "Ruixen UI Docs",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Tech Writers",
      tech: "Markdown + Docusaurus",
      criadoEm: "2024-04-19",
      contribuidores: [
        {name: "Sneha R",email: "sneha@example.com",avatar: "https://github.com/sneha.png",role: "Documentation",},
        {name: "Vinay K",email: "vinay@example.com",avatar: "https://github.com/vinay.png",role: "Maintainer",},
      ],
    },
    {
      id: "5",
      title: "Job Portal Analytics",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Data Squad",
      tech: "Python",
      criadoEm: "2024-03-30",
      contribuidores: [{name: "Aarav N",email: "aarav@example.com",avatar: "https://github.com/aarav.png",role: "Data Engineer",},],
    },
    {
      id: "6",
      title: "Real-time Chat",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Infra",
      tech: "Socket.io",
      criadoEm: "2024-06-03",
      contribuidores: [
        {name: "Neha L",email: "neha@example.com",avatar: "https://github.com/neha.png",role: "DevOps",},
        {name: "Raghav I",email: "raghav@example.com",avatar: "https://github.com/raghav.png",role: "NodeJS Engineer",},
      ],
    },
    {
      id: "7",
      title: "RUX Theme Builder",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Design Systems",
      tech: "Tailwind CSS",
      criadoEm: "2024-05-10",
      contribuidores: [{name: "Ishita D",email: "ishita@example.com",avatar: "https://github.com/ishita.png",role: "Design Engineer",},],
    },
    {
      id: "8",
      title: "Admin Dashboard",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Dashboard Core",
      tech: "Remix",
      criadoEm: "2024-05-28",
      contribuidores: [{name: "Rahul B",email: "rahul@example.com",avatar: "https://github.com/rahul.png",role: "Fullstack",},],
    },
    {
      id: "9",
      title: "OpenCV Blog Engine",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Platform",
      tech: "Node.js",
      criadoEm: "2024-01-18",
      contribuidores: [
        {name: "Sanya A",email: "sanya@example.com",avatar: "https://github.com/sanya.png",role: "API Developer",},
        {name: "Harshit V",email: "harshit@example.com",avatar: "https://github.com/harshit.png",role: "Platform Architect",},
      ],
    },
    {
      id: "10",
      title: "Dark Mode Toggle Package",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      time: "Component Devs",
      tech: "TypeScript",
      criadoEm: "2024-06-02",
      contribuidores: [{name: "Meera C",email: "meera@example.com",avatar: "https://github.com/meera.png",role: "Package Maintainer",},],
    },
  ];


const allColumns = ["Projeto","Repositorio","time","Tech","Criado em","contribuidores","Status"];

function contribuidoresTable() {
  const [visibleColumns, setVisibleColumns] = useState([...allColumns]);
  const [statusFilter, setStatusFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");

  const filteredData = data.filter((project) => {
    return ((!statusFilter || project.status === statusFilter) && (!techFilter || project.tech.toLowerCase().includes(techFilter.toLowerCase())));
  });

  const toggleColumn = (col) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]);
  };

  return (
    <div className="container my-10 space-y-4 p-4 border border-border rounded-lg bg-background shadow-sm overflow-x-auto w-1500 ">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Filtrar por tech..." value={techFilter} onChange={(e) => setTechFilter(e.target.value)} className="w-48" />
          <Input placeholder="Filtrar por status..." value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Colunas</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem key={col} checked={visibleColumns.includes(col)} onCheckedChange={() => toggleColumn(col)}>
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {visibleColumns.includes("Projeto") && <TableHead className="w-[180px]">Projeto</TableHead>}
            {visibleColumns.includes("Repositorio") && <TableHead className="w-[220px]">Repositório</TableHead>}
            {visibleColumns.includes("Time") && <TableHead className="w-[150px]">Time</TableHead>}
            {visibleColumns.includes("Tech") && <TableHead className="w-[150px]">Tech</TableHead>}
            {visibleColumns.includes("Criado em") && <TableHead className="w-[120px]">Criado em</TableHead>}
            {visibleColumns.includes("Contribuidores") && <TableHead className="w-[150px]">contribuidores</TableHead>}
            {visibleColumns.includes("Status") && <TableHead className="w-[100px]">Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length ? (
            filteredData.map((project) => (
              <TableRow key={project.id}>
                {visibleColumns.includes("Projeto") && (
                  <TableCell className="font-medium whitespace-nowrap">{project.title}</TableCell>
                )}
                {visibleColumns.includes("Repositorio") && (
                  <TableCell className="whitespace-nowrap">
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {project.repo.replace("https://", "")}
                    </a>
                  </TableCell>
                )}
                {visibleColumns.includes("Time") && <TableCell className="whitespace-nowrap">{project.time}</TableCell>}
                {visibleColumns.includes("Tech") && <TableCell className="whitespace-nowrap">{project.tech}</TableCell>}
                {visibleColumns.includes("Criado em") && <TableCell className="whitespace-nowrap">{project.criadoEm}</TableCell>}
                {visibleColumns.includes("Contribuidores") && (
                  <TableCell className="min-w-[120px]">
                    <div className="flex -space-x-2">
                      <TooltipProvider>
                        {project.contribuidores.map((contributor, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-2 ring-white hover:z-10">
                                <AvatarImage src={contributor.avatar} alt={contributor.name} />
                                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm">
                              <p className="font-semibold">{contributor.name}</p>
                              <p className="text-xs text-muted-foreground">{contributor.email}</p>
                              <p className="text-xs italic">{contributor.role}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("Status") && (
                  <TableCell className="whitespace-nowrap">
                    <Badge className={cn("whitespace-nowrap", project.status === "Active" && "bg-green-500 text-white", project.status === "Inactive" && "bg-gray-400 text-white", project.status === "In Progress" && "bg-yellow-500 text-white")}>
                      {project.status}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={visibleColumns.length} className="text-center py-6">Sem resultados</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default contribuidoresTable;