import { ARCHIVE_BATCHES } from "../data/company";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Detector() {
  const { detector } = useStore();
  const v = detector.verdict;

  return (
    <section id="detector">
      <div className="container">
        <span className="section-label">Архив продукции</span>
        <h2 className="section-title"> Проверка архивной партии </h2>
        <p className="section-sub"> Сервис проверяет доступные архивные записи. Отсутствие номера в этом архиве не означает, что продукция поддельная. </p>
        <div className="glass detector-wrap">
          <div>
            <div className="detector-form">
              <input
                className="input"
                placeholder="Номер партии, напр. УТ-2002-0417"
                value={detector.batch}
                onChange={(e) => detector.setBatch(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => void detector.check()}
                disabled={v.kind === "checking"}
              >
                {v.kind === "checking" ? <span className="spinner" /> : "Проверить"}
              </button>
            </div>
            <p className="detector-hint"> Формат номера: УТ-ГГГГ-НННН. Доступные записи: {Object.keys(ARCHIVE_BATCHES).join(", ")}. </p>
          </div>

          <div aria-live="polite">
            {v.kind === "idle" && (
              <div className="verdict verdict--idle">
                Сервис готов к работе. Ожидание номера партии.
              </div>
            )}
            {v.kind === "checking" && (
              <div className="verdict verdict--checking">
                <div className="verdict__title"> Проверка записи… </div> Сверка номера и производственных сведений. <div className="progressbar">
                  <div className="progressbar__fill" style={{ width: `${v.progress}%` }} />
                </div>
              </div>
            )}
            {v.kind === "genuine" && (
              <div className="verdict verdict--genuine">
                <div className="verdict__title">Партия внесена в реестр: {v.batch}</div>
                Происхождение: {v.origin}. </div>
            )}
            {v.kind === "fake" && (
              <div className="verdict verdict--fake">
                <div className="verdict__title">Запись в реестре отсутствует: {v.batch}</div> Основание: {v.reason}. Происхождение партии компанией не подтверждено. </div>
            )}
            {v.kind === "error" && (
              <div className="verdict verdict--error">
                <div className="verdict__title">Некорректный ввод</div>
                {v.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(Detector);
