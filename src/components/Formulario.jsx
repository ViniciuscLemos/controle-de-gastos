import { useState } from 'react';
import { CATEGORIAS, hoje, lerValor } from '../lib/contas';

export default function Formulario({ editando, onSalvar, onCancelar }) {
  const [tipo, setTipo] = useState(editando?.tipo || 'saida');
  const [descricao, setDescricao] = useState(editando?.descricao || '');
  const [valor, setValor] = useState(editando ? (editando.valor / 100).toFixed(2).replace('.', ',') : '');
  const [categoria, setCategoria] = useState(editando?.categoria || CATEGORIAS.saida[0]);
  const [data, setData] = useState(editando?.data || hoje());
  const [erro, setErro] = useState('');

  function trocarTipo(novo) {
    setTipo(novo);
    setCategoria(CATEGORIAS[novo][0]);
  }

  function enviar(e) {
    e.preventDefault();
    const centavos = lerValor(valor);
    if (!descricao.trim()) return setErro('Coloca uma descrição.');
    if (!centavos) return setErro('Valor inválido. Exemplo: 25,90');
    if (!data) return setErro('Escolhe a data.');

    onSalvar({ tipo, descricao: descricao.trim(), valor: centavos, categoria, data });
    setErro('');
    if (!editando) {
      setDescricao('');
      setValor('');
    }
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h2>{editando ? 'Editar lançamento' : 'Novo lançamento'}</h2>

      <div className="tipos">
        <button type="button" className={tipo === 'saida' ? 'ativo saida' : ''} onClick={() => trocarTipo('saida')}>
          Gasto
        </button>
        <button type="button" className={tipo === 'entrada' ? 'ativo entrada' : ''} onClick={() => trocarTipo('entrada')}>
          Entrada
        </button>
      </div>

      <label>
        Descrição
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: mercado" maxLength={60} />
      </label>

      <div className="linha">
        <label>
          Valor (R$)
          <input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" inputMode="decimal" />
        </label>
        <label>
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
      </div>

      <label>
        Categoria
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {CATEGORIAS[tipo].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      {erro && <p className="erro">{erro}</p>}

      <div className="acoes">
        <button type="submit">{editando ? 'Salvar' : 'Adicionar'}</button>
        {editando && <button type="button" className="secundario" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  );
}
