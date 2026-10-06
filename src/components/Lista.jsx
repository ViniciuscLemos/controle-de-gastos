import { formatarDinheiro } from '../lib/contas';

export default function Lista({ lancamentos, onEditar, onExcluir }) {
  return (
    <ul className="lista">
      {lancamentos.map((l) => (
        <li key={l.id}>
          <span className="data">{l.data.slice(8, 10)}/{l.data.slice(5, 7)}</span>
          <div className="info">
            <strong>{l.descricao}</strong>
            <span className="cinza">{l.categoria}</span>
          </div>
          <span className={l.tipo === 'entrada' ? 'verde' : 'vermelho'}>
            {l.tipo === 'entrada' ? '+' : '-'} {formatarDinheiro(l.valor)}
          </span>
          <div className="botoes">
            <button className="link" onClick={() => onEditar(l)}>editar</button>
            <button className="link perigo" onClick={() => onExcluir(l)}>excluir</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
