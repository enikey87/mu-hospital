import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Poll() {
  const { poll } = useStore();

  return (
    <div className="glass poll">
      <div className="poll__q"> Опрос: доверяете ли вы методу? </div>
      {poll.voted ? (
        <div className="poll__result">
          Результат: <strong>100% доверяют</strong> по итогам опроса. </div>
      ) : (
        <div className="poll__opts">
          <button className="btn btn-primary btn-sm" onClick={() => poll.vote()}>
            Да
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => poll.vote()}>
            Безусловно
          </button>
        </div>
      )}
      <p style={{ fontSize: 12, color: "var(--muted)" }}> Опрос проводится среди последователей метода с 2002 года. </p>
    </div>
  );
}

export default observer(Poll);
