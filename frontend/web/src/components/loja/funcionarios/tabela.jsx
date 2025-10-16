"use client"
import * as React from "react"
import {flexRender,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table"
import {IconPlus,IconDotsVertical,IconPencil,IconTrash,} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import {Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"

const dadosIniciais = [
  { id: "USR001", nome: "Ana Silva", email: "ana.silva@example.com", telefone: "(11) 98765-4321", status: "ativo" },
  { id: "USR002", nome: "Bruno Costa", email: "bruno.costa@example.com", telefone: "(21) 91234-5678", status: "ativo" },
  { id: "USR003", nome: "Carlos Pereira", email: "carlos.p@example.com", telefone: "(31) 95555-8888", status: "inativo" },
  { id: "USR004", nome: "Daniela Martins", email: "daniela.m@example.com", telefone: "(41) 98877-6655", status: "ativo" },
  { id: "USR005", nome: "Eduardo Alves", email: "edu.alves@example.com", telefone: "(51) 99999-1111", status: "ativo" },
]

function FuncionarioDrawer({ isOpen, setIsOpen, funcionario, onSave }) {
  const [formData, setFormData] = React.useState({
    primeiroNome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    senha: "",
    status: "ativo",
  })

  React.useEffect(() => {
    if (funcionario) {
      const [primeiroNome = "", sobrenome = ""] = funcionario.nome.split(" ")
      setFormData({
        primeiroNome,
        sobrenome,
        email: funcionario.email,
        telefone: funcionario.telefone,
        senha: "",
        status: funcionario.status,
      })
    } else {
      setFormData({
        primeiroNome: "",
        sobrenome: "",
        email: "",
        telefone: "",
        senha: "",
        status: "ativo",
      })
    }
  }, [funcionario, isOpen])

  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
    return regex.test(senha)
  }

  const validarEmail = (email) => {return /\S+@\S+\.\S+/.test(email)}

  const validarTelefone = (telefone) => {
    const apenasNumeros = telefone.replace(/\D/g, "")
    return apenasNumeros.length <= 11 && apenasNumeros.length >= 10
  }

  const handleSave = () => {
    if (!formData.primeiroNome || !formData.sobrenome || !formData.email || !formData.telefone) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if (!validarEmail(formData.email)) {
      alert("Por favor, insira um email válido contendo '@'.")
      return
    }

    if (!validarTelefone(formData.telefone)) {
      alert("O telefone deve conter apenas números e no máximo 11 dígitos (DDD + número).")
      return
    }

    if (!funcionario && !validarSenha(formData.senha)) {
      alert("A senha deve conter:\n Pelo menos 6 caracteres,\n Pelo menos uma letra maiúscula,\n Pelo menos uma minúscula, \n Pelo menos um número.")
      return
    }

    const id = funcionario ? funcionario.id : `USR${Math.floor(Math.random() * 900) + 100}`
    const nomeCompleto = `${formData.primeiroNome} ${formData.sobrenome}`

    onSave({
      id,
      nome: nomeCompleto,
      email: formData.email,
      telefone: formData.telefone,
      status: formData.status,
    })
    setIsOpen(false)
  }

  const handleTelefoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 11) {setFormData({ ...formData, telefone: value })}
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {funcionario ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </SheetTitle>
          <SheetDescription>Preencha as informações abaixo.</SheetDescription>
        </SheetHeader>

        <div className="py-4 flex flex-col gap-4 items-center">
          <div className="grid gap-1.5 w-[80%]">
            <Label htmlFor="primeiroNome">Primeiro Nome</Label>
            <Input id="primeiroNome" value={formData.primeiroNome} onChange={(e) =>setFormData({ ...formData, primeiroNome: e.target.value })}/>
          </div>

          <div className="grid gap-1.5 w-[80%]">
            <Label htmlFor="sobrenome">Sobrenome</Label>
            <Input id="sobrenome" value={formData.sobrenome} onChange={(e) =>setFormData({ ...formData, sobrenome: e.target.value })}/>
          </div>

          <div className="grid gap-1.5 w-[80%]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) =>setFormData({ ...formData, email: e.target.value })}/>
          </div>

          <div className="grid gap-1.5 w-[80%]">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" type="tel"inputMode="numeric" maxLength={11} placeholder="Apenas números (ex: 11987654321)" value={formData.telefone} onChange={handleTelefoneChange}/>
          </div>

          {!funcionario && (
            <div className="grid gap-1.5 w-[80%]">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={formData.senha} onChange={(e) =>setFormData({ ...formData, senha: e.target.value })}placeholder="Mínimo 6 caracteres, 1 maiúscula, 1 minúscula e 1 número"/>
            </div>
          )}

          <div className="grid gap-1.5 w-[80%]">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) =>setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button onClick={handleSave}>Salvar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}


export function TabelaFuncionarios() {
  const [data, setData] = React.useState(() => dadosIniciais)
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [editingFuncionario, setEditingFuncionario] = React.useState(null)

  const handleAddNew = () => {
    setEditingFuncionario(null)
    setIsDrawerOpen(true)
  }

  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario)
    setIsDrawerOpen(true)
  }
  
  const handleDelete = (id) => {if (window.confirm("Tem certeza que deseja apagar este funcionário?")) {setData(data.filter(f => f.id !== id));}}

  const handleSave = (funcionario) => {
    const isEditing = data.some(f => f.id === funcionario.id)
    if (isEditing) {setData(data.map(f => f.id === funcionario.id ? funcionario : f))}
    else {setData([...data, funcionario])}
  }

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "telefone", header: "Telefone" },
    {accessorKey: "status",header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (<Badge variant={status === "ativo" ? "default" : "destructive"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>)
      },
    },
    {id: "actions",header: "Ações",
      cell: ({ row }) => {
        const funcionario = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span><IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(funcionario)}>
                <IconPencil className="mr-2 h-4 w-4" />Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(funcionario.id)} className="text-red-600">
                <IconTrash className="mr-2 h-4 w-4" />Apagar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )},},]

  const table = useReactTable({
    data,columns,state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input placeholder="Pesquisar por nome" value={(table.getColumn("nome")?.getFilterValue()) ?? ""} onChange={(event) =>table.getColumn("nome")?.setFilterValue(event.target.value)} className="max-w-sm"/>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Total de {table.getFilteredRowModel().rows.length} funcionários</span>
          <Button onClick={handleAddNew}><IconPlus className="mr-2 h-4 w-4" /> Adicionar Funcionário</Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )})}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell,cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Nenhum resultado encontrado.</TableCell></TableRow>
            )}
          </TableBody></Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Próximo</Button>
      </div>
      <FuncionarioDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} funcionario={editingFuncionario} onSave={handleSave}/>
    </div>
  )}