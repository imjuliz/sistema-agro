"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductSelector from "./ProductSelector"

const formSchema = z.object({
  name_1503609575: z.string().min(1),
  name_7375090523: z.coerce.date(),
  name_1530877542: z.array(z.string()).min(1, { error: "Please select at least one item" }),
  name_5038797387: z.string(),
  name_6456591851: z.string()
});

export default function MyForm() {

  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      "name_1530877542": ["React"],
      "name_7375090523": new Date()
    },
  })

  function onSubmit(values) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField control={form.control} name="name_1503609575" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do cliente</FormLabel>
                <FormControl>
                  <Input placeholder="nome completo"
                    type=""
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="col-span-6">
            <FormField control={form.control} name="name_7375090523" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Pedido</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>Data em que o pedido está sendo feito.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <ProductSelector />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField control={form.control} name="name_5038797387" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">Boleto</SelectItem>
                    <SelectItem value="m@google.com">Pix</SelectItem>
                    <SelectItem value="m@support.com">Crédito</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="col-span-6">
            <FormField control={form.control} name="name_6456591851" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="modo de compra" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">Retirar na loja</SelectItem>
                    <SelectItem value="m@google.com">Entrega</SelectItem>
                    <SelectItem value="m@support.com">Pedir uber</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
        <Button type="submit">Enviar pedido</Button>
      </form>
    </Form>
  )
}