import './globals.css'

export default function NotFound() {
  return (
    <>
      <main className="w-full flex h-screen w-screen dark:bg-stone-950 items-center justify-center">
        <div className="flex items-center justify-center">
          {/* <img className="md:w-230 m-8 dark:fill-white fill-black" src="/img/Group.svg"></img> */}
          <svg width="855" height="323" viewBox="0 0 855 323" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-230 m-8">
            <g clipPath="url(#clip0_339_37109)">
              <path opacity="0.06" d="M0 261.233H149.646V316.037H212.671V261.233H251.338V208.408H212.671V4.2627H130.16L0 209.321V261.233ZM150.864 208.408H66.3739V205.972L148.428 76.117H150.864V208.408Z" fill="currentColor" />
              <path opacity="0.06" d="M426.075 322.888C504.475 322.888 551.82 263.212 551.972 160.454C552.124 58.4578 504.171 0 426.075 0C347.827 0 300.33 58.3055 300.178 160.454C299.873 262.908 347.522 322.736 426.075 322.888ZM426.075 268.236C390.3 268.236 367.16 232.309 367.313 160.454C367.465 89.6657 390.452 54.043 426.075 54.043C461.545 54.043 484.685 89.6657 484.685 160.454C484.837 232.309 461.698 268.236 426.075 268.236Z" fill="currentColor" />
              <path opacity="0.06" d="M602.829 261.233H752.475V316.037H815.5V261.233H854.167V208.408H815.5V4.2627H732.989L602.829 209.321V261.233ZM753.693 208.408H669.203V205.972L751.257 76.117H753.693V208.408Z" fill="currentColor" />
            </g>
            <defs>
              <clipPath id="clip0_339_37109">
                <rect width="854.167" height="322.888" fill="currentColor" />
              </clipPath>
            </defs>
          </svg>

          <div className="absolute gap-5 flex flex-col items-center">
            <h1 className="archivo-black-regular text-4xl lg:text-6xl sm:text-5xl ">Página não <br></br>encontrada</h1>
            <p className='text-center open-sans backdrop-opacity-75 text-sm lg:text-base'>Ops! O link que você tentou acessar não existe <br></br>ou foi removido.</p>
            <button className='px-4 py-3 bg-stone-950 dark:bg-white rounded-lg open-sans-bold dark:hover:bg-gray-200 hover:bg-stone-700 cursor-pointer'>
              <a href='/' className='text-white dark:text-black'>Voltar para a página inicial</a>
            </button>
          </div>
        </div>

      </main>
    </>
  );
}
