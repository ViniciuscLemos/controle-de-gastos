import { useEffect, useState } from 'react';
import { doMes, hoje, mesDe, mudarMes, nomeDoMes, paraCsv, resumo } from './lib/contas';
import { exemplo } from './lib/exemplo';
import Formulario from './components/Formulario';
import Resumo from './components/Resumo';
import Grafico from './components/Grafico';
import Lista from './components/Lista';

function carregar() {
  try {
    return JSON.parse(localStorage.getItem('lancamentos')) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [lancamentos, setLancamentos] = useState(carregar);
  const [mes, setMes] = useState(mesDe(hoje()));
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('lancamentos', JSON.stringify(lancamentos));
    } catch {
      // sem localStorage (aba anônima), só não salva
    }
  }, [lancamentos]);

  const doMesAtual = doMes(lancamentos, mes);

  function salvar(lancamento) {
    if (editando) {
      setLancamentos((lista) => lista.map((l) => (l.id === editando.id ? { ...l, ...lancamento } : l)));
      setEditando(null);
    } else {
      setLancamentos((lista) => [...lista, { ...lancamento, id: crypto.randomUUID(), criadoEm: Date.now() }]);
    }
    // se lançou em outro mês, vai pra ele pra pessoa ver que entrou
    setMes(mesDe(lancamento.data));
  }

  function editar(lancamento) {
    setEditando(lancamento);
    // no celular o formulário fica lá em cima, longe da lista
    document.querySelector('.formulario')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function excluir(lancamento) {
    if (!confirm(`Excluir "${lancamento.descricao}"?`)) return;
    setLancamentos((lista) => lista.filter((l) => l.id !== lancamento.id));
    if (editando?.id === lancamento.id) setEditando(null);
  }

  function exportar() {
    // o ﻿ no começo é pro Excel abrir os acentos certo
    const blob = new Blob(['﻿' + paraCsv(doMesAtual)], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gastos-${mes}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="app">
      <header>
        <h1>Controle de Gastos</h1>
        <div className="meses">
          <button onClick={() => setMes(mudarMes(mes, -1))} aria-label="Mês anterior">‹</button>
          <strong>{nomeDoMes(mes)}</strong>
          <button onClick={() => setMes(mudarMes(mes, 1))} aria-label="Próximo mês">›</button>
        </div>
      </header>

      <Resumo {...resumo(doMesAtual)} />

      <div className="colunas">
        <div>
          <Formulario
            key={editando?.id || 'novo'}
            editando={editando}
            onSalvar={salvar}
            onCancelar={() => setEditando(null)}
          />
          <Grafico lancamentos={doMesAtual} />
        </div>

        <section className="cartao">
          <div className="titulo-lista">
            <h2>Lançamentos</h2>
            {doMesAtual.length > 0 && <button className="secundario" onClick={exportar}>Exportar CSV</button>}
          </div>

          {doMesAtual.length > 0 ? (
            <Lista lancamentos={doMesAtual} onEditar={editar} onExcluir={excluir} />
          ) : (
            <div className="vazio">
              <p>Nada lançado em {nomeDoMes(mes).toLowerCase()}.</p>
              {lancamentos.length === 0 && (
                <button className="secundario" onClick={() => setLancamentos(exemplo(mes, hoje()))}>
                  Carregar dados de exemplo
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <footer>
        Os dados ficam salvos só no seu navegador · feito por{' '}
        <a href="https://github.com/ViniciuscLemos" target="_blank" rel="noreferrer">Vinicius Lemos</a>
      </footer>
    </div>
  );
}
