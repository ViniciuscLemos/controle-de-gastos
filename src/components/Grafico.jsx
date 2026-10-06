import { formatarDinheiro, gastosPorCategoria } from '../lib/contas';

export default function Grafico({ lancamentos }) {
  const categorias = gastosPorCategoria(lancamentos);
  if (categorias.length === 0) return null;

  const total = categorias.reduce((soma, c) => soma + c.valor, 0);
  const maior = categorias[0].valor;

  return (
    <section className="cartao">
      <h2>Para onde foi o dinheiro</h2>
      <ul className="grafico">
        {categorias.map((c) => (
          <li key={c.categoria}>
            <div className="grafico-texto">
              <span>{c.categoria}</span>
              <span className="cinza">
                {formatarDinheiro(c.valor)} · {Math.round((c.valor / total) * 100)}%
              </span>
            </div>
            {/* a barra é proporcional à maior categoria, não ao total, pra ficar mais fácil de comparar */}
            <div className="barra">
              <div style={{ width: `${(c.valor / maior) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
