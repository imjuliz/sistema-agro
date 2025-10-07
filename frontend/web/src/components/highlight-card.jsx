// "use client";;
// import { Card } from "@/components/ui/card";


// const Component = ({ title, description, icon }) => {

//   description =[
//     {
//     text: 'Quantidade de funcionários',
//     number: 100
//   },
//    {
//     text: 'Quantidade de unidades',
//     number: 38
//   }
// ]
//   return (
//     <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
//      {description.map((item, idx) => (
//         <div
//           key={idx}
//           className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1"
//         >
//           <Card className="text-white rounded-2xl border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-white/25 hover:shadow-white/5 hover:shadow-3xl w-[300px]">
            
//             {/* Fundo animado */}
//             <div className="absolute inset-0 z-0 overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
//             </div>

//             {/* Conteúdo */}
//             <div className="p-8 relative z-10 flex flex-col items-center text-center">
//               <div className="relative mb-6">
//                 <div className="p-6 rounded-full backdrop-blur-lg border border-white/20 bg-gradient-to-br from-black/80 to-black/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
//                   <div className="transform group-hover:rotate-180 transition-transform duration-700">
//                     {icon}
//                   </div>
//                 </div>
//               </div>

//               <h3 className="mb-2 text-lg font-semibold text-gray-200">
//                 {item.text}
//               </h3>
//               <p className="text-3xl font-bold text-white">{item.number}</p>
//             </div>
//           </Card>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Component;
"use client";
import { Card } from "@/components/ui/card";

const Component = ({ title, description, icon }) => {

  description = [
    { text: 'Quantidade de funcionários', number: 100 },
    { text: 'Quantidade de unidades', number: 38 }
  ]

  return (
    <div className="flex flex-row gap-6">
      {description.map((item, idx) => (
        // Este div interno já tem as animações corretas para cada card.
        <div key={idx} className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1" >
          <Card className=" w-[250px] h-[200] text-white rounded-2xl border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-white/25 hover:shadow-white/5 hover:shadow-3xl">
            
            {/* Fundo animado */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            </div>

            {/* Conteúdo */}
            <div className="p-8 relative z-10 flex flex-col items-center text-center">
              {/* <div className="relative mb-6">
                <div className="p-6 rounded-full backdrop-blur-lg border border-white/20 bg-gradient-to-br from-black/80 to-black/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="transform group-hover:rotate-180 transition-transform duration-700">
                    {icon}
                  </div>
                </div>
              </div> */}

              <h3 className="mb-2 text-lg font-semibold text-gray-200">  {item.text}  </h3>
              <p className="text-3xl font-bold text-white">{item.number}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Component;