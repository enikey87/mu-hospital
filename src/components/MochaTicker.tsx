import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";
import { MOCHA } from "../data/company";

function drawSparkline(canvas: HTMLCanvasElement, values: number[]): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padX = 2;
  const padY = 6;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const min = Math.min(MOCHA.opening, ...values);
  const max = Math.max(MOCHA.opening, ...values);
  const span = max - min;

  const pointX = (i: number): number =>
    padX + (values.length <= 1 ? plotW / 2 : (i / (values.length - 1)) * plotW);
  const pointY = (value: number): number =>
    span === 0 ? padY + plotH / 2 : padY + plotH - ((value - min) / span) * plotH;

  // Уровень открытия сессии: пунктирная база отсчёта.
  const baseY = pointY(MOCHA.opening);
  ctx.strokeStyle = "rgba(98, 99, 93, 0.45)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(padX, baseY);
  ctx.lineTo(width - padX, baseY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Заливка под кривой.
  ctx.beginPath();
  ctx.moveTo(pointX(0), height - padY);
  values.forEach((value, i) => ctx.lineTo(pointX(i), pointY(value)));
  ctx.lineTo(pointX(values.length - 1), height - padY);
  ctx.closePath();
  ctx.fillStyle = "rgba(199, 53, 34, 0.10)";
  ctx.fill();

  // Кривая курса.
  ctx.beginPath();
  values.forEach((value, i) => {
    const x = pointX(i);
    const y = pointY(value);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#c73522";
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Последняя котировка.
  ctx.beginPath();
  ctx.arc(pointX(values.length - 1), pointY(values[values.length - 1]), 2, 0, Math.PI * 2);
  ctx.fillStyle = "#1b1d1c";
  ctx.fill();
}

function MochaTicker() {
  const { mocha } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => mocha.start(), [mocha]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => drawSparkline(canvas, mocha.history);
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [mocha, mocha.history]);

  return (
    <section className="mocha" aria-label="Котировки $MOCHA">
      <div className="container">
        <div className="glass mocha__row">
          <div className="mocha__head">
            <span className="mocha__sym">{MOCHA.symbol}</span>
            <span className="mocha__stamp">сырьевой индекс</span>
          </div>
          <div className="mocha__quote">
            <span className="mocha__price">{mocha.priceLabel} ₽</span>
            <span
              className={
                mocha.changePercent < 0
                  ? "mocha__chg mocha__chg--down"
                  : "mocha__chg mocha__chg--up"
              }
            >
              {mocha.changeLabel}
            </span>
            <span className="mocha__unit">{MOCHA.unit}</span>
          </div>
          <p className="mocha__note">{mocha.note}</p>
          <div className="mocha__chart">
            <canvas
              ref={canvasRef}
              className="mocha__canvas"
              role="img"
              aria-label={`График индекса $MOCHA за сессию: ${mocha.priceLabel} ₽, ${mocha.changeLabel} к открытию`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(MochaTicker);
