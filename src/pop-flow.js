(() => {
    const styles = `
        .pop-overlay {
            position: fixed;
            inset: 0;
            border: 0;
            background: rgba(2, 6, 23, 0.58);
        }
        .pop-overlay[hidden], .pop-model-dialog[hidden] { display: none !important; }
        #pop-drawer {
            position: fixed;
            inset: 0 0 0 auto;
            z-index: 3001;
            display: flex;
            width: min(560px, 100vw);
            flex-direction: column;
            transform: translateX(100%);
            background: #0f172a;
            color: #f8fafc;
            box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
            font-family: 'Segoe UI', sans-serif;
            transition: transform 0.28s cubic-bezier(0.2, 0.75, 0.25, 1);
        }
        #pop-drawer.open { transform: translateX(0); }
        #pop-backdrop { z-index: 3000; }
        .pop-scroll { flex: 1; overflow-y: auto; padding: 20px; font-size: 14px; line-height: 1.55; }
        .cce-flow-card { margin-bottom: 10px; overflow: hidden; border: 1px solid #334155; border-radius: 6px; background: #1e293b; }
        .cce-flow-card:last-child { margin-bottom: 0; }
        .cce-flow-toggle { display: flex; width: 100%; align-items: center; gap: 12px; padding: 16px; border: 0; background: transparent; color: #f8fafc; text-align: left; cursor: pointer; }
        .cce-flow-toggle:hover, .cce-flow-toggle[aria-expanded="true"] { background: rgba(96,165,250,.08); }
        .cce-flow-number { display: grid; width: 36px; height: 36px; flex: none; place-items: center; border: 1px solid #3b6085; border-radius: 50%; color: #60a5fa; font-size: 13px; font-weight: 800; }
        .cce-flow-heading { display: grid; min-width: 0; gap: 5px; }
        .cce-flow-heading strong { font-size: 15px; }
        .cce-flow-heading span { color: #cbd5e1; font-size: 13px; line-height: 1.5; }
        .cce-flow-chevron { width: 8px; height: 8px; flex: none; margin-left: auto; transform: rotate(45deg); border-right: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8; transition: transform .18s ease; }
        .cce-flow-toggle[aria-expanded="true"] .cce-flow-chevron { transform: rotate(225deg); }
        .cce-flow-body { padding: 0 18px 18px; border-top: 1px solid #1b3958; }
        .cce-flow-body[hidden], .cce-flow-result[hidden] { display: none !important; }
        .cce-flow-badge { display: inline-block; margin: 12px 0 5px; padding: 5px 9px; border-radius: 99px; background: #173b5d; color: #83cfff; font-size: 11px; font-weight: 700; }
        .cce-flow-check { position: relative; padding: 11px 0 11px 22px; border-bottom: 1px solid #1d3955; color: #dceafa; font-size: 13px; line-height: 1.55; }
        .cce-flow-check:last-child { border-bottom: 0; }
        .cce-flow-check::before { position: absolute; left: 0; color: #34d399; content: "✓"; font-weight: 900; }
        .cce-flow-question { margin-top: 14px; padding: 16px; border: 1px dashed #3b6085; border-radius: 8px; background: #091a2d; }
        .cce-flow-question > strong { display: block; margin-bottom: 14px; font-size: 15px; }
        .cce-flow-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .cce-flow-action { padding: 10px 14px; border: 0; border-radius: 6px; color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; }
        .cce-flow-action--yes { background: #168d68; }
        .cce-flow-action--no { background: #b83f4b; }
        .cce-flow-result { margin-top: 12px; padding: 14px; border-radius: 8px; color: #dceafa; font-size: 13px; line-height: 1.55; }
        .cce-flow-result--yes { border: 1px solid #237b63; background: rgba(37,211,154,.10); }
        .cce-flow-result--no { border: 1px solid #8c3d48; background: rgba(255,95,109,.10); }
        .cce-flow-result > strong { display: block; margin-bottom: 4px; color: #f8fafc; }
        .cce-flow-substeps { margin: 8px 0 0; padding: 0; list-style: none; }
        .cce-flow-substeps li { padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
        .cce-flow-substeps li:last-child { border-bottom: 0; }
        .cce-flow-link { color: #60a5fa; overflow-wrap: anywhere; }
        .cce-flow-hint { margin: 16px 2px 0; color: #94a3b8; font-size: 12px; line-height: 1.5; }
        .pop-footer { display: flex; gap: 10px; padding: 14px; border-top: 1px solid #334155; background: #0b1329; }
        .pop-footer button { flex: 1; padding: 10px 8px; border: 1px solid #475569; border-radius: 4px; background: #1e293b; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }
        .pop-footer button:hover { border-color: #F47920; background: #26344a; }
        .pop-model-backdrop { position: fixed; inset: 0; z-index: 3010; background: rgba(2, 6, 23, 0.72); }
        .pop-model-dialog { position: fixed; z-index: 3011; top: 50%; left: 50%; display: flex; width: min(900px, calc(100vw - 32px)); height: min(80vh, 760px); min-width: min(640px, calc(100vw - 16px)); min-height: min(420px, calc(100vh - 16px)); max-width: calc(100vw - 16px); max-height: calc(100vh - 16px); box-sizing: border-box; flex-direction: column; transform: translate(-50%, -50%); overflow: hidden; border: 1px solid #334155; border-radius: 8px; background: #0f172a; color: #f8fafc; box-shadow: 0 24px 70px rgba(0,0,0,.55); }
        .pop-model-dialog[hidden] { display: none !important; }
        .pop-model-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.1); }
        .pop-model-header h3 { margin: 3px 0 0; color: #fff; font-size: 14px; }
        .pop-model-content { min-height: 0; flex: 1; overflow: auto; padding: 14px 14px 24px; }
        .pop-model-resize { position: absolute; right: 2px; bottom: 2px; z-index: 2; width: 20px; height: 20px; padding: 0; border: 0; background: transparent; cursor: nwse-resize; touch-action: none; }
        .pop-model-resize::before { position: absolute; inset: 5px; background: repeating-linear-gradient(135deg, transparent 0 3px, #64748b 3px 4px); content: ''; }
        .pop-model-resize:hover::before { background: repeating-linear-gradient(135deg, transparent 0 3px, #F47920 3px 4px); }
        body.pop-resizing, body.pop-resizing * { cursor: nwse-resize !important; user-select: none !important; }
        .pop-model-hint { margin: 0 0 14px; color: #94a3b8; font-size: 11px; line-height: 1.5; }
        .pop-template { margin-bottom: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 6px; background: #1e293b; }
        .pop-template-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,.1); }
        .pop-template-title { color: #e2e8f0; font-size: 11px; font-weight: 700; }
        .pop-copy-button { flex: none; padding: 5px 8px; border: 1px solid #475569; border-radius: 4px; background: #0f172a; color: #fff; font-size: 10px; font-weight: 700; cursor: pointer; }
        .pop-copy-button:hover { border-color: #F47920; }
        .pop-template textarea { display: block; width: 100%; min-height: 142px; resize: vertical; padding: 10px; border: 0; outline: 0; background: transparent; color: #cbd5e1; font: 11px/1.55 'Segoe UI', sans-serif; }
        .pop-template textarea:focus { box-shadow: inset 0 0 0 1px #F47920; }
        .sda_modelo { color: #cbd5e1; font: 11px/1.5 'Segoe UI', sans-serif; }
        .sda_modelo input, .sda_modelo textarea { box-sizing: border-box; width: 100%; min-width: 0; padding: 4px; border: 1px dashed #8aa0c8; background: #fffbe8; color: #1c1c1c; font: 10pt Calibri, Arial, sans-serif; }
        .sda_modelo textarea { resize: vertical; }
        .sda_modelo .sda_num { text-align: right; }
        .sda_scroll { overflow-x: auto; }
        .sda_tabela { width: 680px; border-collapse: collapse; background: #fff; color: #1c1c1c; font: 10pt Calibri, Arial, sans-serif; }
        .sda_tabela td { padding: 4px; border: 1px solid #000; }
        .sda_item-total, .sda_total { text-align: right; }
        .sda_add-row { margin-top: 8px; padding: 6px 9px; border: 1px solid #475569; border-radius: 4px; background: #1e293b; color: #fff; font-size: 10px; cursor: pointer; }
        body.pop-open { overflow: hidden; }
        @media (max-width: 480px) {
            #pop-drawer { width: 100vw; }
            .pop-model-dialog { width: calc(100vw - 16px); height: calc(88vh - 8px); min-width: min(320px, calc(100vw - 16px)); min-height: min(320px, calc(100vh - 16px)); }
            .pop-footer button { font-size: 10px; }
        }
    `;

    const emailTemplates = [
        {
            id: 'pop-email-orcamento',
            title: 'Solicitação de Orçamento',
            text: `Assunto: Solicitação de orçamento - [NOME / LOCAL]\n\nPrezado fornecedor,\n\nVenho por meio deste solicitar orçamento para contratação emergencial de prestação de serviço do item abaixo para atendimento.\nEquipamento:\nLocalização:\n\nO orçamento deverá conter os valores e condições gerais para contratação.\n\nNOTAS:\n• Após confirmação para mobilização do recurso, é obrigatório o envio no prazo máximo de 4 horas úteis, a seguinte documentação para aprovação interna da VLi:\nASO, Comprovante de treinamento de requisitos legais para atividades especiais e Comprovante de vínculo empregatício (CTPS) dos operadores mobilizados.\n• Operadores devem utilizando EPI’s, respeitarem as regras internas de segurança da VLI e os equipamentos devem estar manutenidos.\n\nCaso não sejam cumpridas essas condições, o contrato será suspenso e o recurso desmobilizado, não podendo trabalhar na frente de serviço.`
        },
        {
            id: 'sda_modelo',
            title: 'Solicitação "De acordo"',
        },
        {
            id: 'pop-email-deslocamento',
            title: 'Solicitação de Deslocamento',
            text: `Assunto: Solicitação de deslocamento - [Local]\n\nPrezado fornecedor,\n\nConfirmamos a contratação dos equipamentos conforme solicitado. Solicitamos o deslocamento imediato para o local [inserir local]. Por favor, enviem atualizações do trajeto, a previsão de chegada e o contato direto do motorista/operador.\n\nNOTAS:\n• Após confirmação para mobilização do recurso, é obrigatório o envio no prazo máximo de 4 horas úteis, a seguinte documentação para aprovação interna da VLi:\nASO, Comprovante de treinamento de requisitos legais para atividades especiais e Comprovante de vínculo empregatício (CTPS) dos operadores mobilizados.\n• Operadores devem utilizando EPI’s, respeitarem as regras internas de segurança da VLI e os equipamentos devem estar manutenidos.\n\nCaso não sejam cumpridas essas condições, o contrato será suspenso e o recurso desmobilizado, não podendo trabalhar na frente de serviço.`
        },
        {
            id: 'pop-email-desmobilizacao',
            title: 'Desmobilização',
            text: `Assunto: Liberação para desmobilização - [Equipamento]\n\nPrezados,\n\nFormalizamos a liberação para desmobilização do equipamento.\n\nFavor considerar esta data e horário para fins de medição, não sendo contabilizada a utilização do equipamento após esse período.`
        }
    ];

    const whatsappTemplates = [
        {
            id: 'pop-wa-triagem',
            title: 'Recursos Próprios (SISMOR)',
            text: `🆘 *Status Recursos* 🆘

🔻 *Próprios (SISMOR):*

* *Equipamento:* Escavadeira 23T
* *Origem:* EBJ
* *Previsão:* Sendo embarcada para iniciar deslocamento;

* *Equipamento:* Guindaste Kirow;
* *Origem:* EBJ
* *Previsão:* Previsão no local às 18h30

*⚠️ ATENÇÃO:*

* Informo que o CCE encontra-se a disposição para realizar a prospecção de fornecedores na região para a mobilização de recursos caso seja necessário a utilização no atendimento da ocorrência.
* Caso vejam a necessidade, estamos a disposição para realizar a reunião de atendimento.`
        },
        {            id: 'pop-wa-Prospecção de Recursos Terceiros',
            title: 'Prospecção de Recursos Terceiros',
            text: `🆘 *Prospecção de Fornecedores* 🆘

* DTE Equipamentos (Lavras-MG): Sem sucesso no contato;

* Santa Efigênia Equipamentos (Lavras-MG): Possui guindaste apenas com capacidade de 70 Ton;

* Costa Equipamentos (Varginha-MG) 01h30 de distancia até o local.
         (Aguardando retorno informando se possui o equipamento disponível para locação);`
        },
   
        {
            id: 'pop-wa-Recursos Terceiros',
            title: 'Recursos Terceiros',
            text: `🆘*Status Recursos*🆘

🔻Terceiros:

* Equipamento: Escavadeira 30T
* Origem: Betim (MG)
* Previsão: No local às 17h30 ✅

* Equipamento: Escavadeira 30T
* Origem: Contagem (MG)
* Previsão: Sendo embarcada, previsão no local às 17h30 ;

* Equipamento: Guindaste 200T
* Origem: Betim (MG)
* Previsão: Previsão no local às 18h30`
        },
     
    ];

    const sda_linhaItem = index => `
        <tr class="sda_item">
            <td data-sda_numero align="center" style="border:1px solid #000">${index}</td>
            <td style="border:1px solid #000"><input class="sda_input" aria-label="Descrição do item ${index}" data-sda_campo="descricao"></td>
            <td style="border:1px solid #000"><input class="sda_input" aria-label="Formato do item ${index}" data-sda_campo="formato"></td>
            <td style="border:1px solid #000"><input class="sda_input sda_num" aria-label="Quantidade do item ${index}" data-sda_campo="quantidade" inputmode="decimal" value="1"></td>
            <td style="border:1px solid #000"><input class="sda_input sda_num sda_money" aria-label="Valor unitário do item ${index}" data-sda_campo="unitario" inputmode="decimal"></td>
            <td data-sda_linha-total align="right" style="border:1px solid #000"></td>
        </tr>`;

    const sda_templateHtml = ({ id, title }) => `
        <div class="pop-template">
            <div class="pop-template-head">
                <span class="pop-template-title">${title}</span>
                <button class="pop-copy-button" type="button" data-copy-target="${id}" data-copy-type="sda"><i class="fas fa-copy" aria-hidden="true"></i> Copiar</button>
            </div>
            <div id="sda_modelo" class="sda_modelo">
                <p>Prezado, bom dia!</p>
                <p>Para atendimento ao acidente <span data-sda-vinculo="ocorrencia">____</span> em <span data-sda-vinculo="local">____</span>, segue proposta comercial do fornecedor para análise e aprovação.</p>
                <div class="sda_scroll">
                    <table class="sda_tabela" border="1" cellpadding="4" cellspacing="0" width="680" style="border-collapse:collapse;border:1px solid #000;font-family:Calibri,Arial;font-size:10pt;width:680px">
                        <tbody>
                            <tr><td colspan="6" align="center" bgcolor="#1F4E9C" style="background:#1F4E9C;color:#ffffff;border:1px solid #000"><b>SOLICITAÇÃO DE COTAÇÃO - VLI</b></td></tr>
                            <tr><td style="border:1px solid #000"><b>Fornecedor:</b></td><td colspan="3" style="border:1px solid #000"><input class="sda_input" id="sda_fo" data-sda_campo="fornecedor" aria-label="Fornecedor"></td><td style="border:1px solid #000"><b>Data:</b></td><td style="border:1px solid #000"><input class="sda_input" id="sda_da" data-sda_campo="data" aria-label="Data"></td></tr>
                            <tr><td style="border:1px solid #000"><b>Ocorrência:</b></td><td style="border:1px solid #000"><input class="sda_input" id="sda_oc" data-sda_campo="ocorrencia" aria-label="Ocorrência"></td><td style="border:1px solid #000"><b>Local:</b></td><td style="border:1px solid #000"><input class="sda_input" id="sda_lo" data-sda_campo="local" aria-label="Local"></td><td style="border:1px solid #000"><b>Contato:</b></td><td style="border:1px solid #000"><input class="sda_input" id="sda_co" data-sda_campo="contato" aria-label="Contato"></td></tr>
                            <tr><td colspan="6" align="center" style="border:1px solid #000"><b>Descrição Inicial</b></td></tr>
                            <tr><td colspan="6" style="border:1px solid #000"><textarea class="sda_input" id="sda_di" data-sda_campo="descricao-inicial" aria-label="Descrição inicial" rows="3"></textarea></td></tr>
                            <tr align="center"><td style="border:1px solid #000"><b>Item</b></td><td style="border:1px solid #000"><b>Descrição</b></td><td style="border:1px solid #000"><b>Formato</b></td><td style="border:1px solid #000"><b>Qtd</b></td><td style="border:1px solid #000"><b>Valor Unitário</b></td><td style="border:1px solid #000"><b>Total</b></td></tr>
                            ${Array.from({ length: 3 }, (_, index) => sda_linhaItem(index + 1)).join('')}
                            <tr><td colspan="5" align="center" style="border:1px solid #000"><b>TOTAL</b></td><td id="sda_tot" data-sda_total align="right" style="border:1px solid #000"><b>R$ 0,00</b></td></tr>
                        </tbody>
                    </table>
                </div>
                <button class="sda_add-row" type="button" data-sda_adicionar><i class="fas fa-plus" aria-hidden="true"></i> Adicionar item</button>
                <p>Atenciosamente,</p>
            </div>
        </div>`;

    const templateHtml = ({ id, title, text, html }) => id === 'sda_modelo' ? sda_templateHtml({ id, title }) : `
        <div class="pop-template">
            <div class="pop-template-head">
                <span class="pop-template-title">${title}</span>
                <button class="pop-copy-button" type="button" data-copy-target="${id}" ${html ? 'data-copy-type="html"' : ''}><i class="fas fa-copy" aria-hidden="true"></i> Copiar</button>
            </div>
            ${html
                ? `<div id="${id}" aria-label="Modelo editável: ${title}" style="white-space: normal; padding: 10px; color: #cbd5e1; font: 11px/1.55 'Segoe UI', sans-serif;">${html}</div>`
                : `<textarea id="${id}" aria-label="Modelo editável: ${title}">${text}</textarea>`}
        </div>`;

    const markup = `
        <button id="pop-backdrop" class="pop-overlay" type="button" aria-label="Fechar Fluxo Guiado" hidden></button>
        <aside id="pop-drawer" role="dialog" aria-modal="true" aria-labelledby="pop-title" aria-hidden="true" inert>
            <header style="padding:16px;border-bottom:1px solid #334155;display:flex;justify-content:space-between;align-items:center">
                <h2 id="pop-title" style="color:#ff5722;font-size:15px;margin:0"><i class="fas fa-clipboard-list" aria-hidden="true"></i> Fluxo Guiado — CCE</h2>
                <button id="pop-close" type="button" aria-label="Fechar fluxo guiado" style="background:none;border:0;color:#94a3b8;font-size:18px;cursor:pointer"><i class="fas fa-times" aria-hidden="true"></i></button>
            </header>
            <div class="pop-scroll">
                <article class="cce-flow-card">
                    <button class="cce-flow-toggle" type="button" aria-expanded="false" aria-controls="cce-flow-step-01" data-cce-flow-toggle>
                        <span class="cce-flow-number">01</span>
                        <span class="cce-flow-heading"><strong>Levantar a necessidade</strong><span>Identifique antecipadamente a necessidade de recursos para atendimento da ocorrência.</span></span>
                        <span class="cce-flow-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="cce-flow-body" id="cce-flow-step-01" hidden>
                        <span class="cce-flow-badge">ORIENTAÇÃO</span>
                        <div class="cce-flow-check">Em ocorrências graves (Tomabamento, Adernamento, Descarrilamento com perda de cabeça de dormente) deve-se inciar o levantamento de recuros sem aguardar a solicitação do campo.</div>
                        <div class="cce-flow-check">Em ocorrências que envolvem locomotivas, deve-se verificar a disponibilidade de guindastes.</div>
                    </div>
                </article>
                <article class="cce-flow-card">
                    <button class="cce-flow-toggle" type="button" aria-expanded="false" aria-controls="cce-flow-step-02" data-cce-flow-toggle>
                        <span class="cce-flow-number">02</span>
                        <span class="cce-flow-heading"><strong>Receber a solicitação do D.A (Dono do Acidente) </strong><span>Alinhe a necessidade com o DA e confirme o recurso necessário para o atendimento.</span></span>
                        <span class="cce-flow-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="cce-flow-body" id="cce-flow-step-02" hidden>
                        <span class="cce-flow-badge">ALINHAMENTO</span>
                        <div class="cce-flow-check">Confirme qual equipamento, quantos serão necessários e a capacidade mínima em toneladas.</div>
                        <div class="cce-flow-check">Registre as informações necessárias para o acionamento.</div>
                        <div class="cce-flow-check">Verifique se no local da ocorrência há acesso rodoviário.</div>
                        <div class="cce-flow-check">Caso não tenha acesso rodoviário, verifique o melhor local para embarque, se há vagão prancha disponível para deslocar o recurso e se a prancha suporta o tamanho do equipamento.</div>
                    </div>
                </article>
                <article class="cce-flow-card">
                    <button class="cce-flow-toggle" type="button" aria-expanded="false" aria-controls="cce-flow-step-03" data-cce-flow-toggle>
                        <span class="cce-flow-number">03</span>
                        <span class="cce-flow-heading"><strong>Verificar recurso próprio</strong><span>Consulte o SISMOR e verifique se existe recurso próprio disponível e adequado.</span></span>
                        <span class="cce-flow-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="cce-flow-body" id="cce-flow-step-03" hidden>
                        <span class="cce-flow-badge">PONTO DE DECISÃO</span>
                        <div class="cce-flow-question" data-cce-decision>
                            <strong>O recurso próprio atende à necessidade?</strong>
                            <div class="cce-flow-actions">
                                <button class="cce-flow-action cce-flow-action--yes" type="button" data-cce-answer="yes" aria-pressed="false">✓ SIM — ATENDE</button>
                                <button class="cce-flow-action cce-flow-action--no" type="button" data-cce-answer="no" aria-pressed="false">✕ NÃO — NÃO ATENDE</button>
                            </div>
                            <div id="cce-flow-yes" class="cce-flow-result cce-flow-result--yes" data-cce-result="yes" hidden>
                                <strong>Recurso próprio:</strong>
                                Acione o responsável pelo recurso, acompanhe a mobilização e faça o reporte do status conforme RAOF.
                                <ul class="cce-flow-substeps">
                                    <li>1. Acionar o responsável. Se não conseguir contato, acionar a área de Máquinas de Via do local.</li>
                                    <li>2. Acompanhar mobilização.</li>
                
                                    <li>3. Reportar status no grupo de atendimento.</li>
                                </ul>
                            </div>
                            <div id="cce-flow-no" class="cce-flow-result cce-flow-result--no" data-cce-result="no" hidden>
                                <strong>Recurso de terceiro:</strong>
                                O recurso próprio não atende. Inicie prospecção de fornecedores.
                                <ul class="cce-flow-substeps">
                                    <li>1. Iniciar prospecção</li>
                                    <li>2. Solicitar e-mail com orçamento</li>
                                    <li>3. Conferir as condições para contratação, com atenção às diárias mínimas no orçamento.</li>
                                    <li>4. Verificar com o fornecedor a disponibilidade de troca de operadores e de reabastecimento de combustível do equipamento. O CCE deverá monitorar as condições durante todo o atendimento.</li>
                                    <li>5. Encaminhar o e-mail solicitando o "De Acordo" para o GG (até R$ 200 mil; acima disso, aprovação do diretor), com os valores, condições e orçamento em anexo.</li>
                                    <li>6. Após o ''De Acordo", acionar o fornecedor via e-mail e ligação (Ramal gravado) autorizando o deslocamento, solicitando a previsão de chegada no local.</li>
                                    <li>7. Acompanhar mobilização e reportar status no grupo de atendimento.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </article>
                <article class="cce-flow-card">
                    <button class="cce-flow-toggle" type="button" aria-expanded="false" aria-controls="cce-flow-step-04" data-cce-flow-toggle>
                        <span class="cce-flow-number">04</span>
                        <span class="cce-flow-heading"><strong>Encerramento</strong><span>Solicitação de desmobilização dos recursos.</span></span>
                        <span class="cce-flow-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="cce-flow-body" id="cce-flow-step-04" hidden>
                        <span class="cce-flow-badge">ENCERRAMENTO</span>
                        <div class="cce-flow-check">Após a autorização para desmobilização do recurso, deve-se encaminhar e-mail ao fornecedor formalizando a solicitação de desmobilização.</div>
                        <div class="cce-flow-check">Reunir todas as evidências por e-mail e criar uma pasta com o número da ocorrência e o nome do fornecedor no Menu ECN/Recursos.
                            <p><a class="cce-flow-link" href="https://vlisa.sharepoint.com/sites/MenuECN2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FMenuECN2%2FShared%20Documents%2F02%20%2D%20Recursos%2F2%20%2D%20Contrata%C3%A7%C3%B5es&amp;p=true&amp;ga=1" target="_blank" rel="noreferrer">link: https://vlisa.sharepoint.com/sites/MenuECN2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FMenuECN2%2FShared%20Documents%2F02%20%2D%20Recursos%2F2%20%2D%20Contrata%C3%A7%C3%B5es&amp;p=true&amp;ga=1</a></p>
                        </div>
                    </div>
                </article>
                <p class="cce-flow-hint">Clique nos cards para abrir as orientações. No passo 03, selecione a resposta para seguir o caminho adequado.</p>
            </div>
            <footer class="pop-footer">
                <button type="button" data-open-models="emails"><i class="fas fa-envelope" aria-hidden="true"></i> Modelos de E-mails</button>
                <button type="button" data-open-models="whatsapp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Mensagens WhatsApp</button>
            </footer>
        </aside>
        <button id="pop-model-backdrop" class="pop-model-backdrop" type="button" aria-label="Fechar modelos" hidden></button>
        <section id="pop-model-dialog" class="pop-model-dialog" role="dialog" aria-modal="true" aria-labelledby="pop-model-title" hidden>
            <header class="pop-model-header">
                <div><p style="margin:0;color:#fb923c;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">CCE · Modelos editáveis</p><h3 id="pop-model-title"></h3></div>
                <button id="pop-model-close" type="button" aria-label="Fechar modelos" style="display:grid;width:34px;height:34px;place-items:center;border:0;border-radius:6px;background:transparent;color:#cbd5e1;cursor:pointer"><i class="fas fa-times" aria-hidden="true"></i></button>
            </header>
            <div id="pop-email-model-list" class="pop-model-content" hidden></div>
            <div id="pop-whatsapp-model-list" class="pop-model-content" hidden></div>
            <button id="pop-model-resize" class="pop-model-resize" type="button" aria-label="Arraste para redimensionar a janela" title="Arraste para redimensionar"></button>
        </section>
    `;

    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.insertAdjacentHTML('beforeend', markup);

    const trigger = [...document.querySelectorAll('header button')].find(button => button.textContent.includes('Fluxo Guiado'));
    const drawer = document.getElementById('pop-drawer');
    const backdrop = document.getElementById('pop-backdrop');
    const modelDialog = document.getElementById('pop-model-dialog');
    const modelBackdrop = document.getElementById('pop-model-backdrop');
    const modelTitle = document.getElementById('pop-model-title');
    const emailList = document.getElementById('pop-email-model-list');
    const whatsappList = document.getElementById('pop-whatsapp-model-list');
    const closeButton = document.getElementById('pop-close');
    const modelCloseButton = document.getElementById('pop-model-close');
    const modelResizeHandle = document.getElementById('pop-model-resize');
    let resizeStart = null;

    modelResizeHandle.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.preventDefault();
        const bounds = modelDialog.getBoundingClientRect();
        resizeStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
        modelDialog.style.left = `${bounds.left}px`;
        modelDialog.style.top = `${bounds.top}px`;
        modelDialog.style.transform = 'none';
        modelResizeHandle.setPointerCapture(event.pointerId);
        document.body.classList.add('pop-resizing');
    });
    modelResizeHandle.addEventListener('pointermove', event => {
        if (!resizeStart || event.pointerId !== resizeStart.pointerId) return;
        const maxWidth = Math.max(240, window.innerWidth - resizeStart.left - 8);
        const maxHeight = Math.max(240, window.innerHeight - resizeStart.top - 8);
        const minWidth = Math.min(window.innerWidth <= 480 ? 320 : 560, maxWidth);
        const minHeight = Math.min(window.innerHeight <= 480 ? 320 : 360, maxHeight);
        const width = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + event.clientX - resizeStart.x));
        const height = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + event.clientY - resizeStart.y));
        modelDialog.style.width = `${width}px`;
        modelDialog.style.height = `${height}px`;
    });
    const stopResizing = event => {
        if (!resizeStart || event.pointerId !== resizeStart.pointerId) return;
        resizeStart = null;
        document.body.classList.remove('pop-resizing');
    };
    modelResizeHandle.addEventListener('pointerup', stopResizing);
    modelResizeHandle.addEventListener('pointercancel', stopResizing);
    window.addEventListener('resize', () => {
        if (!modelDialog.style.left && !modelDialog.style.top) return;
        const bounds = modelDialog.getBoundingClientRect();
        const width = Math.min(bounds.width, window.innerWidth - 16);
        const height = Math.min(bounds.height, window.innerHeight - 16);
        const left = Math.max(8, Math.min(bounds.left, window.innerWidth - width - 8));
        const top = Math.max(8, Math.min(bounds.top, window.innerHeight - height - 8));
        modelDialog.style.left = `${left}px`;
        modelDialog.style.top = `${top}px`;
        modelDialog.style.width = `${width}px`;
        modelDialog.style.height = `${height}px`;
    });

    const sda_num = value => {
        let normalized = String(value ?? '').replace(/R\$/gi, '').replace(/\s/g, '').trim();
        if (normalized.includes(',')) normalized = normalized.replace(/\./g, '').replace(',', '.');
        return Number.parseFloat(normalized) || 0;
    };
    const sda_brl = value => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const sda_esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const sda_calc = form => {
        form.querySelectorAll('[data-sda-vinculo]').forEach(binding => {
            const value = form.querySelector(`[data-sda_campo="${binding.dataset.sdaVinculo}"]`)?.value.trim();
            binding.textContent = value || '____';
        });
        let total = 0;
        form.querySelectorAll('.sda_item').forEach((row, index) => {
            row.querySelector('[data-sda_numero]').textContent = index + 1;
            const quantity = sda_num(row.querySelector('[data-sda_campo="quantidade"]').value);
            const unitPrice = sda_num(row.querySelector('[data-sda_campo="unitario"]').value);
            const lineTotal = quantity * unitPrice;
            total += lineTotal;
            row.querySelector('[data-sda_linha-total]').textContent = lineTotal ? sda_brl(lineTotal) : '';
        });
        form.querySelector('[data-sda_total]').innerHTML = `<b>${sda_brl(total)}</b>`;
    };
    const sda_addRow = form => {
        const count = form.querySelectorAll('.sda_item').length;
        const totalRow = form.querySelector('[data-sda_total]').closest('tr');
        const rowHolder = document.createElement('tbody');
        rowHolder.innerHTML = sda_linhaItem(count + 1);
        totalRow.before(rowHolder.firstElementChild);
        sda_calc(form);
    };
    const sda_montarCopia = form => {
        const copy = form.cloneNode(true);
        copy.querySelectorAll('.sda_item').forEach(row => {
            if (!row.querySelector('[data-sda_campo="descricao"]').value.trim() && !sda_num(row.querySelector('[data-sda_campo="unitario"]').value)) row.remove();
        });
        copy.querySelectorAll('.sda_item [data-sda_numero]').forEach((cell, index) => { cell.textContent = index + 1; });
        copy.querySelector('[data-sda_adicionar]').remove();
        sda_calc(copy);
        copy.querySelectorAll('input,textarea').forEach(input => {
            const value = input.classList.contains('sda_money') && input.value.trim() ? sda_brl(sda_num(input.value)) : input.value;
            const span = document.createElement('span');
            span.innerHTML = sda_esc(value);
            input.replaceWith(span);
        });
        copy.querySelectorAll('td').forEach(cell => { if (!cell.textContent.trim()) cell.innerHTML = '&nbsp;'; });
        return { html: copy.innerHTML, plain: copy.innerText };
    };
    const sda_copiar = async form => {
        const content = sda_montarCopia(form);
        try {
            await navigator.clipboard.write([new ClipboardItem({
                'text/html': new Blob([content.html], { type: 'text/html' }),
                'text/plain': new Blob([content.plain], { type: 'text/plain' })
            })]);
            return true;
        } catch (error) {
            const temporary = document.createElement('div');
            temporary.style.cssText = 'position:fixed;left:-9999px;top:0';
            temporary.innerHTML = content.html;
            document.body.appendChild(temporary);
            const range = document.createRange();
            range.selectNodeContents(temporary);
            const selection = getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const copied = document.execCommand('copy');
            selection.removeAllRanges();
            temporary.remove();
            return copied;
        }
    };

    emailList.innerHTML = `<p class="pop-model-hint">Revise os campos antes de copiar e enviar pelo canal corporativo.</p>${emailTemplates.map(templateHtml).join('')}`;
    whatsappList.innerHTML = `<p class="pop-model-hint">Mensagens curtas para alinhamento operacional. Revise os campos antes de encaminhar.</p>${whatsappTemplates.map(templateHtml).join('')}`;
    const sda_form = document.getElementById('sda_modelo');
    sda_calc(sda_form);
    sda_form.addEventListener('input', () => sda_calc(sda_form));
    sda_form.querySelector('[data-sda_adicionar]').addEventListener('click', () => sda_addRow(sda_form));
    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', 'pop-drawer');
        trigger.setAttribute('onclick', 'toggleFluxoGuiado()');
        const icon = trigger.querySelector('i');
        const textNode = [...trigger.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = ' Fluxo Guiado ';
        else if (icon?.nextSibling) icon.nextSibling.textContent = ' Fluxo Guiado ';
    }

    const abrirDrawer = () => {
        drawer.inert = false;
        drawer.setAttribute('aria-hidden', 'false');
        drawer.classList.add('open');
        backdrop.hidden = false;
        document.body.classList.add('pop-open');
        trigger?.setAttribute('aria-expanded', 'true');
        closeButton.focus();
    };

    const fecharModelos = () => {
        modelDialog.hidden = true;
        modelBackdrop.hidden = true;
        if (drawer.classList.contains('open')) closeButton.focus();
    };

    const fecharDrawer = () => {
        fecharModelos();
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.inert = true;
        backdrop.hidden = true;
        document.body.classList.remove('pop-open');
        trigger?.setAttribute('aria-expanded', 'false');
        trigger?.focus();
    };

    window.toggleFluxoGuiado = () => drawer.classList.contains('open') ? fecharDrawer() : abrirDrawer();
    window.abrirModelos = tipo => {
        const emails = tipo === 'emails';
        modelTitle.textContent = emails ? 'Modelos de E-mails' : 'Mensagens WhatsApp';
        emailList.hidden = !emails;
        whatsappList.hidden = emails;
        modelBackdrop.hidden = false;
        modelDialog.hidden = false;
        modelCloseButton.focus();
    };
    window.fecharModelos = fecharModelos;

    drawer.querySelectorAll('[data-open-models]').forEach(button => {
        button.addEventListener('click', () => window.abrirModelos(button.dataset.openModels));
    });

    closeButton.addEventListener('click', fecharDrawer);
    backdrop.addEventListener('click', fecharDrawer);
    modelCloseButton.addEventListener('click', fecharModelos);
    modelBackdrop.addEventListener('click', fecharModelos);

    drawer.addEventListener('click', event => {
        const stepToggle = event.target.closest('[data-cce-flow-toggle]');
        if (stepToggle) {
            const panel = document.getElementById(stepToggle.getAttribute('aria-controls'));
            const expanded = stepToggle.getAttribute('aria-expanded') === 'true';
            stepToggle.setAttribute('aria-expanded', String(!expanded));
            panel.hidden = expanded;
            return;
        }

        const answer = event.target.closest('[data-cce-answer]');
        if (!answer) return;
        const decision = answer.closest('[data-cce-decision]');
        decision.querySelectorAll('[data-cce-answer]').forEach(button => {
            button.setAttribute('aria-pressed', String(button === answer));
        });
        decision.querySelectorAll('[data-cce-result]').forEach(result => {
            result.hidden = result.dataset.cceResult !== answer.dataset.cceAnswer;
        });
    });

    modelDialog.addEventListener('click', async event => {
        const button = event.target.closest('[data-copy-target]');
        if (!button) return;
        const target = document.getElementById(button.dataset.copyTarget);
        const original = button.dataset.copyOriginal || button.innerHTML;
        const isSda = button.dataset.copyType === 'sda';
        const copyValue = button.dataset.copyType === 'html' ? String(target?.innerHTML ?? '') : String(target?.value ?? '');
        try {
            if (isSda) {
                const copied = await sda_copiar(target);
                if (!copied) throw new Error('Falha ao copiar o modelo De acordo.');
            } else {
                await navigator.clipboard.writeText(copyValue);
            }
        }
        catch (error) {
            if (isSda) {
                button.textContent = 'Falha ao copiar';
                setTimeout(() => { button.innerHTML = original; }, 1600);
                return;
            }
            if (target) {
                target.focus?.();
                if ('select' in target) target.select();
                const copied = document.execCommand('copy');
                if (!copied) {
                    button.textContent = 'Falha ao copiar';
                    setTimeout(() => { button.innerHTML = original; }, 1600);
                    return;
                }
            }
        }
        if (button.dataset.copyTimer) clearTimeout(Number(button.dataset.copyTimer));
        button.dataset.copyOriginal = original;
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copiado!';
        button.dataset.copyTimer = String(setTimeout(() => {
            button.innerHTML = original;
            delete button.dataset.copyOriginal;
            delete button.dataset.copyTimer;
        }, 1600));
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (!modelDialog.hidden) fecharModelos();
        else if (drawer.classList.contains('open')) fecharDrawer();
    });
})();
