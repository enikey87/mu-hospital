import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function CookiesBanner() {
  const { cookies } = useStore();

  if (cookies.accepted) return null;

  return (
    <div className="cookie-banner">
      <strong style={{ fontSize: 14 }}> Настройка уведомления </strong>
      <p> Сайт сохраняет отметку о закрытии этого уведомления на вашем устройстве. </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" onClick={() => cookies.accept()}> Понятно </button>
      </div>
    </div>
  );
}

export default observer(CookiesBanner);
