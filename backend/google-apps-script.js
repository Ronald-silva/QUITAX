/**
 * Quitax — Backend Google Apps Script
 * Planilha: https://docs.google.com/spreadsheets/d/1kAssSdEODk1OKb6FXUMgGGK-n4wA4BEvD-AXCwAP9ik
 *
 * Instruções de instalação:
 * 1. Abra a planilha do Google Sheets
 * 2. Vá em Extensões > Apps Script
 * 3. Substitua todo o conteúdo pelo deste arquivo
 * 4. Salve (Ctrl+S)
 * 5. Clique em Implantar > Nova implantação
 * 6. Tipo: App da Web
 * 7. Em "Executar como": Eu (seu e-mail)
 * 8. Em "Quem pode acessar": Qualquer pessoa
 * 9. Clique em Implantar e copie a URL gerada
 * 10. Cole a URL no arquivo frontend/.env como VITE_API_URL=<url>
 */

// ============================================================
// CONFIGURAÇÃO — ID da Planilha Google Sheets
// ============================================================
const SPREADSHEET_ID = '1kAssSdEODk1OKb6FXUMgGGK-n4wA4BEvD-AXCwAP9ik';
const SHEET_NAME = 'Pagamentos';

// ============================================================
// ROTEAMENTO — GET e POST
// ============================================================

/**
 * GET  /exec                                           → Lista todos os pagamentos
 * GET  /exec?action=add&descricao=...&valor=...&data=... → Registra novo pagamento
 * GET  /exec?action=delete&id=PAY_xxx                 → Deleta um pagamento por ID
 *
 * Nota: o add usa GET (não POST) porque o GAS bloqueia POSTs de domínios externos
 * com erro de permissão OAuth — GET via query params não tem essa limitação.
 */
function doGet(e) {
  try {
    const action = e.parameter && e.parameter.action;

    if (action === 'add') {
      return addPaymentViaGet(e.parameter);
    }

    if (action === 'delete') {
      const id = e.parameter.id;
      if (!id) {
        return createResponse({ success: false, message: 'ID do pagamento não informado' }, 400);
      }
      return deletePayment(id);
    }

    // Ação padrão: listar pagamentos
    const sheet = getSheet();
    const payments = getAllPayments(sheet);

    return createResponse({
      success: true,
      data: payments,
      count: payments.length,
      message: 'Pagamentos carregados com sucesso'
    });

  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString(),
      message: 'Erro ao processar requisição GET'
    }, 500);
  }
}

/**
 * POST /exec  body: { descricao, valor, data } → Registra novo pagamento
 */
function doPost(e) {
  try {
    const sheet = getSheet();

    // Parse do corpo da requisição
    if (!e.postData || !e.postData.contents) {
      throw new Error('Corpo da requisição vazio');
    }

    const body = JSON.parse(e.postData.contents);

    // Validação
    if (!body.valor || isNaN(parseFloat(body.valor))) {
      throw new Error('Campo obrigatório inválido: valor deve ser um número');
    }
    if (!body.data) {
      throw new Error('Campo obrigatório faltando: data');
    }

    // Gera ID único
    const id = 'PAY_' + Date.now();
    const descricao = body.descricao || 'Parcela semanal';
    const valor = parseFloat(body.valor);
    const data = body.data;

    // Insere na planilha
    sheet.appendRow([id, descricao, valor, data]);

    return createResponse({
      success: true,
      data: { id, descricao, valor, data },
      message: 'Pagamento registrado com sucesso'
    });

  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString(),
      message: 'Erro ao registrar pagamento'
    }, 400);
  }
}

/**
 * OPTIONS — CORS preflight
 */
function doOptions(e) {
  return createResponse({ success: true }, 200);
}

// ============================================================
// FUNÇÕES INTERNAS
// ============================================================

/**
 * Registra um novo pagamento via GET query params
 * Params: descricao, valor (número), data (YYYY-MM-DD)
 */
function addPaymentViaGet(params) {
  const valor = parseFloat(params.valor);
  if (!params.data || isNaN(valor) || valor <= 0) {
    return createResponse({ success: false, message: 'Parâmetros inválidos: data e valor são obrigatórios' }, 400);
  }

  const sheet = getSheet();
  const id = 'PAY_' + Date.now();
  const descricao = params.descricao || 'Parcela semanal';

  sheet.appendRow([id, descricao, valor, params.data]);

  return createResponse({
    success: true,
    data: { id, descricao, valor, data: params.data },
    message: 'Pagamento registrado com sucesso'
  });
}

/**
 * Deleta um pagamento pelo ID
 */
function deletePayment(id) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return createResponse({ success: false, message: 'Nenhum pagamento encontrado' }, 404);
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 2); // +2 porque começa da linha 2 (pula cabeçalho)
      return createResponse({
        success: true,
        message: 'Pagamento excluído com sucesso'
      });
    }
  }

  return createResponse({
    success: false,
    message: 'Pagamento não encontrado com o ID: ' + id
  }, 404);
}

/**
 * Obtém ou cria a aba de pagamentos
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);

    // Cabeçalhos
    const headers = [['id', 'descricao', 'valor', 'data']];
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setValues(headers);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1e293b');
    headerRange.setFontColor('#10b981');
    headerRange.setFontSize(11);

    // Formata coluna de valor como moeda BRL
    sheet.getRange('C:C').setNumberFormat('R$ #,##0.00');

    // Ajusta larguras das colunas
    sheet.setColumnWidth(1, 150); // id
    sheet.setColumnWidth(2, 200); // descricao
    sheet.setColumnWidth(3, 120); // valor
    sheet.setColumnWidth(4, 120); // data

    Logger.log('Aba "Pagamentos" criada com sucesso na planilha ' + SPREADSHEET_ID);
  }

  return sheet;
}

/**
 * Recupera todos os pagamentos
 */
function getAllPayments(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

  return data
    .map(function(row) {
      return {
        id: String(row[0]),
        descricao: String(row[1]),
        valor: parseFloat(row[2]) || 0,
        data: formatDate(row[3])
      };
    })
    .filter(function(payment) {
      return payment.id && payment.id.length > 0 && payment.valor > 0;
    });
}

/**
 * Formata data para YYYY-MM-DD
 */
function formatDate(dateValue) {
  if (!dateValue) return '';

  if (typeof dateValue === 'string') {
    // Aceita formatos DD/MM/YYYY e YYYY-MM-DD
    if (dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
      }
    }
    return dateValue;
  }

  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  return String(dateValue);
}

/**
 * Cria resposta JSON com headers CORS
 */
function createResponse(content, statusCode) {
  statusCode = statusCode || 200;
  const json = JSON.stringify(content);

  // Google Apps Script não suporta status code custom no ContentService,
  // mas incluímos no body para o frontend interpretar
  if (statusCode !== 200) {
    content._statusCode = statusCode;
  }

  return ContentService
    .createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}
