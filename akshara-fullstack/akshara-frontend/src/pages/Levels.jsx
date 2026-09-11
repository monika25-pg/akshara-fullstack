import { useAuth } from "../context/AuthContext";
import { LEVELS } from "../data/levels";

export default function Levels() {
  const { learner } = useAuth();

  return (
    <div className="wrap">
      <div className="sec-head">
        <span className="sec-eyebrow">07 · Proficiency framework</span>
        <h2>Four proficiency levels</h2>
        <p>
          The shared scale used across registration, placement, content tagging and
          recommendations. It also matches the <code>proficiency_level</code> field on the
          backend's <code>Learner</code> model.
        </p>
      </div>
      <div>
        {LEVELS.map((lv) => (
          <div
            key={lv.id}
            className={"level-row" + (learner && learner.proficiency_level === lv.id ? " active-lv" : "")}
          >
            <div className="level-num">0{lv.id}</div>
            <div className="level-body">
              <h3>{lv.name}</h3>
              <p>{lv.desc}</p>
              <div className="skill-tags">
                {lv.skills.map((s) => (
                  <span className="skill-tag" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
