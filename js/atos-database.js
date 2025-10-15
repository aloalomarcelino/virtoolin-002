// Base de dados de todos os atos do cartório
const ATOS_DATABASE = {
  "1º RCPN": [
    { id: "1RC-GRA", nome: "[1º Ofício] Certidão 2ª Via Gratuita", valor: 0, dias: 10, codigo: "BVN1" },
    { id: "1RC-DIV", nome: "[1º Ofício] 1ª Via Divórcio", valor: 190, dias: 1, codigo: "DIV1" },
    { id: "1RC-5A", nome: "[1º Ofício] Certidão 2ª Via (até 5a)", valor: 70, dias: 1, codigo: "BVN1" },
    { id: "1RC-10A", nome: "[1º Ofício] Certidão 2ª Via (até 10a)", valor: 80, dias: 1, codigo: "BVN1" },
    { id: "1RC-20A", nome: "[1º Ofício] Certidão 2ª Via (até 20a)", valor: 94, dias: 1, codigo: "BVN1" },
    { id: "1RC-20+", nome: "[1º Ofício] Certidão 2ª Via (+ de 20a)", valor: 108, dias: 1, codigo: "BVN1" },
    { id: "1RC-RED5", nome: "[1º Ofício] Certidão Reduzida 2ª Via (até 5a)", valor: 80, dias: 1, codigo: "RED1" },
    { id: "1RC-RED10", nome: "[1º Ofício] Certidão Reduzida 2ª Via (até 10a)", valor: 90, dias: 1, codigo: "RED1" },
    { id: "1RC-RED20", nome: "[1º Ofício] Certidão Reduzida 2ª Via (até 20a)", valor: 104, dias: 1, codigo: "RED1" },
    { id: "1RC-RED20+", nome: "[1º Ofício] Certidão Reduzida 2ª Via (+ de 20a)", valor: 118, dias: 1, codigo: "RED1" },
    { id: "1RC-PATMA", nome: "[1º Ofício] Reconh. Paternidade (maior)", valor: 210, dias: 2, codigo: "PAT1" },
    { id: "1RC-PATME", nome: "[1º Ofício] Reconh. Paternidade (menor)", valor: 0, dias: 5, codigo: "PAT1" },
    { id: "1RC-ADGRA", nome: "[1º Ofício] Processo Adm. Gratuito", valor: 0, dias: 10, codigo: "PAD1" },
    { id: "1RC-AD5", nome: "[1º Ofício] Processo Adm. (até 5a)", valor: 324, dias: 2, codigo: "PAD1" },
    { id: "1RC-AD10", nome: "[1º Ofício] Processo Adm. (até 10a)", valor: 331, dias: 2, codigo: "PAD1" },
    { id: "1RC-AD20", nome: "[1º Ofício] Processo Adm. (até 20a)", valor: 352, dias: 2, codigo: "PAD1" },
    { id: "1RC-AD20+", nome: "[1º Ofício] Processo Adm. (+ de 20a)", valor: 366, dias: 2, codigo: "PAD1" },
    { id: "1RC-PTN5", nome: "[1º Ofício] Patronímico (até 5a)", valor: 324, dias: 2, codigo: "PTN1" },
    { id: "1RC-PTN10", nome: "[1º Ofício] Patronímico (até 10a)", valor: 331, dias: 2, codigo: "PTN1" },
    { id: "1RC-PTN20", nome: "[1º Ofício] Patronímico (até 20a)", valor: 352, dias: 2, codigo: "PTN1" },
    { id: "1RC-PTN20+", nome: "[1º Ofício] Patronímico (+ de 20a)", valor: 366, dias: 2, codigo: "PTN1" },
    { id: "1RC-SOC12", nome: "[1º Ofício] Pat. Socioafetiva (12–20a)", valor: 265, dias: 5, codigo: "SOC1" },
    { id: "1RC-SOC20", nome: "[1º Ofício] Pat. Socioafetiva (+ de 20a)", valor: 280, dias: 5, codigo: "SOC1" },
    { id: "1RC-IT5", nome: "[1º Ofício] Inteiro Teor (até 5a)", valor: 101, dias: 5, codigo: "ITO1" },
    { id: "1RC-IT10", nome: "[1º Ofício] Inteiro Teor (até 10a)", valor: 108, dias: 5, codigo: "ITO1" },
    { id: "1RC-IT20", nome: "[1º Ofício] Inteiro Teor (até 20a)", valor: 130, dias: 5, codigo: "ITO1" },
    { id: "1RC-IT20+", nome: "[1º Ofício] Inteiro Teor (+ de 20a)", valor: 147, dias: 5, codigo: "ITO1" }
  ],

  "2º RCPN": [
    { id: "2RC-RNAS", nome: "Registro de Nascimento", valor: 0, dias: 0, codigo: "RNA2" },
    { id: "2RC-ROBI", nome: "Registro de Óbito", valor: 0, dias: 0, codigo: "ROB2" },
    { id: "2RC-GRA", nome: "[2º Ofício] Certidão 2ª Via Gratuita", valor: 0, dias: 10, codigo: "BVN2" },
    { id: "2RC-DIV", nome: "[2º Ofício] 1ª Via Divórcio", valor: 190, dias: 1, codigo: "DIV2" },
    { id: "2RC-5A", nome: "[2º Ofício] Certidão 2ª Via (até 5a)", valor: 70, dias: 1, codigo: "BVN2" },
    { id: "2RC-10A", nome: "[2º Ofício] Certidão 2ª Via (até 10a)", valor: 80, dias: 1, codigo: "BVN2" },
    { id: "2RC-20A", nome: "[2º Ofício] Certidão 2ª Via (até 20a)", valor: 94, dias: 1, codigo: "BVN2" },
    { id: "2RC-20+", nome: "[2º Ofício] Certidão 2ª Via (+ de 20a)", valor: 108, dias: 1, codigo: "BVN2" },
    { id: "2RC-RED5", nome: "[2º Ofício] Certidão Reduzida 2ª Via (até 5a)", valor: 80, dias: 1, codigo: "RED2" },
    { id: "2RC-RED10", nome: "[2º Ofício] Certidão Reduzida 2ª Via (até 10a)", valor: 90, dias: 1, codigo: "RED2" },
    { id: "2RC-RED20", nome: "[2º Ofício] Certidão Reduzida 2ª Via (até 20a)", valor: 104, dias: 1, codigo: "RED2" },
    { id: "2RC-RED20+", nome: "[2º Ofício] Certidão Reduzida 2ª Via (+ de 20a)", valor: 118, dias: 1, codigo: "RED2" },
    { id: "2RC-PATMA", nome: "[2º Ofício] Reconh. Paternidade (maior)", valor: 210, dias: 2, codigo: "PAT2" },
    { id: "2RC-PATME", nome: "[2º Ofício] Reconh. Paternidade (menor)", valor: 0, dias: 5, codigo: "PAT2" },
    { id: "2RC-ADGRA", nome: "[2º Ofício] Processo Adm. Gratuito", valor: 0, dias: 10, codigo: "PAD2" },
    { id: "2RC-AD5", nome: "[2º Ofício] Processo Adm. (até 5a)", valor: 324, dias: 1, codigo: "PAD2" },
    { id: "2RC-AD10", nome: "[2º Ofício] Processo Adm. (até 10a)", valor: 331, dias: 1, codigo: "PAD2" },
    { id: "2RC-AD20", nome: "[2º Ofício] Processo Adm. (até 20a)", valor: 352, dias: 1, codigo: "PAD2" },
    { id: "2RC-AD20+", nome: "[2º Ofício] Processo Adm. (+ de 20a)", valor: 366, dias: 1, codigo: "PAD2" },
    { id: "2RC-PTN5", nome: "[2º Ofício] Patronímico (até 5a)", valor: 324, dias: 1, codigo: "PTN2" },
    { id: "2RC-PTN10", nome: "[2º Ofício] Patronímico (até 10a)", valor: 331, dias: 1, codigo: "PTN2" },
    { id: "2RC-PTN20", nome: "[2º Ofício] Patronímico (até 20a)", valor: 352, dias: 1, codigo: "PTN2" },
    { id: "2RC-PTN20+", nome: "[2º Ofício] Patronímico (+ de 20a)", valor: 366, dias: 1, codigo: "PTN2" },
    { id: "2RC-SOC12", nome: "[2º Ofício] Paternidade Socioafetiva (12–20a)", valor: 265, dias: 5, codigo: "SOC2" },
    { id: "2RC-SOC20", nome: "[2º Ofício] Paternidade Socioafetiva (+ de 20a)", valor: 280, dias: 5, codigo: "SOC2" },
    { id: "2RC-IT5", nome: "[2º Ofício] Inteiro Teor (até 5a)", valor: 101, dias: 5, codigo: "ITO2" },
    { id: "2RC-IT10", nome: "[2º Ofício] Inteiro Teor (até 10a)", valor: 108, dias: 5, codigo: "ITO2" },
    { id: "2RC-IT20", nome: "[2º Ofício] Inteiro Teor (até 20a)", valor: 130, dias: 5, codigo: "ITO2" },
    { id: "2RC-IT20+", nome: "[2º Ofício] Inteiro Teor (+ de 20a)", valor: 147, dias: 5, codigo: "ITO2" },
    { id: "2RC-TDUN", nome: "Termo Declaratório de União Estável", valor: 379, dias: 0, codigo: "TDU2" },
    { id: "2RC-ECIV", nome: "Certidão de Estado Civil", valor: 108, dias: 1, codigo: "CEC2" },
    { id: "2RC-APOS", nome: "Apostilamento", valor: 98, dias: 0, codigo: "APO2" }
  ],

  "5º RCPN": [
    { id: "5RC-GRA", nome: "[5º Ofício] Certidão 2ª Via Gratuita", valor: 0, dias: 10, codigo: "BVN5" },
    { id: "5RC-DIV", nome: "[5º Ofício] 1ª Via Divórcio", valor: 190, dias: 1, codigo: "DIV5" },
    { id: "5RC-5A", nome: "[5º Ofício] Certidão 2ª Via (até 5a)", valor: 70, dias: 1, codigo: "BVN5" },
    { id: "5RC-10A", nome: "[5º Ofício] Certidão 2ª Via (até 10a)", valor: 80, dias: 1, codigo: "BVN5" },
    { id: "5RC-20A", nome: "[5º Ofício] Certidão 2ª Via (até 20a)", valor: 94, dias: 1, codigo: "BVN5" },
    { id: "5RC-20+", nome: "[5º Ofício] Certidão 2ª Via (+ de 20a)", valor: 108, dias: 1, codigo: "BVN5" },
    { id: "5RC-RED5", nome: "[5º Ofício] Certidão Reduzida 2ª Via (até 5a)", valor: 80, dias: 1, codigo: "RED5" },
    { id: "5RC-RED10", nome: "[5º Ofício] Certidão Reduzida 2ª Via (até 10a)", valor: 90, dias: 1, codigo: "RED5" },
    { id: "5RC-RED20", nome: "[5º Ofício] Certidão Reduzida 2ª Via (até 20a)", valor: 104, dias: 1, codigo: "RED5" },
    { id: "5RC-RED20+", nome: "[5º Ofício] Certidão Reduzida 2ª Via (+ de 20a)", valor: 118, dias: 1, codigo: "RED5" },
    { id: "5RC-PATMA", nome: "[5º Ofício] Reconh. Paternidade (maior)", valor: 210, dias: 2, codigo: "PAT5" },
    { id: "5RC-PATME", nome: "[5º Ofício] Reconh. Paternidade (menor)", valor: 0, dias: 5, codigo: "PAT5" },
    { id: "5RC-ADGRA", nome: "[5º Ofício] Processo Adm. Gratuito", valor: 0, dias: 10, codigo: "PAD5" },
    { id: "5RC-AD5", nome: "[5º Ofício] Processo Adm. (até 5a)", valor: 324, dias: 2, codigo: "PAD5" },
    { id: "5RC-AD10", nome: "[5º Ofício] Processo Adm. (até 10a)", valor: 331, dias: 2, codigo: "PAD5" },
    { id: "5RC-AD20", nome: "[5º Ofício] Processo Adm. (até 20a)", valor: 352, dias: 2, codigo: "PAD5" },
    { id: "5RC-AD20+", nome: "[5º Ofício] Processo Adm. (+ de 20a)", valor: 366, dias: 2, codigo: "PAD5" },
    { id: "5RC-PTN5", nome: "[5º Ofício] Patronímico (até 5a)", valor: 324, dias: 2, codigo: "PTN5" },
    { id: "5RC-PTN10", nome: "[5º Ofício] Patronímico (até 10a)", valor: 331, dias: 2, codigo: "PTN5" },
    { id: "5RC-PTN20", nome: "[5º Ofício] Patronímico (até 20a)", valor: 352, dias: 2, codigo: "PTN5" },
    { id: "5RC-PTN20+", nome: "[5º Ofício] Patronímico (+ de 20a)", valor: 366, dias: 2, codigo: "PTN5" },
    { id: "5RC-SOC12", nome: "[5º Ofício] Paternidade Socioafetiva (12–20a)", valor: 265, dias: 5, codigo: "SOC5" },
    { id: "5RC-SOC20", nome: "[5º Ofício] Paternidade Socioafetiva (+ de 20a)", valor: 280, dias: 5, codigo: "SOC5" },
    { id: "5RC-IT5", nome: "[5º Ofício] Inteiro Teor (até 5a)", valor: 101, dias: 5, codigo: "ITO5" },
    { id: "5RC-IT10", nome: "[5º Ofício] Inteiro Teor (até 10a)", valor: 108, dias: 5, codigo: "ITO5" },
    { id: "5RC-IT20", nome: "[5º Ofício] Inteiro Teor (até 20a)", valor: 130, dias: 5, codigo: "ITO5" },
    { id: "5RC-IT20+", nome: "[5º Ofício] Inteiro Teor (+ de 20a)", valor: 147, dias: 5, codigo: "ITO5" }
  ],

  "CASAMENTO": [
    { id: "CAS-CIV", nome: "Casamento Civil", valor: 379, dias: 0, codigo: "CCV" },
    { id: "CAS-CIVG", nome: "Casamento Civil – Gratuito", valor: 0, dias: 0, codigo: "CCV" },
    { id: "CAS-CONV", nome: "Conversão de União Estável em Casamento", valor: 379, dias: 5, codigo: "CUE" },
    { id: "CAS-EST", nome: "Casamento Civil com Estrangeiro", valor: 479, dias: 5, codigo: "CCE" },
    { id: "CAS-REL", nome: "Casamento Religioso c/ Efeito Civil", valor: 563, dias: 5, codigo: "CRC" },
    { id: "CAS-DIL", nome: "Casamento em Diligência", valor: 1000, dias: 0, codigo: "CDL" },
    { id: "CAS-CFFO", nome: "Cas. Civil c/ Celebrante Fora do Cartório", valor: 1600, dias: 0, codigo: "CCF" },
    { id: "CAS-CFDE", nome: "Cas. Civil c/ Celebrante Dentro do Cartório", valor: 1600, dias: 0, codigo: "CCD" },
    { id: "CAS-RCFO", nome: "Cas. Rel&Civil c/ Celebrante Fora do Cartório", valor: 1600, dias: 0, codigo: "CRF" },
    { id: "CAS-RCDE", nome: "Cas. Rel&Civil c/ Celebrante Dentro do Cartório", valor: 1600, dias: 0, codigo: "CRD" },
    { id: "CAS-REM", nome: "Taxa de Remarcação", valor: 40, dias: 0, codigo: "TRM" },
    { id: "CAS-DRO", nome: "Diligência Roger", valor: 250, dias: 10, codigo: "DRO" },
    { id: "CAS-DSP", nome: "Diligência Silvio Porto", valor: 250, dias: 10, codigo: "DSP" },
    { id: "CAS-DJA", nome: "Diligência PB1 Jacarapé", valor: 300, dias: 10, codigo: "DJA" }
  ],

  "CRC": [
    { id: "CRC-AC", nome: "[CRC] Acre (AC)", valor: 138.09, dias: 20, codigo: "CRC" },
    { id: "CRC-AL", nome: "[CRC] Alagoas (AL)", valor: 125.84, dias: 20, codigo: "CRC" },
    { id: "CRC-AP", nome: "[CRC] Amapá (AP)", valor: 165.05, dias: 20, codigo: "CRC" },
    { id: "CRC-AM", nome: "[CRC] Amazonas (AM)", valor: 209.39, dias: 20, codigo: "CRC" },
    { id: "CRC-BA", nome: "[CRC] Bahia (BA)", valor: 154.39, dias: 20, codigo: "CRC" },
    { id: "CRC-CE", nome: "[CRC] Ceará (CE)", valor: 177.73, dias: 20, codigo: "CRC" },
    { id: "CRC-DF", nome: "[CRC] Distrito Federal (DF)", valor: 154.78, dias: 20, codigo: "CRC" },
    { id: "CRC-ES", nome: "[CRC] Espírito Santo (ES)", valor: 153.67, dias: 20, codigo: "CRC" },
    { id: "CRC-GO", nome: "[CRC] Goiás (GO)", valor: 199.98, dias: 20, codigo: "CRC" },
    { id: "CRC-MA", nome: "[CRC] Maranhão (MA)", valor: 190.53, dias: 20, codigo: "CRC" },
    { id: "CRC-MT", nome: "[CRC] Mato Grosso (MT)", valor: 137.89, dias: 20, codigo: "CRC" },
    { id: "CRC-MS", nome: "[CRC] Mato Grosso do Sul (MS)", valor: 168.60, dias: 20, codigo: "CRC" },
    { id: "CRC-MG", nome: "[CRC] Minas Gerais (MG)", valor: 173.37, dias: 20, codigo: "CRC" },
    { id: "CRC-PA", nome: "[CRC] Pará (PA)", valor: 287.74, dias: 20, codigo: "CRC" },
    { id: "CRC-PB", nome: "[CRC] Paraíba (PB)", valor: 170.00, dias: 20, codigo: "CRC" },
    { id: "CRC-PR", nome: "[CRC] Paraná (PR)", valor: 160.86, dias: 20, codigo: "CRC" },
    { id: "CRC-PE", nome: "[CRC] Pernambuco (PE)", valor: 180.53, dias: 20, codigo: "CRC" },
    { id: "CRC-PI", nome: "[CRC] Piauí (PI)", valor: 203.26, dias: 20, codigo: "CRC" },
    { id: "CRC-RJ", nome: "[CRC] Rio de Janeiro (RJ)", valor: 261.49, dias: 20, codigo: "CRC" },
    { id: "CRC-RN", nome: "[CRC] Rio Grande do Norte (RN)", valor: 215.18, dias: 20, codigo: "CRC" },
    { id: "CRC-RS", nome: "[CRC] Rio Grande do Sul (RS)", valor: 166.49, dias: 20, codigo: "CRC" },
    { id: "CRC-RO", nome: "[CRC] Rondônia (RO)", valor: 145.97, dias: 20, codigo: "CRC" },
    { id: "CRC-RR", nome: "[CRC] Roraima (RR)", valor: 134.52, dias: 20, codigo: "CRC" },
    { id: "CRC-SC", nome: "[CRC] Santa Catarina (SC)", valor: 159.49, dias: 20, codigo: "CRC" },
    { id: "CRC-SP", nome: "[CRC] São Paulo (SP)", valor: 157.43, dias: 20, codigo: "CRC" },
    { id: "CRC-SE", nome: "[CRC] Sergipe (SE)", valor: 184.04, dias: 20, codigo: "CRC" },
    { id: "CRC-TO", nome: "[CRC] Tocantins (TO)", valor: 164.40, dias: 20, codigo: "CRC" },
    { id: "CRC-ADC", nome: "Adicional do CRC", valor: 14.48, dias: 0, codigo: "ADC" },
    { id: "CRC-EPR", nome: "E-protocolo", valor: 278.19, dias: 20, codigo: "EPR" }
  ],

  "LIVRO E": [
    { id: "LVE-EMA", nome: "[Livro E] Emancipação", valor: 179, dias: 3, codigo: "EMA" },
    { id: "LVE-RUE", nome: "[Livro E] Registro de União Estável", valor: 179, dias: 3, codigo: "RUE" },
    { id: "LVE-INT", nome: "[Livro E] Interdição/Curatela", valor: 179, dias: 3, codigo: "INT" },
    { id: "LVE-TRA", nome: "[Livro E] Traslado", valor: 250, dias: 5, codigo: "TRA" },
    { id: "LVE-2VIA", nome: "[Livro E] Certidão 2ª Via", valor: 179, dias: 5, codigo: "BVE" },
    { id: "LVE-DIV", nome: "[Livro E] Divórcio 1ª Via", valor: 261, dias: 5, codigo: "DVE" },
    { id: "LVE-NEG", nome: "Negativa de Interdição", valor: 108, dias: 1, codigo: "NIN" }
  ],

  "BUSCA": [
    { id: "BUS-PAD", nome: "Busca", valor: 108, dias: 10, codigo: "BUS" },
    { id: "BUS-GRA", nome: "Busca Gratuita", valor: 0, dias: 10, codigo: "BUS" },
    { id: "BUS-2AC", nome: "Busca em 2 Acervos", valor: 216, dias: 10, codigo: "BS2" },
    { id: "BUS-3AC", nome: "Busca em 3 Acervos", valor: 324, dias: 10, codigo: "BS3" },
    { id: "BUS-ADC", nome: "Adicional da Busca Encontrada", valor: 0, dias: 0, codigo: "ADB" }
  ],

  "OUTROS": [
    { id: "OUT-ENV", nome: "Envio da Certidão", valor: 100, dias: 0, codigo: "ENV" },
    { id: "OUT-ADC", nome: "Adicional a Pagar", valor: 0, dias: 0, codigo: "ADC" }
  ]
};

// Função para gerar ID único de ato
function gerarIdAto(codigo, numero) {
  return `A-${codigo}${String(numero).padStart(5, '0')}`;
}

// Função para obter próximo número de ato
function obterProximoNumeroAto() {
  const ultimoNumero = parseInt(localStorage.getItem('virtoolin_ultimo_ato') || '0');
  const proximo = ultimoNumero + 1;
  localStorage.setItem('virtoolin_ultimo_ato', proximo);
  return proximo;
}

// Função para calcular data de entrega
function calcularDataEntrega(dias) {
  const hoje = new Date();
  let diasUteis = 0;
  let dataAtual = new Date(hoje);

  while (diasUteis < dias) {
    dataAtual.setDate(dataAtual.getDate() + 1);
    const diaSemana = dataAtual.getDay();
    // Pula fins de semana
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }
  }

  return dataAtual;
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ATOS_DATABASE, gerarIdAto, obterProximoNumeroAto, calcularDataEntrega };
}