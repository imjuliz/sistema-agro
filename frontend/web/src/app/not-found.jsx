import './globals.css'

export default function NotFound() {
  return (
    <>
    <main className="w-full flex h-screen w-screen bg-stone-950 items-center justify-center">
      <div className="flex items-center justify-center">
        <img className=" md:w-230 m-8 " src="/Group.svg"></img>
        <div className="absolute gap-5 flex flex-col items-center">
          <h1 className="archivo-black-regular text-4xl lg:text-6xl sm:text-5xl ">Página não <br></br>encontrada</h1>
          <p className='text-center open-sans backdrop-opacity-75 text-sm lg:text-base'>Ops! O link que você tentou acessar não existe <br></br>ou foi removido.</p>
          <div className='p-4 bg-white rounded-lg open-sans-bold hover:bg-gray-200'>
            <p className='text-black '>Voltar para a página inicial</p>
          </div>
        </div>
        </div>
      
    </main>
    </>
  );
}
