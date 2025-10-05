//uma página de termos de uso com indice para rapida navegação
export default function TermosDeUso() {
    return (
        <>
            <main className='w-full open-sans text-lg flex  justify-center pt-[150px] pb-[150px] bg-stone-950 '>
                <div className="flex flex-col gap-5 w-100 lg:w-240 md:w-160">
                    <h1 className='archivo-black-regular text-5xl'>Termos de Serviço</h1>
                    <p>Última atualização: 25 de setembro de 2025</p>

                    <div className=" flex gap-10">
                        <div className="conteudo w-180 flex flex-col gap-2">

                            <h2 className="text-xl font-bold" id="termos">1. Aceitação dos Termos</h2>
                            <p>Ao acessar ou utilizar o sistema de monitoramento agropecuário (“Sistema”), o usuário declara ter lido, compreendido e aceitado integralmente estes Termos de Uso. Se você não concordar com qualquer condição aqui estabelecida, não deverá utilizar o Sistema.</p> <br></br>

                            <h2 className="text-xl font-bold" id="definicoes">2. Definições</h2>
                            <p><b>Sistema:</b> Plataforma digital (web, mobile ou desktop) para monitoramento, gestão e análise de dados agropecuários. <br></br>
                                <b>Usuário:</b> Pessoa física ou jurídica que acessa e utiliza o Sistema.<br></br>
                                <b>Dados:</b> Informações inseridas, coletadas ou geradas pelo uso do Sistema, incluindo dados climáticos, de solo, sensores, produtividade, localização, entre outros.</p><br></br>

                            <h2 className="text-xl font-bold" id="funcionalidade">3. Funcionalidade do Sistema</h2>
                            <p>O Sistema oferece funcionalidades como (mas não se limitando a):</p>
                            <ul className="list-disc pl-5">
                                <li>Monitoramento remoto de sensores em áreas agrícolas;</li>
                                <li>Visualização de dados ambientais, climáticos e operacionais;</li>
                                <li>Geração de relatórios e alertas;</li>
                                <li>Armazenamento e histórico de dados de monitoramento.</li></ul>
                            <p> O acesso a algumas funcionalidades pode depender do plano contratado ou da disponibilidade técnica em determinada região.</p><br></br>


                            <h2 className="text-xl font-bold" id="obrigacoes">4. Obrigações do Usuário</h2>
                            <p>O usuário, ao utilizar o sistema, se compromete a:</p>
                            <ul className="list-[lower-alpha] pl-5">
                                <li>Fornecer informações verdadeiras, precisas e atualizadas no momento do cadastro e durante o uso do Sistema;</li>
                                <li>Utilizar o Sistema de acordo com a legislação vigente, com estes Termos de Uso e com os princípios da boa-fé;</li>
                                <li>Não utilizar o Sistema para fins ilícitos, fraudulentos ou que infrinjam direitos de terceiros;</li>
                                <li>Manter a confidencialidade de suas credenciais de acesso, sendo responsável por todas as ações realizadas por meio de sua conta.</li>
                            </ul><br></br>

                            <h2 className="text-xl font-bold" id="propriedade">5. Propriedade Intelectual</h2>
                            <p>Todo o conteúdo do Sistema, incluindo textos, gráficos, logotipos, imagens, vídeos, códigos e funcionalidades, é de propriedade exclusiva da empresa desenvolvedora ou de seus licenciadores, sendo protegido pelas leis de propriedade intelectual.
                                O uso do Sistema não concede ao Usuário qualquer direito sobre tais conteúdos, exceto pela licença limitada, não exclusiva e intransferível para uso conforme previsto nestes Termos.</p><br></br>

                            <h2 className="text-xl font-bold" id="privacidade">6. Privacidade e Proteção de Dados</h2>
                            <p>Os dados coletados pelo Sistema serão tratados de acordo com a Política de Privacidade aplicável, em conformidade com a legislação de proteção de dados vigente (como a LGPD - Lei Geral de Proteção de Dados).
                                O Usuário declara estar ciente de que seus dados poderão ser utilizados para a prestação dos serviços, análises internas, melhorias do Sistema e, quando autorizado, para fins comerciais ou estatísticos.</p><br></br>

                            <h2 className="text-xl font-bold" id="limitacao">7. Limitação de Responsabilidade</h2>
                            <p>O Sistema é fornecido “como está”, sem garantias de funcionamento ininterrupto, livre de erros ou totalmente seguro.<br></br>
                                A empresa não se responsabiliza por:</p>
                            <ul className="list-[lower-alpha] pl-5">
                                <li>Quaisquer danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do Sistema;</li>
                                <li>Falhas de conexão à internet, interferências externas ou indisponibilidade de serviços de terceiros;</li>
                                <li>Decisões tomadas com base nas informações disponibilizadas pelo Sistema.</li>
                            </ul><br></br>

                            <h2 className="text-xl font-bold" id="modificacoes">8. Modificações nos Termos e no Sistema</h2>
                            <p>A empresa reserva-se o direito de alterar, a qualquer momento, estes Termos de Uso ou as funcionalidades do Sistema, mediante aviso prévio ao Usuário, por meio da própria plataforma ou por outros canais de comunicação.
                                A continuidade do uso após tais alterações será considerada como aceitação tácita das novas condições.</p><br></br>

                            <h2 className="text-xl font-bold" id="cancelamento">9. Cancelamento e Encerramento de Conta</h2>
                            <p>O Usuário pode solicitar o cancelamento de sua conta a qualquer momento, por meio dos canais de atendimento disponíveis.
                                A empresa também poderá encerrar ou suspender o acesso do Usuário em caso de violação destes Termos ou de uso indevido do Sistema.</p><br></br>

                            <h2 className="text-xl font-bold" id="disposicoes">10. Disposições Gerais</h2>
                            <ul className="list-[lower-alpha] pl-5">
                                <li>Quaisquer danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do Sistema;</li>
                                <li>Falhas de conexão à internet, interferências externas ou indisponibilidade de serviços de terceiros;</li>
                                <li>Decisões tomadas com base nas informações disponibilizadas pelo Sistema.</li>
                            </ul>

                        </div>
                        <div className="indice hidden md:block md:sticky  md:top-4 md:self-start">
                            <h2 className="text-xl pb-2"><b>Índice</b></h2>
                            <ul className="">
                                <li className="pb-2"><a href="#termos">1. Aceitação de Termos</a></li>
                                <li className="pb-2"><a href="#definicoes">2. Definições</a></li>
                                <li className="pb-2"><a href="#funcionalidade">3. Funcionalidade do Sistema</a></li>
                                <li className="pb-2"><a href="#obrigacoes">4. Obrigações do Usuário</a></li>
                                <li className="pb-2"><a href="#propriedade">5. Propriedade Intelectual</a></li>
                                <li className="pb-2"><a href="#privacidade">6. Privacidade e Proteção de Dados</a></li>
                                <li className="pb-2"><a href="#limitacao">7. Limitação de Responsabilidade</a></li>
                                <li className="pb-2"><a href="#modificacoes">8. Modificações nos Termos e no Sistema</a></li>
                                <li className="pb-2"><a href="#cancelamento">9. Cancelamento e Encerramento de Conta</a></li>
                                <li className="pb-2"><a href="#disposicoes">10. Disposições Gerais</a></li>

                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}