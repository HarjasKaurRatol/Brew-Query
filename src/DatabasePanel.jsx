import { useEffect, useState } from 'react';
import { inspectDatabase } from './db';
import { getVisibleTables } from './levelData';
import './DatabasePanel.css';

export default function DatabasePanel({ db, open, onClose, refreshToken, phaseId }) {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState(null);

  useEffect(() => {
    if (!db) {
      setTables([]);
      return;
    }
    const info = inspectDatabase(db);
    const visible = getVisibleTables(phaseId);
    const filtered = info.filter((t) => visible.includes(t.name));
    setTables(filtered);
    setActiveTable((prev) =>
      prev && filtered.some((t) => t.name === prev) ? prev : (filtered[0]?.name ?? null)
    );
  }, [db, refreshToken, phaseId]);

  const active = tables.find((t) => t.name === activeTable);

  return (
    <>
      <aside className={`db-panel${open ? ' db-panel--open' : ''}`}>
        <div className="db-panel-header">
          <h3>🗄️ Database</h3>
          <button className="db-panel-close" onClick={onClose} aria-label="Close database panel">
            ✕
          </button>
        </div>

        <div className="db-panel-tabs">
          {tables.map((t) => (
            <button
              key={t.name}
              className={`db-panel-tab${t.name === activeTable ? ' db-panel-tab--active' : ''}`}
              onClick={() => setActiveTable(t.name)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {active && (
          <div className="db-panel-body">
            <p className="db-panel-count">
              {active.rowCount} row{active.rowCount === 1 ? '' : 's'}
            </p>

            <table className="db-panel-schema">
              <thead>
                <tr>
                  <th>column</th>
                  <th>type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {active.columns.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.type}</td>
                    <td>{c.pk ? 'PK' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="db-panel-preview-label">
              {active.rowCount > active.previewRows.length
                ? `Preview (first ${active.previewRows.length} of ${active.rowCount} rows)`
                : 'Preview (all rows)'}
            </p>
            <div className="db-panel-preview-scroll">
              <table className="db-panel-preview">
                <thead>
                  <tr>
                    {active.previewColumns.map((c, i) => (
                      <th key={i}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {active.previewRows.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td key={j}>{val === null ? 'NULL' : String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
