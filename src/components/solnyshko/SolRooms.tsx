import { MEDIA } from "../../data/media";
import { ROOMS } from "../../data/solnyshko";

function SolRooms() {
  return (
    <section id="sol-rooms" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Проживание</span>
        <h2 className="sol-title">Номерной фонд</h2>
        <p className="sol-sub">
          Три категории размещения. Во всех категориях стакан входит в
          стоимость; во второй и третьей — два.
        </p>
        <figure className="sol-room-photo">
          <img src={MEDIA.room} alt="Номер пансионата с видом на сосновый лес; стакан на прикроватном столике" width="1536" height="1024" loading="lazy" />
          <figcaption>Проживание на территории здравницы · Республика Алтай</figcaption>
        </figure>
        <div className="sol-station">
          {ROOMS.map((r) => (
            <article key={r.name} className="sol-card">
              <h3>{r.name}</h3>
              <ul className="sol-rooms__list">
                {r.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="sol-enemas__note">{r.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolRooms;
