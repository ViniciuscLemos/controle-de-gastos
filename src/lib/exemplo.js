// lançamentos de mentira pra quem abrir o app ver ele funcionando
const DADOS = [
  [1, 'entrada', 'Salário', 'Salário', 320000],
  [2, 'saida', 'Aluguel', 'Moradia', 110000],
  [3, 'saida', 'Mercado', 'Alimentação', 38740],
  [5, 'saida', 'Conta de luz', 'Moradia', 14320],
  [6, 'saida', 'Bilhete único', 'Transporte', 8800],
  [8, 'saida', 'Cinema', 'Lazer', 6400],
  [10, 'entrada', 'Site pra um cliente', 'Freela', 80000],
  [11, 'saida', 'Farmácia', 'Saúde', 5290],
  [12, 'saida', 'iFood', 'Alimentação', 6150],
  [14, 'saida', 'Curso de React', 'Educação', 2790],
  [15, 'saida', 'Uber', 'Transporte', 2340],
  [18, 'saida', 'Tênis', 'Compras', 29990],
  [20, 'saida', 'Mercado', 'Alimentação', 21460],
  [22, 'saida', 'Show', 'Lazer', 15000],
];

// No mês atual os dias são espremidos até hoje, senão aparece gasto com data no futuro
export function exemplo(mes, hoje) {
  const diaDeHoje = Number(hoje.slice(8, 10));
  const ajustar = (dia) =>
    mes === hoje.slice(0, 7) && diaDeHoje < 22 ? Math.max(1, Math.round((dia * diaDeHoje) / 22)) : dia;

  return DADOS.map(([dia, tipo, descricao, categoria, valor], i) => ({
    id: `exemplo-${i}`,
    tipo,
    descricao,
    categoria,
    valor,
    data: `${mes}-${String(ajustar(dia)).padStart(2, '0')}`,
    criadoEm: i,
  }));
}
