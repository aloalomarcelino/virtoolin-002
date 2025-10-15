// painel.js - Lógica completa do painel de atendimento

document.addEventListener('DOMContentLoaded', () => {

  // ========== CARREGAR ATOS NOS SELECTS ==========
  function carregarAtosNosSelects() {
    // 1º RCPN
    const select1 = document.getElementById('item1rcpn');
    ATOS_DATABASE["1º RCPN"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      select1.appendChild(option);
    });

    // 2º RCPN
    const select2 = document.getElementById('item2rcpn');
    ATOS_DATABASE["2º RCPN"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      select2.appendChild(option);
    });

    // 5º RCPN
    const select5 = document.getElementById('item5rcpn');
    ATOS_DATABASE["5º RCPN"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      select5.appendChild(option);
    });

    // CASAMENTO
    const selectCas = document.getElementById('itemcasamento');
    ATOS_DATABASE["CASAMENTO"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      selectCas.appendChild(option);
    });

    // CRC
    const selectCrc = document.getElementById('itemcrc');
    ATOS_DATABASE["CRC"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      selectCrc.appendChild(option);
    });

    // LIVRO E
    const selectLivro = document.getElementById('itemlivroe');
    ATOS_DATABASE["LIVRO E"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      selectLivro.appendChild(option);
    });

    // BUSCA
    const selectBusca = document.getElementById('itembusca');
    ATOS_DATABASE["BUSCA"].forEach(ato => {
      const option = document.createElement('option');
      option.value = ato.id;
      option.textContent = `${ato.nome} — R$ ${ato.valor.toFixed(2)} — ${ato.dias} dias`;
      option.dataset.valor = ato.valor;
      option.dataset.dias = ato.dias;
      option.dataset.codigo = ato.codigo;
      selectBusca.appendChild(option);
    });
  }

  carregarAtosNosSelects();

  // ========== SISTEMA DE ABAS ==========
  const abas = document.querySelectorAll('.aba-servico');
  const conteudos = document.querySelectorAll('.conteudo-servico');

  abas.forEach(aba => {
    aba.addEventListener('click', () => {
      abas.forEach(a => a.classList.remove('ativo'));
      aba.classList.add('ativo');

      conteudos.forEach(c => c.classList.remove('ativo'));
      const alvo = document.getElementById(`servico-${aba.dataset.servico}`);
      if (alvo) alvo.classList.add('ativo');

      // Limpar cálculos ao trocar de aba
      document.getElementById('valorCalculado').textContent = 'R$ 0,00';
      document.getElementById('prazoCalculado').textContent = '- dias úteis';
      document.getElementById('dataEntregaCalculada').textContent = '--/--/----';
    });
  });

  // ========== CALCULAR VALOR E PRAZO AUTOMATICAMENTE ==========
  const selects = [
    'item1rcpn', 'item2rcpn', 'item5rcpn', 
    'itemcasamento', 'itemcrc', 'itemlivroe', 'itembusca'
  ];

  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.addEventListener('change', (e) => {
        const selectedOption = e.target.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
          document.getElementById('valorCalculado').textContent = 'R$ 0,00';
          document.getElementById('prazoCalculado').textContent = '- dias úteis';
          document.getElementById('dataEntregaCalculada').textContent = '--/--/----';
          return;
        }

        const valor = parseFloat(selectedOption.dataset.valor);
        const dias = parseInt(selectedOption.dataset.dias);

        // Mostrar valor no campo
        document.getElementById('valorCalculado').value = `R$ ${valor.toFixed(2).replace('.', ',')}`;

        // Mostrar prazo no campo
        document.getElementById('prazoCalculado').value = `${dias} dia${dias !== 1 ? 's' : ''}`;

        // Calcular e mostrar data de entrega
        const dataEntrega = calcularDataEntrega(dias);
        const dia = String(dataEntrega.getDate()).padStart(2, '0');
        const mes = String(dataEntrega.getMonth() + 1).padStart(2, '0');
        const ano = dataEntrega.getFullYear();
        document.getElementById('dataEntregaCalculada').value = `${dia}/${mes}/${ano}`;
      });
    }
  });

  // ========== GERAR NÚMERO DE GUIA ==========
  function gerarNumeroGuia() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ultimoNumero = parseInt(localStorage.getItem('virtoolin_ultimo_numero_guia') || '0');
    const proximoNumero = ultimoNumero + 1;
    localStorage.setItem('virtoolin_ultimo_numero_guia', proximoNumero);
    
    return `${ano}${mes}${String(proximoNumero).padStart(5, '0')}`;
  }

  // ========== GERAR ID DO ATO ==========
  function gerarIdAto(codigo) {
    const ultimoNumero = parseInt(localStorage.getItem('virtoolin_ultimo_ato') || '0');
    const proximoNumero = ultimoNumero + 1;
    localStorage.setItem('virtoolin_ultimo_ato', proximoNumero);
    
    return `A-${codigo}${String(proximoNumero).padStart(5, '0')}`;
  }

  // ========== GERAR GUIA DE PAGAMENTO ==========
  document.getElementById('gerarGuia').addEventListener('click', () => {
    // Validar cliente
    const cpf = document.getElementById('cpfCnpj').value.trim();
    const nome = document.getElementById('nomeRequerente').value.trim();
    
    if (!cpf || !nome) {
      return mostrarAviso('❌ Preencha os dados do requerente');
    }

    // Validar serviço selecionado
    const abaAtiva = document.querySelector('.aba-servico.ativo');
    const servicoId = abaAtiva.dataset.servico;
    const selectServico = document.getElementById(`item${servicoId}`);
    
    if (!selectServico || !selectServico.value) {
      return mostrarAviso('❌ Selecione um ato');
    }

    const optionSelecionada = selectServico.selectedOptions[0];
    const valor = parseFloat(optionSelecionada.dataset.valor);
    const dias = parseInt(optionSelecionada.dataset.dias);
    const codigo = optionSelecionada.dataset.codigo;
    const nomeAto = optionSelecionada.textContent.split(' — ')[0];

    // Gerar IDs
    const numeroGuia = gerarNumeroGuia();
    const idAto = gerarIdAto(codigo);

    // Mostrar número da guia
    document.getElementById('numeroGuia').value = numeroGuia;

    // Coletar dados completos
    const ato = {
      id: idAto,
      numeroGuia: numeroGuia,
      data: new Date().toISOString(),
      colaborador: localStorage.getItem('colaborador'),
      cliente: {
        cpf: cpf,
        nome: nome,
        whatsapp: document.getElementById('whatsapp').value,
        email: document.getElementById('email').value
      },
      servico: {
        tipo: servicoId,
        nome: nomeAto,
        valor: valor,
        dias: dias
      },
      status: 'AGUARDANDO_PAGAMENTO',
      dataEntrega: calcularDataEntrega(dias).toISOString()
    };

    // Salvar no localStorage
    const atos = JSON.parse(localStorage.getItem('virtoolin_atos') || '[]');
    atos.push(ato);
    localStorage.setItem('virtoolin_atos', JSON.stringify(atos));

    // Adicionar notificação
    adicionarNotificacao({
      tipo: 'NOVO_ATO',
      titulo: `Novo ato registrado: ${idAto}`,
      mensagem: `${localStorage.getItem('colaborador')} cadastrou ${nomeAto} para ${nome}`,
      destino: 'CAIXA',
      ato: idAto,
      timestamp: new Date().toISOString()
    });

    // Gerar e imprimir guia
    gerarGuiaPagamento(ato);

    mostrarAviso('✔ Guia gerada com sucesso!');
  });

  // ========== GERAR HTML DA GUIA ==========
  function gerarGuiaPagamento(ato) {
    const guiaHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Guia de Pagamento - ${ato.numeroGuia}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 11px; }
    .guia { width: 210mm; padding: 10mm; }
    .via { margin-bottom: 15mm; padding: 8mm; border: 2px solid #000; page-break-after: always; }
    .via:last-child { page-break-after: auto; }
    .cabecalho { text-align: center; margin-bottom: 5mm; border-bottom: 1px solid #000; padding-bottom: 3mm; }
    .cabecalho h1 { font-size: 16px; margin-bottom: 2mm; }
    .cabecalho h2 { font-size: 12px; font-weight: normal; }
    .linha { display: flex; justify-content: space-between; margin: 2mm 0; }
    .campo { margin: 2mm 0; }
    .campo strong { display: inline-block; min-width: 100px; }
    .valor-destaque { font-size: 18px; font-weight: bold; text-align: center; margin: 5mm 0; padding: 3mm; border: 2px solid #000; }
    .rodape { margin-top: 5mm; padding-top: 3mm; border-top: 1px solid #000; font-size: 9px; text-align: center; }
    .qrcode { text-align: center; margin: 3mm 0; }
    @media print {
      .via { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="guia">
    
    <!-- VIA 1: SALA DOS LIVROS -->
    <div class="via">
      <div class="cabecalho">
        <h1>2º OFÍCIO DE REGISTRO CIVIL</h1>
        <h2>GUIA DE PAGAMENTO - VIA PRODUÇÃO</h2>
        <p style="margin-top:2mm;">Guia Nº ${ato.numeroGuia} | Ato: ${ato.id}</p>
      </div>
      
      <div class="campo"><strong>Cliente:</strong> ${ato.cliente.nome}</div>
      <div class="campo"><strong>CPF/CNPJ:</strong> ${ato.cliente.cpf}</div>
      <div class="campo"><strong>WhatsApp:</strong> ${ato.cliente.whatsapp || '-'}</div>
      
      <div class="campo"><strong>Serviço:</strong> ${ato.servico.nome}</div>
      <div class="campo"><strong>Prazo:</strong> ${ato.servico.dias} dias úteis</div>
      <div class="campo"><strong>Entrega:</strong> ${new Date(ato.dataEntrega).toLocaleDateString('pt-BR')}</div>
      
      <div class="valor-destaque">
        VALOR: R$ ${ato.servico.valor.toFixed(2).replace('.', ',')}
      </div>
      
      <div class="campo"><strong>Atendido por:</strong> ${ato.colaborador}</div>
      <div class="campo"><strong>Data:</strong> ${new Date(ato.data).toLocaleString('pt-BR')}</div>
      
      <div class="rodape">
        ESTA VIA DEVE SER ENVIADA À SALA DOS LIVROS APÓS PAGAMENTO
      </div>
    </div>

    <!-- VIA 2: CLIENTE -->
    <div class="via">
      <div class="cabecalho">
        <h1>2º OFÍCIO DE REGISTRO CIVIL</h1>
        <h2>GUIA DE PAGAMENTO - VIA CLIENTE</h2>
        <p style="margin-top:2mm;">Guia Nº ${ato.numeroGuia} | Ato: ${ato.id}</p>
      </div>
      
      <div class="campo"><strong>Cliente:</strong> ${ato.cliente.nome}</div>
      <div class="campo"><strong>CPF/CNPJ:</strong> ${ato.cliente.cpf}</div>
      
      <div class="campo"><strong>Serviço:</strong> ${ato.servico.nome}</div>
      <div class="campo"><strong>Prazo:</strong> ${ato.servico.dias} dias úteis</div>
      <div class="campo"><strong>Previsão de Entrega:</strong> ${new Date(ato.dataEntrega).toLocaleDateString('pt-BR')}</div>
      
      <div class="valor-destaque">
        VALOR PAGO: R$ ${ato.servico.valor.toFixed(2).replace('.', ',')}
      </div>
      
      <div class="qrcode">
        <p style="margin-bottom:2mm;">Status do pedido:</p>
        <div style="border:1px solid #000; padding:5mm; display:inline-block;">
          <strong style="font-size:14px;">${ato.id}</strong>
        </div>
      </div>
      
      <div class="rodape">
        APRESENTE ESTA VIA NA RECEPÇÃO PARA RETIRADA DO DOCUMENTO<br>
        Em caso de dúvidas, entre em contato informando o número do ato: ${ato.id}
      </div>
    </div>

    <!-- VIA 3: CAIXA -->
    <div class="via">
      <div class="cabecalho">
        <h1>2º OFÍCIO DE REGISTRO CIVIL</h1>
        <h2>GUIA DE PAGAMENTO - VIA CAIXA</h2>
        <p style="margin-top:2mm;">Guia Nº ${ato.numeroGuia} | Ato: ${ato.id}</p>
      </div>
      
      <div class="campo"><strong>Cliente:</strong> ${ato.cliente.nome}</div>
      <div class="campo"><strong>CPF/CNPJ:</strong> ${ato.cliente.cpf}</div>
      <div class="campo"><strong>WhatsApp:</strong> ${ato.cliente.whatsapp || '-'}</div>
      
      <div class="campo"><strong>Serviço:</strong> ${ato.servico.nome}</div>
      
      <div class="valor-destaque">
        VALOR A RECEBER: R$ ${ato.servico.valor.toFixed(2).replace('.', ',')}
      </div>
      
      <div class="linha">
        <div><strong>Forma de Pagamento:</strong> _________________</div>
      </div>
      
      <div class="linha">
        <div><strong>Recebido por:</strong> _________________</div>
        <div><strong>Data:</strong> ____/____/________</div>
      </div>
      
      <div style="margin-top:5mm; border:1px solid #000; padding:3mm;">
        <p style="text-align:center;"><strong>CARIMBO "PAGO"</strong></p>
        <div style="height:15mm;"></div>
      </div>
      
      <div class="rodape">
        VIA PARA CONTROLE DO CAIXA - ARQUIVAR APÓS CONFERÊNCIA
      </div>
    </div>

  </div>
</body>
</html>
    `;

    // Abrir em nova janela e imprimir
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(guiaHTML);
    janelaImpressao.document.close();
    
    setTimeout(() => {
      janelaImpressao.print();
    }, 500);
  }

  // ========== SISTEMA DE NOTIFICAÇÕES ==========
  function adicionarNotificacao(notif) {
    const notificacoes = JSON.parse(localStorage.getItem('virtoolin_notificacoes') || '[]');
    notificacoes.unshift(notif);
    localStorage.setItem('virtoolin_notificacoes', JSON.stringify(notificacoes));
  }

  // ========== LIMPAR TUDO ==========
  document.getElementById('limparTudo').addEventListener('click', () => {
    if (!confirm('Deseja realmente limpar todos os campos?')) return;
    
    // Limpar cliente
    document.getElementById('cpfCnpj').value = '';
    document.getElementById('nomeRequerente').value = '';
    document.getElementById('whatsapp').value = '';
    document.getElementById('outroContato').value = '';
    document.getElementById('email').value = '';
    document.getElementById('cep').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('observacoes').value = '';
    
    // Limpar selects
    selects.forEach(selectId => {
      const select = document.getElementById(selectId);
      if (select) select.value = '';
    });
    
    // Limpar cálculos
    document.getElementById('valorCalculado').textContent = 'R$ 0,00';
    document.getElementById('prazoCalculado').textContent = '- dias úteis';
    document.getElementById('dataEntregaCalculada').textContent = '--/--/----';
    document.getElementById('numeroGuia').value = '';
    
    mostrarAviso('✔ Campos limpos');
  });

  // ========== NAVEGAÇÃO ==========
  document.getElementById('btnClientes')?.addEventListener('click', () => {
    window.location.href = 'clientes.html';
  });

  document.getElementById('btnAtos')?.addEventListener('click', () => {
    window.location.href = 'atos.html';
  });

  document.getElementById('btnNotificacoes')?.addEventListener('click', () => {
    window.location.href = 'notificacoes.html';
  });

}); // FIM DOMContentLoaded

// ========== FUNÇÕES GLOBAIS ==========
function mostrarAviso(texto) {
  const aviso = document.createElement('div');
  aviso.className = 'notificacao-virtualino';
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  
  setTimeout(() => aviso.classList.add('mostrar'), 10);
  setTimeout(() => {
    aviso.classList.remove('mostrar');
    setTimeout(() => aviso.remove(), 400);
  }, 2000);
}

function calcularDataEntrega(dias) {
  const hoje = new Date();
  let diasUteis = 0;
  let dataAtual = new Date(hoje);

  while (diasUteis < dias) {
    dataAtual.setDate(dataAtual.getDate() + 1);
    const diaSemana = dataAtual.getDay();
    // Pula fins de semana (0 = domingo, 6 = sábado)
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }
  }

  return dataAtual;
}