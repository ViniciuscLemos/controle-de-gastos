import { describe, expect, it } from 'vitest';
import { doMes, formatarDinheiro, gastosPorCategoria, lerValor, mudarMes, nomeDoMes, paraCsv, resumo } from './contas';

const lancamentos = [
  { id: 1, descricao: 'Salário', valor: 300000, tipo: 'entrada', categoria: 'Salário', data: '2026-10-05', criadoEm: 1 },
  { id: 2, descricao: 'Mercado', valor: 45090, tipo: 'saida', categoria: 'Alimentação', data: '2026-10-06', criadoEm: 2 },
  { id: 3, descricao: 'Aluguel', valor: 120000, tipo: 'saida', categoria: 'Moradia', data: '2026-10-01', criadoEm: 3 },
  { id: 4, descricao: 'iFood', valor: 3850, tipo: 'saida', categoria: 'Alimentação', data: '2026-10-03', criadoEm: 4 },
  { id: 5, descricao: 'Uber', valor: 2200, tipo: 'saida', categoria: 'Transporte', data: '2026-09-28', criadoEm: 5 },
];

describe('contas', () => {
  it('lê o valor digitado em centavos', () => {
    expect(lerValor('12,50')).toBe(1250);
    expect(lerValor('12.50')).toBe(1250);
    expect(lerValor('1.234,56')).toBe(123456);
    expect(lerValor('R$ 10')).toBe(1000);
    expect(lerValor('0,1')).toBe(10);
    expect(lerValor('abc')).toBe(null);
    expect(lerValor('0')).toBe(null);
    expect(lerValor('-5')).toBe(null);
  });

  it('filtra o mês e ordena do mais novo pro mais antigo', () => {
    expect(doMes(lancamentos, '2026-10').map((l) => l.id)).toEqual([2, 1, 4, 3]);
    expect(doMes(lancamentos, '2026-09').map((l) => l.id)).toEqual([5]);
  });

  it('calcula o saldo do mês', () => {
    expect(resumo(doMes(lancamentos, '2026-10'))).toEqual({ entradas: 300000, saidas: 168940, saldo: 131060 });
  });

  it('soma os gastos por categoria', () => {
    expect(gastosPorCategoria(doMes(lancamentos, '2026-10'))).toEqual([
      { categoria: 'Moradia', valor: 120000 },
      { categoria: 'Alimentação', valor: 48940 },
    ]);
  });

  it('muda de mês virando o ano', () => {
    expect(mudarMes('2026-12', 1)).toBe('2027-01');
    expect(mudarMes('2026-01', -1)).toBe('2025-12');
  });

  it('escreve o nome do mês e o valor em reais', () => {
    expect(nomeDoMes('2026-10')).toBe('Outubro de 2026');
    expect(nomeDoMes('2027-03')).toBe('Março de 2027');
    // o toLocaleString usa um espaço que não quebra linha depois do R$
    expect(formatarDinheiro(123456).replace(/\s/g, ' ')).toBe('R$ 1.234,56');
    expect(formatarDinheiro(5).replace(/\s/g, ' ')).toBe('R$ 0,05');
  });

  it('gera o csv', () => {
    const csv = paraCsv([lancamentos[1], { ...lancamentos[0], descricao: 'Salário "out"' }]).split('\n');
    expect(csv[0]).toBe('Data;Descrição;Categoria;Tipo;Valor');
    expect(csv[1]).toBe('06/10/2026;"Mercado";Alimentação;Saída;-450,90');
    expect(csv[2]).toBe('05/10/2026;"Salário ""out""";Salário;Entrada;3000,00');
  });
});
