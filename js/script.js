document.addEventListener('DOMContentLoaded', () => {

  // ======== MAIÚSCULAS automáticas (com exceções reais) ========
  document.querySelectorAll('input[type="text"]').forEach(el => {
    const id = el.id;
    const excecoes = [
      'whatsapp', 'outroContato', 'email', 'cpfCnpj',
      'dataSolicitacao', 'dataEntrega', 'valor', 'numeroGuia',
      'endereco', 'bairro', 'cidade', 'complemento', 'observacoes',
      'nomeNoivo', 'nomeNoiva', 'nomeBuscado', 'servicoOutro',
      'cep', 'numero'
    ];
    if (excecoes.includes(id)) return;

    let composing = false;
    el.addEventListener('compositionstart', () => (composing = true));
    el.addEventListener('compositionend', () => {
      composing = false;
      el.value = el.value.toUpperCase();
    });
    el.addEventListener('input', () => {
      if (!composing) el.value = el.value.toUpperCase();
    });
  });

  // ======== CAPITALIZAÇÃO ELEGANTE ========
  const camposElegantes = ['endereco', 'bairro', 'cidade', 'complemento', 'observacoes', 'nomeNoivo', 'nomeNoiva', 'nomeBuscado'];
  camposElegantes.forEach(id => {
    const campo = document.getElementById(id);
    if (!campo) return;

    let composing = false;
    campo.addEventListener('compositionstart', () => (composing = true));
    campo.addEventListener('compositionend', () => {
      composing = false;
      campo.value = formatarCapitalizacaoElegante(campo.value);
    });
    campo.addEventListener('input', () => {
      if (!composing) campo.value = formatarCapitalizacaoElegante(campo.value);
    });
  });

  function formatarCapitalizacaoElegante(texto) {
    if (texto.includes('/')) {
      const [cidadeParte, ufParte] = texto.split('/');
      const cidade = cidadeParte
        .trim()
        .toLowerCase()
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
      const uf = ufParte ? ufParte.trim().toUpperCase() : '';
      return `${cidade}/${uf}`;
    }

    return texto
      .toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  // ======== TELEFONE COM intl-tel-input ========
  const phoneIds = ['whatsapp', 'outroContato'];

  phoneIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    const iti = window.intlTelInput(input, {
      initialCountry: 'br',
      preferredCountries: ['br', 'us', 'pt', 'es', 'fr'],
      separateDialCode: true,
      formatOnDisplay: true,
      autoPlaceholder: 'aggressive',
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.14/build/js/utils.js'
    });

    input.addEventListener('blur', () => {
      const number = iti.getNumber();
      if (number) input.value = number;
    });
  });

  // ======== CPF/CNPJ ========
  const cpfCnpjInput = document.getElementById('cpfCnpj');
  if (cpfCnpjInput) {
    IMask(cpfCnpjInput, {
      mask: [
        { mask: '000.000.000-00', maxLength: 11 },
        { mask: '00.000.000/0000-00', maxLength: 14 }
      ],
      dispatch: (appended, dynamicMasked) => {
        const value = (dynamicMasked.value + appended).replace(/\D/g, '');
        return dynamicMasked.compiledMasks.find(m => value.length <= m.maxLength);
      }
    });

    // ENTER no CPF busca automaticamente
    cpfCnpjInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('buscarCliente')?.click();
      }
    });
  }

  // ======== VIA CEP ========
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    IMask(cepInput, { mask: '00000-000' });

    cepInput.addEventListener('blur', async () => {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length !== 8) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) {
          mostrarAviso('⚠️ CEP não encontrado');
          return;
        }

        const endereco = document.getElementById('endereco');
        const bairro = document.getElementById('bairro');
        const cidade = document.getElementById('cidade');

        if (data.logradouro) endereco.value = data.logradouro;
        if (data.bairro) bairro.value = data.bairro;
        if (data.localidade && data.uf) cidade.value = `${data.localidade}/${data.uf}`;

        [endereco, bairro, cidade].forEach(campo => {
          if (campo.value.trim()) {
            campo.readOnly = true;
            campo.style.backgroundColor = '#e9e9e9';
          } else {
            campo.readOnly = false;
            campo.style.backgroundColor = '#fff';
          }
        });

        mostrarAviso('✔ CEP encontrado');

      } catch (e) {
        console.error('Erro ao buscar CEP:', e);
        mostrarAviso('❌ Erro ao buscar CEP');
      }
    });
  }

  // ======== Datas ========
  ['dataSolicitacao', 'dataEntrega'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) IMask(campo, { mask: '00/00/0000' });
  });

  // ======== Número ========
  const numero = document.getElementById('numero');
  if (numero) {
    numero.addEventListener('input', () => {
      numero.value = numero.value.replace(/\D/g, '');
    });
  }

  // ======== COPIAR ENDEREÇO ========
  const copiarBtn = document.getElementById('copiarEndereco');
  if (copiarBtn) {
    copiarBtn.addEventListener('click', () => {
      const rua = document.getElementById('endereco').value.trim();
      const numero = document.getElementById('numero').value.trim();
      const compl = document.getElementById('complemento').value.trim();
      const bairro = document.getElementById('bairro').value.trim();
      const cidade = document.getElementById('cidade').value.trim();
      const cep = document.getElementById('cep').value.trim();
      
      if (!rua || !numero || !bairro || !cidade || !cep) {
        mostrarAviso('⚠️ Preencha o endereço completo');
        return;
      }

      const enderecoCompleto = `${rua}, ${numero}${compl ? ' - ' + compl : ''}, ${bairro}, ${cidade}, CEP ${cep}`;
      navigator.clipboard.writeText(enderecoCompleto);
      mostrarAviso('✔ Endereço copiado');
    });
  }

  // ======== VER MAIS (CORRIGIDO) ========
  const verMais = document.getElementById('verMais');
  const detalhes = document.getElementById('detalhesRequerente');
  if (verMais && detalhes) {
    verMais.addEventListener('click', (e) => {
      e.preventDefault();
      const visivel = detalhes.classList.toggle('visivel');
      verMais.innerHTML = visivel ? '➖ VER MENOS' : '➕ VER MAIS';
    });
  }

  // ======== VALIDAÇÕES ========
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

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // ======== LOCALSTORAGE - CLIENTES ========
  const keyStorage = 'virtoolin_clients';
  const getField = id => document.getElementById(id);
  const normalizeCpfCnpj = v => (v || '').replace(/\D/g, '');
  const loadClients = () => JSON.parse(localStorage.getItem(keyStorage) || '{}');
  const saveClients = data => localStorage.setItem(keyStorage, JSON.stringify(data));

  // ======== CADASTRAR CLIENTE ========
  const btnCadastrar = getField('novoCliente');
  if (btnCadastrar) {
    btnCadastrar.addEventListener('click', e => {
      e.preventDefault();

      const cpfCnpjValue = getField('cpfCnpj')?.value || '';
      const nomeValue = getField('nomeRequerente')?.value || '';

      const data = {
        cpfCnpj: cpfCnpjValue,
        nome: nomeValue, // Salvando como 'nome' para compatibilidade
        nomeRequerente: nomeValue, // Mantendo também este
        whatsapp: getField('whatsapp')?.value || '',
        outroContato: getField('outroContato')?.value || '',
        email: getField('email')?.value || '',
        cep: getField('cep')?.value || '',
        endereco: getField('endereco')?.value || '',
        numero: getField('numero')?.value || '',
        complemento: getField('complemento')?.value || '',
        bairro: getField('bairro')?.value || '',
        cidade: getField('cidade')?.value || '',
        observacoes: getField('observacoes')?.value || '',
        dataRegistro: new Date().toISOString()
      };

      const cpfCnpj = normalizeCpfCnpj(data.cpfCnpj);
      const nome = data.nome.trim();
      const whatsapp = data.whatsapp.replace(/\D/g, '');
      const email = data.email.trim();

      const isCPF = cpfCnpj.length === 11;
      const isCNPJ = cpfCnpj.length === 14;
      
      if (!isCPF && !isCNPJ) {
        return mostrarAviso('❌ CPF/CNPJ deve ter 11 ou 14 dígitos');
      }

      if (isCPF && !validarCPF(cpfCnpj)) {
        return mostrarAviso('❌ CPF inválido');
      }

      if (isCNPJ && !validarCNPJ(cpfCnpj)) {
        return mostrarAviso('❌ CNPJ inválido');
      }

      const nomePartes = nome.split(' ').filter(p => p.length > 0);
      if (nomePartes.length < 2 || nomePartes[0].length < 2) {
        return mostrarAviso('❌ Informe o nome completo (mín. 2 palavras)');
      }

      if (whatsapp.length < 10) {
        return mostrarAviso('❌ WhatsApp deve ter no mínimo 10 dígitos');
      }

      if (email && !validarEmail(email)) {
        return mostrarAviso('❌ E-mail inválido');
      }

      const clients = loadClients();
      const existe = !!clients[cpfCnpj];
      clients[cpfCnpj] = data;
      saveClients(clients);

      mostrarAviso(existe ? '✔ Cliente atualizado' : '✔ Cliente cadastrado');
    });
  }

  // ======== BUSCAR CLIENTE ========
  const btnBuscar = getField('buscarCliente');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', e => {
      e.preventDefault();
      const cpfCnpj = normalizeCpfCnpj(getField('cpfCnpj')?.value);
      
      if (!cpfCnpj) {
        return mostrarAviso('⚠️ Informe o CPF/CNPJ para buscar');
      }

      const clients = loadClients();
      const found = clients[cpfCnpj];
      
      if (!found) {
        return mostrarAviso('⚠️ Cliente não encontrado');
      }

      // Preencher campos - corrigindo compatibilidade
      getField('cpfCnpj').value = found.cpfCnpj || '';
      getField('nomeRequerente').value = found.nome || found.nomeRequerente || '';
      getField('whatsapp').value = found.whatsapp || '';
      getField('outroContato').value = found.outroContato || '';
      getField('email').value = found.email || '';
      getField('cep').value = found.cep || '';
      getField('endereco').value = found.endereco || '';
      getField('numero').value = found.numero || '';
      getField('complemento').value = found.complemento || '';
      getField('bairro').value = found.bairro || '';
      getField('cidade').value = found.cidade || '';
      getField('observacoes').value = found.observacoes || '';

      const endereco = getField('endereco');
      const bairro = getField('bairro');
      const cidade = getField('cidade');

      [endereco, bairro, cidade].forEach(campo => {
        if (campo && campo.value.trim()) {
          campo.readOnly = true;
          campo.style.backgroundColor = '#e9e9e9';
        }
      });

      mostrarAviso('✔ Cliente encontrado');
    });
  }

  // ======== EDITAR CLIENTE ========
  const btnEditar = getField('editarCliente');
  if (btnEditar) {
    btnEditar.addEventListener('click', e => {
      e.preventDefault();
      const cpfCnpj = normalizeCpfCnpj(getField('cpfCnpj')?.value);
      
      if (!cpfCnpj) {
        return mostrarAviso('⚠️ Busque um cliente primeiro');
      }

      const clients = loadClients();
      if (!clients[cpfCnpj]) {
        return mostrarAviso('⚠️ Cliente não encontrado');
      }

      const endereco = getField('endereco');
      const bairro = getField('bairro');
      const cidade = getField('cidade');

      [endereco, bairro, cidade].forEach(campo => {
        if (campo) {
          campo.readOnly = false;
          campo.style.backgroundColor = '#fff';
        }
      });

      mostrarAviso('✏️ Campos liberados para edição');
    });
  }

  // ======== LIMPAR CAMPOS ========
  const btnLimpar = getField('limparCampos');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', e => {
      e.preventDefault();
      
      const campos = [
        'cpfCnpj','nomeRequerente','whatsapp','outroContato','email',
        'cep','endereco','numero','complemento','bairro','cidade','observacoes'
      ];
      
      campos.forEach(id => {
        const el = getField(id);
        if (el) {
          el.value = '';
          el.readOnly = false;
          el.style.backgroundColor = '';
        }
      });
      
      mostrarAviso('✔ Campos limpos');
    });
  }

}); // ======== FIM DOMContentLoaded ========


