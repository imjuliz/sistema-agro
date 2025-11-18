"use client";
import Navbar from "@/components/Home/sections/navbar/default";
import Footer from "@/components/Home/sections/footer/default";
import Catalogo from '@/components/catalogo/catalogo';

export default function Page() {
  return (
    <>
    <Navbar />
    <Catalogo/>
    <Footer />
    </>
  )
}