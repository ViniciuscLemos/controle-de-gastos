// Os valores ficam em centavos (inteiro) pra não ter problema de arredondamento:
// em JS 0.1 + 0.2 dá 0.30000000000000004.

export const CATEGORIAS = {
  saida: ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Compras', 'Outros'],
  entrada: ['Salário', 'Freela', 'Mesada', 'Outros'],
};

// "12,50" / "12.50" / "1.234,56" -> 1250 / 1250 / 123456 (ou null se não der)
export function lerValor(texto) {
  let limpo = String(texto).trim().replace(/[R$\s]/g, '');
  if (limpo.includes(',')) limpo = limpo.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null;
  const centavos = Math.round(Number(limpo) * 100);
  return centavos > 0 ? centavos : null;
}

export function formatarDinheiro(centavos) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2026-10" a partir de "2026-10-06"
export const mesDe = (data) => data.slice(0, 7);

export function doMes(lancamentos, mes) {
  return lancamentos
    .filter((l) => mesDe(l.data) === mes)
    .sort((a, b) => b.data.localeCompare(a.data) || b.criadoEm - a.criadoEm);
}

export function resumo(lancamentos) {
  let entradas = 0;
  let saidas = 0;
  for (const l of lancamentos) {
    if (l.tipo === 'entrada') entradas += l.valor;
    else saidas += l.valor;
  }
  return { entradas, saidas, saldo: entradas - saidas };
}

// gastos somados por categoria, do maior pro menor
export function gastosPorCategoria(lancamentos) {
  const total = {};
  for (const l of lancamentos) {
    if (l.tipo !== 'saida') continue;
    total[l.categoria] = (total[l.categoria] || 0) + l.valor;
  }
  return Object.entries(total)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
}

export function mudarMes(mes, quantos) {
  const [ano, m] = mes.split('-').map(Number);
  const d = new Date(ano, m - 1 + quantos, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function nomeDoMes(mes) {
  const [ano, m] = mes.split('-').map(Number);
  const nome = new Date(ano, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
  return `${nome[0].toUpperCase()}${nome.slice(1)} de ${ano}`;
}

export function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// separado por ; porque o Excel em português usa a vírgula como decimal
export function paraCsv(lancamentos) {
  const aspas = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const linhas = lancamentos.map((l) => [
    l.data.split('-').reverse().join('/'),
    aspas(l.descricao),
    l.categoria,
    l.tipo === 'entrada' ? 'Entrada' : 'Saída',
    ((l.tipo === 'entrada' ? 1 : -1) * l.valor / 100).toFixed(2).replace('.', ','),
  ].join(';'));
  return ['Data;Descrição;Categoria;Tipo;Valor', ...linhas].join('\n');
}
