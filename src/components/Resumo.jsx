import { formatarDinheiro } from '../lib/contas';

export default function Resumo({ entradas, saidas, saldo }) {
  return (
    <div className="resumo">
      <div className="cartao">
        <span>Entradas</span>
        <strong className="verde">{formatarDinheiro(entradas)}</strong>
      </div>
      <div className="cartao">
        <span>Gastos</span>
        <strong className="vermelho">{formatarDinheiro(saidas)}</strong>
      </div>
      <div className="cartao">
        <span>Saldo do mês</span>
        <strong className={saldo < 0 ? 'vermelho' : ''}>{formatarDinheiro(saldo)}</strong>
      </div>
    </div>
  );
}
