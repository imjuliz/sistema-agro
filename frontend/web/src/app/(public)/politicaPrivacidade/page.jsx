//uma página de termos de uso com indice para rapida navegação
export default function PoliticaDePrivacidade() {
    return (
        <>
            <main className='w-full open-sans text-lg flex  justify-center pt-[150px] pb-[150px] bg-stone-950 '>
                <div className="flex flex-col gap-5 w-100 lg:w-240 md:w-160">
                    <h1 className='archivo-black-regular text-5xl'>Política de Privacidade</h1>
                    <p>Última atualização: 30 de setembro de 2025</p>
                    <div className="justify-center  flex gap-10">
                        
                        <div className="conteudo  flex flex-col gap-2">

                            <p>Na RuralTech, sua privacidade e a segurança dos seus dados são prioridades absolutas. Esta Política de Privacidade explica detalhadamente como coletamos, utilizamos, armazenamos e protegemos as informações pessoais e operacionais dos usuários do nosso Sistema de monitoramento agropecuário.
                                Nosso compromisso é garantir total transparência sobre o tratamento dos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras normas aplicáveis, para que você possa usar nosso Sistema com confiança e tranquilidade.
                                Ao acessar ou utilizar o Sistema, você concorda com as práticas aqui descritas. Recomendamos que leia atentamente este documento para entender seus direitos e como protegemos as informações que você nos confia.</p> <br></br>

                            <h2 className="text-xl font-bold" id="infos">1. Informações Coletadas</h2>
                            <p>Podemos coletar os seguintes tipos de dados:</p>
                            <h3>a) Dados Cadastrais</h3>
                            <ul className="list-disc pl-5">
                                <li>Nome completo;</li>
                                <li>Email;</li>
                                <li>CPF/CNPJ;</li>
                                <li>Telefone de contato;</li>
                                <li>Endereço;</li>
                                <li>Dados da empresa/estabelecimento rural;</li>

                            </ul> 

                            <h3>b) Dados Operacionais e Ambientais</h3>
                            <ul className="list-disc pl-5">
                                <li>Informações de sensores (clima, solo, umidade, produtividade, etc.);</li>
                                <li>Localização geográfica (GPS);</li>
                                <li>Dados de plantio, colheita e manejo animal;</li>
                                <li>Dados financeiros, vendas e despesas (fornecidos pelo usuário).</li>
                            </ul>

                            <h3>c) Dados de Navegação e Técnicos</h3>
                            <ul className="list-disc pl-5">
                                <li>Endereço IP;</li>
                                <li>Tipo de navegador e dispositivo;</li>
                                <li>Páginas acessadas, data e hora de acesso;</li>
                                <li>Cookies e tecnologias semelhantes.</li>
                            </ul> <br></br>

                            <h2 className="text-xl font-bold" id="finalidade">2. Finalidade do Tratamento dos Dados</h2>
                            <p>Os dados coletados são utilizados para as seguintes finalidades:</p>
                            <ul className="list-disc pl-5">
                                <li>Fornecer acesso e funcionalidades do Sistema;</li>
                                <li>Monitorar e gerenciar operações agropecuárias em tempo real;</li>
                                <li>Gerar relatórios operacionais, financeiros e de rastreabilidade;</li>
                                <li>Otimizar processos produtivos por meio de análises e simulações;</li>
                                <li>Enviar alertas, notificações e recomendações baseadas em sensores ou registros;</li>
                                <li>Personalizar a experiência do usuário;</li>
                                <li>Garantir a segurança e integridade do Sistema;</li>
                                <li>Cumprir obrigações legais ou regulatórias.</li></ul><br></br>

                            <h2 className="text-xl font-bold" id="compartilhamento">3. Compartilhamento de dados</h2>
                            <p> Seus dados poderão ser compartilhados:</p>
                            <ul className="list-disc pl-5">
                                <li>Com empresas parceiras e prestadores de serviço, somente quando necessário para a execução dos serviços contratados;</li>
                                <li>Com autoridades governamentais, mediante requisição legal ou regulatória;</li>
                                <li>Com terceiros autorizados por você;</li>
                                <li>De forma anônima e agregada, para fins estatísticos, de pesquisa e melhoria da plataforma.</li>
                            </ul>
                            <p><b>Jamais vendemos ou comercializamos seus dados pessoais.</b></p><br></br>

                            <h2 className="text-xl font-bold" id="armazenamento">4. Armazenamento e Segurança dos Dados</h2>
                            <p>Adotamos medidas de segurança técnicas e administrativas para proteger os dados contra acesso não autorizado, vazamentos, perda ou destruição:</p>
                            <ul className="list-disc pl-5">
                                <li>Criptografia de dados sensíveis;</li>
                                <li>Controle de acesso baseado em permissões;</li>
                                <li>Monitoramento contínuo do ambiente;</li>
                                <li>Armazenamento em servidores seguros (nuvem ou locais);</li>
                                <li>Backups periódicos.</li>
                            </ul><br></br>

                            <h2 className="text-xl font-bold" id="retencao">5. Retenção dos Dados</h2>
                            <p>Manteremos seus dados apenas pelo tempo necessário para cumprir com as finalidades descritas nesta Política, salvo quando houver obrigações legais ou regulatórias que exijam sua retenção por período superior.<br></br> O usuário pode solicitar a exclusão de seus dados, conforme detalhado na seção 7.</p><br></br>

                            <h2 className="text-xl font-bold" id="cookies">6. Cookies e Tecnologias de Rastreamento</h2>
                            <p>Utilizamos cookies e tecnologias semelhantes para melhorar a navegação, analisar o uso da plataforma e personalizar conteúdos.<br></br>
                                Você pode gerenciar suas preferências de cookies diretamente no navegador, podendo bloqueá-los ou removê-los a qualquer momento.</p><br></br>

                            <h2 className="text-xl font-bold" id="direitos">7. Seus Direitos como Titular de Dados</h2>
                            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                            <ul className="list-disc pl-5">
                                <li>Confirmar se realizamos tratamento dos seus dados;</li>
                                <li>Acessar os dados que possuímos sobre você;</li>
                                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                                <li>Solicitar anonimização, bloqueio ou exclusão de dados desnecessários;</li>
                                <li>Portabilidade dos dados a outro fornecedor de serviço, mediante requisição;</li>
                                <li>Revogar o consentimento, quando o tratamento for baseado nele;</li>
                                <li>Solicitar a exclusão dos seus dados pessoais (exceto quando houver base legal para retenção).</li>
                            </ul><br></br>

                            <h2 className="text-xl font-bold" id="direitos">8. Responsabilidades do Usuário</h2>
                            <p>O usuário é responsável por:</p>
                            <ul className="list-disc pl-5">
                                <li>Garantir a veracidade dos dados informados;</li>
                                <li>Manter suas credenciais de acesso seguras e confidenciais;</li>
                                <li>Utilizar o sistema conforme os Termos de Uso.</li>
                            </ul><br></br>

                            <h2 className="text-xl font-bold" id="alteracoes">9. Alterações na Política de Privacidade</h2>
                            <p>Esta Política poderá ser atualizada a qualquer momento. Em caso de alterações relevantes, notificaremos os usuários por meio do sistema ou pelos canais de contato fornecidos.
                                Recomendamos que revise esta Política periodicamente.</p><br></br>

                            <h2 className="text-xl font-bold" id="contato">10. Contato</h2>
                            <p>Em caso de dúvidas, solicitações ou reclamações relacionadas a esta Política ou ao tratamento dos seus dados, entre em contato com nossa Encarregada de Proteção de Dados (DPO):</p>
                            <p>
                                <b>Nome da DPO:</b> Lorena Oshiro do Carmo <br></br>
                                <b>Email:</b> lorena.carmo@senaisp.edu.br <br></br>
                                <b>Telefone:</b> (11) 96034-4627
                            </p>

                        </div>
                        
                        <div className="indice hidden md:block md:sticky  md:top-4 md:self-start">
                            <h2 className="text-xl pb-2"><b>Índice</b></h2>
                            <ul className="">
                                <li className="pb-2"><a href="#infos">1. Informações Coletadas</a></li>
                                <li className="pb-2"><a href="#finalidade">2. Finalidade do Tratamento dos Dados</a></li>
                                <li className="pb-2"><a href="#compartilhamento">3. Compartilhamento de dados</a></li>
                                <li className="pb-2"><a href="#armazenamento">4. Armazenamento e Segurança dos Dados</a></li>
                                <li className="pb-2"><a href="#retencao">5. Retenção dos Dados</a></li>
                                <li className="pb-2"><a href="#retencao">7. Seus Direitos como Titular de Dados</a></li>
                                <li className="pb-2"><a href="#retencao">8. Responsabilidades do Usuário</a></li>
                                <li className="pb-2"><a href="#retencao">9. Alterações na Política de Privacidade</a></li>
                                <li className="pb-2"><a href="#retencao">10. Contato</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}