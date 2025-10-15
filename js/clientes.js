// clientes.js - Sistema unificado com painel.html
document.addEventListener('DOMContentLoaded', () => {

  // ========== CONFIGURAÇÃO ==========
  const STORAGE_KEY = 'virtoolin_clients'; // Mesma chave do painel!
  const HISTORY_KEY = 'virtoolin_history';

  // ========== ESTADO ==========
  let state = {
    clientes: {},
    clienteSelecionado: null,
    paginaAtual: 1,
    itensPorPagina: 10,
    ordenacao: 'nome',
    filtros: {
      busca: '',
      comHistorico: false,
      semEmail: false
    }
  };

  // ========== UTILITÁRIOS ==========
  const $ = (sel) => document.querySelector(sel);
  const normalizeCPF = (str) => (str || '').replace(/\D/g, '');
  const agora = () => new Date().toISOString();
  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // ========== CARREGAR DADOS ==========
  function carregarClientes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.clientes = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Erro ao carregar clientes:', e);
      state.clientes = {};
    }
  }

  function salvarClientes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.clientes));
  }

  function carregarHistorico(cpf) {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const historico = raw ? JSON.parse(raw) : {};
      return historico[cpf] || [];
    } catch (e) {
      return [];
    }
  }

  function salvarHistorico(cpf, eventos) {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const historico = raw ? JSON.parse(raw) : {};
      historico[cpf] = eventos;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historico));
    } catch (e) {
      console.error('Erro ao salvar histórico:', e);
    }
  }

  // ========== MÁSCARAS ==========
  function aplicarMascaras() {
    const cpfInput = $('#inputCpf');
    if (cpfInput) {
      IMask(cpfInput, {
        mask: [
          { mask: '000.000.000-00', maxLength: 11 },
          { mask: '00.000.000/0000-00', maxLength: 14 }
        ],
        dispatch: (appended, dynamicMasked) => {
          const value = (dynamicMasked.value + appended).replace(/\D/g, '');
          return dynamicMasked.compiledMasks.find(m => value.length <= m.maxLength);
        }
      });
    }

    const cepInput = $('#inputCep');
    if (cepInput) {
      IMask(cepInput, { mask: '00000-000' });
      
      cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
          const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await res.json();
          if (data.erro) {
            mostrarNotificacao('⚠️ CEP não encontrado');
            return;
          }

          if (data.logradouro) $('#inputEndereco').value = data.logradouro;
          if (data.bairro) $('#inputBairro').value = data.bairro;
          if (data.localidade && data.uf) {
            $('#inputCidade').value = `${data.localidade}/${data.uf}`;
          }

          mostrarNotificacao('✔ CEP encontrado');
        } catch (e) {
          mostrarNotificacao('❌ Erro ao buscar CEP');
        }
      });
    }

    const telInputs = ['#inputTel', '#inputTel2'];
    telInputs.forEach(sel => {
      const input = $(sel);
      if (!input) return;

      window.intlTelInput(input, {
        initialCountry: 'br',
        preferredCountries: ['br', 'us', 'pt', 'es', 'fr'],
        separateDialCode: true,
        formatOnDisplay: true,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.14/build/js/utils.js'
      });
    });
  }

  // ========== VALIDAÇÕES ==========
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0, pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;
    
    return true;
  }

  // ========== RENDERIZAR LISTA ==========
  function renderizarLista() {
    const tbody = $('#tabelaClientes');
    tbody.innerHTML = '';

    let clientesFiltrados = Object.keys(state.clientes).map(cpf => ({
      cpf,
      ...state.clientes[cpf]
    }));

    // Busca
    if (state.filtros.busca) {
      const termo = state.filtros.busca.toLowerCase();
      clientesFiltrados = clientesFiltrados.filter(c => {
        const texto = `${c.nome} ${c.cpfCnpj} ${c.whatsapp} ${c.email} ${c.cidade}`.toLowerCase();
        return texto.includes(termo);
      });
    }

    // Filtros
    if (state.filtros.comHistorico) {
      clientesFiltrados = clientesFiltrados.filter(c => carregarHistorico(c.cpf).length > 0);
    }

    if (state.filtros.semEmail) {
      clientesFiltrados = clientesFiltrados.filter(c => !c.email || c.email.trim() === '');
    }

    // Ordenação
    if (state.ordenacao === 'nome') {
      clientesFiltrados.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    } else if (state.ordenacao === 'recente') {
      clientesFiltrados.sort((a, b) => (b.dataRegistro || '').localeCompare(a.dataRegistro || ''));
    } else if (state.ordenacao === 'antigo') {
      clientesFiltrados.sort((a, b) => (a.dataRegistro || '').localeCompare(b.dataRegistro || ''));
    }

    // Paginação
    const total = clientesFiltrados.length;
    const inicio = (state.paginaAtual - 1) * state.itensPorPagina;
    const fim = inicio + state.itensPorPagina;
    const clientesPagina = clientesFiltrados.slice(inicio, fim);

    // Renderizar
    if (clientesPagina.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px;">Nenhum cliente encontrado</td></tr>';
    } else {
      clientesPagina.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.dataset.cpf = cliente.cpf;
        
        if (state.clienteSelecionado === cliente.cpf) {
          tr.classList.add('selecionado');
        }

        tr.innerHTML = `
          <td>${escapeHtml(cliente.nome || '-')}</td>
          <td>${escapeHtml(cliente.cpfCnpj || '-')}</td>
          <td>${escapeHtml(cliente.whatsapp || '-')}</td>
          <td>${escapeHtml(cliente.email || '-')}</td>
          <td>${escapeHtml(cliente.cidade || '-')}</td>
          <td class="acoes-linha">
            <button class="btn-ver" data-cpf="${cliente.cpf}">👁️</button>
            <button class="btn-editar" data-cpf="${cliente.cpf}">✏️</button>
            <button class="btn-copiar" data-cpf="${cliente.cpf}">📋</button>
          </td>
        `;

        tr.addEventListener('click', (e) => {
          if (!e.target.matches('button')) {
            mostrarDetalhe(cliente.cpf);
          }
        });

        tbody.appendChild(tr);
      });
    }

    atualizarPaginacao(total);
    anexarEventosBotoes();
  }

  function atualizarPaginacao(total) {
    const totalPaginas = Math.max(1, Math.ceil(total / state.itensPorPagina));
    $('#infoPaginacao').textContent = `Página ${state.paginaAtual} de ${totalPaginas} — ${total} clientes`;
    
    $('#btnAnterior').disabled = state.paginaAtual <= 1;
    $('#btnProxima').disabled = state.paginaAtual >= totalPaginas;
  }

  function anexarEventosBotoes() {
    document.querySelectorAll('.btn-ver').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        mostrarDetalhe(e.target.dataset.cpf);
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModal(e.target.dataset.cpf);
      });
    });

    document.querySelectorAll('.btn-copiar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        copiarEndereco(e.target.dataset.cpf);
      });
    });
  }

  // ========== MOSTRAR DETALHES ==========
  function mostrarDetalhe(cpf) {
    const cliente = state.clientes[cpf];
    if (!cliente) return;

    state.clienteSelecionado = cpf;
    const painel = $('#painelDetalhe');
    painel.classList.remove('vazio');

    const historico = carregarHistorico(cpf);

    painel.innerHTML = `
      <div class="detalhe-header">
        <div>
          <h2>${escapeHtml(cliente.nome || 'Sem nome')}</h2>
          <div class="id-cliente">CPF: ${escapeHtml(cliente.cpfCnpj || '-')}</div>
        </div>
        <div class="detalhe-acoes">
          <button id="btnEditarDetalhe">✏️</button>
          <button id="btnDeletarCliente">🗑️</button>
        </div>
      </div>

      <div class="info-grid">
        <strong>WhatsApp:</strong>
        <span>${escapeHtml(cliente.whatsapp || '-')}</span>

        <strong>Contato 2:</strong>
        <span>${escapeHtml(cliente.outroContato || '-')}</span>

        <strong>E-mail:</strong>
        <span>${escapeHtml(cliente.email || '-')}</span>

        <strong>CEP:</strong>
        <span>${escapeHtml(cliente.cep || '-')}</span>

        <strong>Endereço:</strong>
        <span>${escapeHtml(cliente.endereco || '-')} ${cliente.numero ? ', ' + cliente.numero : ''}</span>

        <strong>Bairro:</strong>
        <span>${escapeHtml(cliente.bairro || '-')}</span>

        <strong>Cidade:</strong>
        <span>${escapeHtml(cliente.cidade || '-')}</span>

        <strong>Complemento:</strong>
        <span>${escapeHtml(cliente.complemento || '-')}</span>

        <strong>Observações:</strong>
        <span>${escapeHtml(cliente.observacoes || '-')}</span>

        <strong>Cadastrado em:</strong>
        <span>${cliente.dataRegistro ? new Date(cliente.dataRegistro).toLocaleString('pt-BR') : '-'}</span>
      </div>

      <div class="historico">
        <h3>
          Histórico de Atendimentos
          <button id="btnAddHistorico">➕</button>
        </h3>
        <ul class="historico-lista" id="listaHistorico">
          ${historico.length === 0 ? '<li>Nenhum atendimento registrado</li>' : ''}
        </ul>
      </div>
    `;

    // Renderizar histórico
    const lista = $('#listaHistorico');
    historico.slice().reverse().forEach(evt => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${escapeHtml(evt.tipo || 'Atendimento')}</strong> — ${new Date(evt.data).toLocaleString('pt-BR')}<br>
        ${escapeHtml(evt.descricao || '')}<br>
        <small>Por: ${escapeHtml(evt.colaborador || '-')}</small>
      `;
      lista.appendChild(li);
    });

    // Eventos
    $('#btnEditarDetalhe')?.addEventListener('click', () => abrirModal(cpf));
    $('#btnDeletarCliente')?.addEventListener('click', () => deletarCliente(cpf));
    $('#btnAddHistorico')?.addEventListener('click', () => adicionarHistorico(cpf));

    renderizarLista(); // Atualiza seleção na tabela
  }

  // ========== ADICIONAR HISTÓRICO ==========
  function adicionarHistorico(cpf) {
    const tipo = prompt('Tipo de atendimento (ex: ENTREGA, BUSCA, CERTIDÃO):', 'ENTREGA');
    if (!tipo) return;

    const descricao = prompt('Descrição (opcional):', '');
    const colaborador = prompt('Colaborador:', localStorage.getItem('colaborador') || '');

    const evento = {
      tipo: tipo.toUpperCase(),
      descricao,
      colaborador,
      data: agora()
    };

    const historico = carregarHistorico(cpf);
    historico.push(evento);
    salvarHistorico(cpf, historico);

    mostrarNotificacao('✔ Atendimento registrado');
    mostrarDetalhe(cpf);
  }

  // ========== COPIAR ENDEREÇO ==========
  function copiarEndereco(cpf) {
    const c = state.clientes[cpf];
    if (!c) return;

    const endereco = `${c.endereco || ''}, ${c.numero || ''}, ${c.bairro || ''}, ${c.cidade || ''}, CEP ${c.cep || ''}`;
    navigator.clipboard.writeText(endereco).then(() => {
      mostrarNotificacao('✔ Endereço copiado');
    });
  }

  // ========== DELETAR CLIENTE ==========
  function deletarCliente(cpf) {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;

    delete state.clientes[cpf];
    salvarClientes();
    
    state.clienteSelecionado = null;
    $('#painelDetalhe').classList.add('vazio');
    $('#painelDetalhe').innerHTML = '<p>← Selecione um cliente para ver os detalhes</p>';
    
    mostrarNotificacao('✔ Cliente excluído');
    renderizarLista();
  }

  // ========== MODAL ==========
  function abrirModal(cpf = null) {
    const modal = $('#modal');
    const titulo = $('#modalTitulo');
    const form = $('#formCliente');

    if (cpf) {
      titulo.textContent = 'Editar Cliente';
      const c = state.clientes[cpf];
      $('#inputId').value = cpf;
      $('#inputCpf').value = c.cpfCnpj || '';
      $('#inputNome').value = c.nome || '';
      $('#inputTel').value = c.whatsapp || '';
      $('#inputTel2').value = c.outroContato || '';
      $('#inputEmail').value = c.email || '';
      $('#inputCep').value = c.cep || '';
      $('#inputEndereco').value = c.endereco || '';
      $('#inputNumero').value = c.numero || '';
      $('#inputBairro').value = c.bairro || '';
      $('#inputCidade').value = c.cidade || '';
      $('#inputComplemento').value = c.complemento || '';
      $('#inputObs').value = c.observacoes || '';
    } else {
      titulo.textContent = 'Novo Cliente';
      form.reset();
      $('#inputId').value = '';
    }

    modal.classList.add('mostrar');
    $('#inputNome').focus();
  }

  function fecharModal() {
    $('#modal').classList.remove('mostrar');
    $('#formCliente').reset();
  }

  // ========== SALVAR CLIENTE ==========
  $('#formCliente').addEventListener('submit', (e) => {
    e.preventDefault();

    const cpfCnpj = $('#inputCpf').value.trim();
    const cpfNormalizado = normalizeCPF(cpfCnpj);
    const nome = $('#inputNome').value.trim();
    const whatsapp = $('#inputTel').value.trim();

    // Validações
    const isCPF = cpfNormalizado.length === 11;
    const isCNPJ = cpfNormalizado.length === 14;

    if (!isCPF && !isCNPJ) {
      return mostrarNotificacao('❌ CPF/CNPJ inválido');
    }

    if (isCPF && !validarCPF(cpfNormalizado)) {
      return mostrarNotificacao('❌ CPF inválido');
    }

    if (isCNPJ && !validarCNPJ(cpfNormalizado)) {
      return mostrarNotificacao('❌ CNPJ inválido');
    }

    if (!nome || nome.split(' ').length < 2) {
      return mostrarNotificacao('❌ Informe o nome completo');
    }

    if (!whatsapp) {
      return mostrarNotificacao('❌ WhatsApp é obrigatório');
    }

    // Salvar
    const jaExiste = !!state.clientes[cpfNormalizado];
    
    state.clientes[cpfNormalizado] = {
      cpfCnpj: cpfCnpj,
      nome: nome,
      whatsapp: whatsapp,
      outroContato: $('#inputTel2').value.trim(),
      email: $('#inputEmail').value.trim().toLowerCase(),
      cep: $('#inputCep').value.trim(),
      endereco: $('#inputEndereco').value.trim(),
      numero: $('#inputNumero').value.trim(),
      bairro: $('#inputBairro').value.trim(),
      cidade: $('#inputCidade').value.trim(),
      complemento: $('#inputComplemento').value.trim(),
      observacoes: $('#inputObs').value.trim(),
      dataRegistro: state.clientes[cpfNormalizado]?.dataRegistro || agora()
    };

    salvarClientes();
    fecharModal();
    renderizarLista();
    mostrarDetalhe(cpfNormalizado);
    
    mostrarNotificacao(jaExiste ? '✔ Cliente atualizado' : '✔ Cliente cadastrado');
  });

  // ========== EVENTOS ==========
  $('#btnNovo').addEventListener('click', () => abrirModal());
  $('#btnCancelar').addEventListener('click', fecharModal);
  $('#modal').addEventListener('click', (e) => {
    if (e.target === $('#modal')) fecharModal();
  });

  $('#busca').addEventListener('input', (e) => {
    state.filtros.busca = e.target.value;
    state.paginaAtual = 1;
    renderizarLista();
  });

  $('#ordenacao').addEventListener('change', (e) => {
    state.ordenacao = e.target.value;
    renderizarLista();
  });

  $('#itensPorPagina').addEventListener('change', (e) => {
    state.itensPorPagina = parseInt(e.target.value);
    state.paginaAtual = 1;
    renderizarLista();
  });

  $('#filtroComHistorico').addEventListener('change', (e) => {
    state.filtros.comHistorico = e.target.checked;
    state.paginaAtual = 1;
    renderizarLista();
  });

  $('#filtroSemEmail').addEventListener('change', (e) => {
    state.filtros.semEmail = e.target.checked;
    state.paginaAtual = 1;
    renderizarLista();
  });

  $('#btnAnterior').addEventListener('click', () => {
    if (state.paginaAtual > 1) {
      state.paginaAtual--;
      renderizarLista();
    }
  });

  $('#btnProxima').addEventListener('click', () => {
    state.paginaAtual++;
    renderizarLista();
  });

  // ========== EXPORTAR/IMPORTAR ==========
  $('#btnExportar').addEventListener('click', () => {
    const data = JSON.stringify(state.clientes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtoolin_clientes_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    mostrarNotificacao('✔ Exportado com sucesso');
  });

  $('#btnImportar').addEventListener('click', () => {
    $('#fileImport').click();
  });

  $('#fileImport').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const importados = JSON.parse(ev.target.result);
        Object.assign(state.clientes, importados);
        salvarClientes();
        renderizarLista();
        mostrarNotificacao('✔ Importado com sucesso');
      } catch (err) {
        mostrarNotificacao('❌ Erro ao importar arquivo');
      }
    };
    reader.readAsText(file);
  });

  // ========== NOTIFICAÇÃO ==========
  function mostrarNotificacao(texto) {
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.textContent = texto;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('mostrar'), 10);
    setTimeout(() => {
      notif.classList.remove('mostrar');
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }

  // ========== INICIALIZAÇÃO ==========
  carregarClientes();
  aplicarMascaras();
  renderizarLista();
});