// ======== NOTIFICAÇÃO SUAVE ESTILO VIRTOOLIN ========
let avisoAtivo = null;
function mostrarAviso(texto) {
  if (avisoAtivo) avisoAtivo.remove();
  
  const aviso = document.createElement('div');
  aviso.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #111;
    color: #fff;
    font-size: 13px;
    font-family: 'Roboto Mono', monospace;
    padding: 12px 18px;
    border-radius: 6px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border: 1px solid #333;
  `;
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  avisoAtivo = aviso;
  
  requestAnimationFrame(() => {
    aviso.style.opacity = '1';
    aviso.style.transform = 'translateY(0)';
  });
  
  setTimeout(() => {
    aviso.style.opacity = '0';
    aviso.style.transform = 'translateY(10px)';
    setTimeout(() => aviso.remove(), 300);
    avisoAtivo = null;
  }, 2000);
}

// ======== NAVEGAÇÃO ========
document.getElementById('btnClientes')?.addEventListener('click', () => {
  window.location.href = 'clientes.html';
});

document.getElementById('btnAtos')?.addEventListener('click', () => {
  window.location.href = 'atos.html';
});

document.getElementById('btnNotificacoes')?.addEventListener('click', () => {
  window.location.href = 'notificacoes.html';
});

// ======== EMAIL SEMPRE MINÚSCULO ========
const emailInput = document.getElementById('email');
if (emailInput) {
  emailInput.addEventListener('input', () => { 
    emailInput.value = emailInput.value.toLowerCase(); 
  });

  // ======== AUTO-SUGESTÃO DE EMAIL ========
  const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'bol.com.br', 'uol.com.br'];
  
  const sugestaoBox = document.createElement('div');
  sugestaoBox.style.cssText = 'position:absolute;background:#fff;border:1px solid #000;border-radius:6px;font-size:13px;box-shadow:0 2px 4px rgba(0,0,0,0.08);padding:6px 0;display:none;z-index:999;max-height:200px;overflow-y:auto;';
  document.body.appendChild(sugestaoBox);

  emailInput.addEventListener('input', (e) => {
    const valor = e.target.value.trim();
    sugestaoBox.style.display = 'none';
    if (!valor) return;

    const rect = emailInput.getBoundingClientRect();
    sugestaoBox.style.left = rect.left + window.scrollX + 'px';
    sugestaoBox.style.top = rect.bottom + window.scrollY + 3 + 'px';
    sugestaoBox.style.width = rect.width + 'px';

    let sugestoes = [];
    if (!valor.includes('@')) {
      sugestoes = dominios.map(d => `${valor}@${d}`);
    } else {
      const [nome, dominioParte] = valor.split('@');
      sugestoes = dominios
        .filter(d => d.toLowerCase().startsWith(dominioParte.toLowerCase()))
        .map(d => `${nome}@${d}`);
    }

    if (sugestoes.length === 0) return;
    
    sugestaoBox.innerHTML = sugestoes
      .map(s => `<div style="padding:5px 10px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'" onclick="document.getElementById('email').value='${s}';this.parentElement.style.display='none'">${s}</div>`)
      .join('');
    sugestaoBox.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (e.target !== emailInput && e.target.parentElement !== sugestaoBox) {
      sugestaoBox.style.display = 'none';
    }
  });
}