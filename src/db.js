import initSqlJs from 'sql.js';

// The wasm module itself is expensive to load, so it's cached once. The
// Database it builds is NOT cached — each challenge gets its own fresh
// instance (see createFreshDb) so that mutations (UPDATE/DELETE) made while
// solving one challenge never leak into another.
let sqlModule = null;

async function loadSqlModule() {
  if (sqlModule) return sqlModule;
  sqlModule = await initSqlJs({
    locateFile: (file) => `${import.meta.env.BASE_URL}${file}`, // finds sql-wasm.wasm in public/
  });
  return sqlModule;
}

export async function createFreshDb() {
  const SQL = await loadSqlModule();
  const db = new SQL.Database();

  // ============================================================
  // PHASE 1: Coffee Basics — single flat table
  // SELECT / WHERE / ORDER BY / LIMIT / basic aggregates
  // ============================================================
  db.run(`
    CREATE TABLE orders_basic (
      id INTEGER PRIMARY KEY,
      customer TEXT,
      item TEXT,
      total REAL,
      order_date TEXT
    );
  `);

  db.run(`
    INSERT INTO orders_basic (customer, item, total, order_date) VALUES
      ('Alice', 'Latte', 4.50, '2026-06-01'),
      ('Bob', 'Espresso Beans (1kg)', 18.00, '2026-06-01'),
      ('Carla', 'Cold Brew', 5.25, '2026-06-02'),
      ('Dev', 'Gift Card', 25.00, '2026-06-03'),
      ('Elena', 'Muffin', 3.00, '2026-06-03'),
      ('Alice', 'Cappuccino', 4.75, '2026-06-04'),
      ('Frank', 'Mocha', 5.00, '2026-06-04'),
      ('Bob', 'Croissant', 3.25, '2026-06-05');
  `);

  // ============================================================
  // PHASE 2+: Normalized relational schema
  // ============================================================

  db.run(`
    CREATE TABLE customers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      signup_date TEXT,
      membership_tier TEXT DEFAULT 'bronze',
      loyalty_points INTEGER DEFAULT 0
    );
  `);

  db.run(`
    INSERT INTO customers (name, email, signup_date, membership_tier, loyalty_points) VALUES
      ('Alice', 'alice@example.com', '2025-01-10', 'gold', 320),
      ('Bob', 'bob@example.com', '2025-03-22', 'silver', 140),
      ('Carla', 'carla@example.com', '2025-05-02', 'bronze', 40),
      ('Dev', 'dev@example.com', '2025-07-15', 'gold', 500),
      ('Elena', 'elena@example.com', '2025-09-01', 'bronze', 20),
      ('Frank', NULL, '2026-02-11', 'silver', 90);
  `);

  db.run(`
    CREATE TABLE menu_items (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      price REAL NOT NULL,
      calories INTEGER
    );
  `);

  db.run(`
    INSERT INTO menu_items (name, category, price, calories) VALUES
      ('Latte', 'coffee', 4.50, 190),
      ('Espresso', 'coffee', 3.00, 5),
      ('Cold Brew', 'coffee', 5.25, 5),
      ('Cappuccino', 'coffee', 4.75, 120),
      ('Mocha', 'coffee', 5.00, 290),
      ('Muffin', 'bakery', 3.00, 420),
      ('Croissant', 'bakery', 3.25, 270),
      ('Espresso Beans (1kg)', 'retail', 18.00, NULL),
      ('Gift Card', 'retail', 25.00, NULL),
      ('Caramel Latte', 'coffee', 5.50, 210),
      ('Green Tea', 'tea', 3.50, 0),
      ('Chai Latte', 'tea', 4.75, 180),
      ('Earl Grey', 'tea', 3.75, 0);
  `);

  db.run(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      order_date TEXT NOT NULL,
      status TEXT DEFAULT 'completed'
    );
  `);

  db.run(`
    INSERT INTO orders (customer_id, order_date, status) VALUES
      (1, '2026-06-01', 'completed'),
      (2, '2026-06-01', 'completed'),
      (3, '2026-06-02', 'completed'),
      (4, '2026-06-03', 'completed'),
      (5, '2026-06-03', 'cancelled'),
      (1, '2026-06-04', 'completed'),
      (6, '2026-06-04', 'completed'),
      (2, '2026-06-05', 'pending');
  `);

  db.run(`
    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      menu_item_id INTEGER REFERENCES menu_items(id),
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL
    );
  `);

  db.run(`
    INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
      (1, 1, 1, 4.50),
      (2, 8, 1, 18.00),
      (3, 3, 1, 5.25),
      (4, 9, 1, 25.00),
      (5, 6, 1, 3.00),
      (6, 4, 1, 4.75),
      (7, 5, 1, 5.00),
      (8, 7, 1, 3.25);
  `);

  // ============================================================
  // PHASE 5: self-referencing table — self-joins & recursive CTEs
  // ============================================================
  db.run(`
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      manager_id INTEGER REFERENCES employees(id),
      hire_date TEXT,
      salary REAL
    );
  `);

  db.run(`
    INSERT INTO employees (name, role, manager_id, hire_date, salary) VALUES
      ('Coco', 'Owner', NULL, '2023-01-01', 90000),
      ('Kiki', 'Shift Lead', 1, '2023-06-01', 55000),
      ('Mimi', 'Barista', 2, '2026-01-15', 38000);
  `);

  // ============================================================
  // PHASE 4: leaderboard data — window functions, RANK, LAG/LEAD
  // ============================================================
  db.run(`
    CREATE TABLE game_sessions (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      game_name TEXT,
      score INTEGER,
      played_at TEXT
    );
  `);

  db.run(`
    INSERT INTO game_sessions (customer_id, game_name, score, played_at) VALUES
      (1, 'Pixel Runner', 1200, '2026-06-01'),
      (2, 'Pixel Runner', 950, '2026-06-01'),
      (1, 'Pixel Runner', 1400, '2026-06-04'),
      (3, 'Bean Blitz', 800, '2026-06-02'),
      (4, 'Bean Blitz', 1100, '2026-06-03'),
      (6, 'Pixel Runner', 700, '2026-06-04');
  `);

  // ============================================================
  // Bonus: nullable comment field for IS NULL / COALESCE practice
  // ============================================================
  db.run(`
    CREATE TABLE reviews (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      order_id INTEGER REFERENCES orders(id),
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      review_date TEXT
    );
  `);

  db.run(`
    INSERT INTO reviews (customer_id, order_id, rating, comment, review_date) VALUES
      (1, 1, 5, 'Best latte in town!', '2026-06-02'),
      (2, 2, 4, NULL, '2026-06-02'),
      (4, 4, 5, 'Great gift idea', '2026-06-04'),
      (6, 7, 3, NULL, '2026-06-05');
  `);

  return db;
}

export function runQuery(db, sql) {
  try {
    const result = db.exec(sql);
    if (result.length === 0) return { columns: [], rows: [], error: null };
    const { columns, values } = result[0];
    return { columns, rows: values, error: null };
  } catch (err) {
    return { columns: [], rows: [], error: err.message };
  }
}

const PREVIEW_ROW_LIMIT = 10;

// Table names below come from sqlite_master, not user input, so it's safe
// to interpolate them directly into the PRAGMA/SELECT statements.
export function inspectDatabase(db) {
  const tables = runQuery(db, "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;");
  if (tables.error) return [];

  return tables.rows.map(([name]) => {
    const schema = runQuery(db, `PRAGMA table_info(${name});`);
    const columns = schema.error
      ? []
      : schema.rows.map(([, colName, type, , , pk]) => ({ name: colName, type, pk: pk > 0 }));

    const count = runQuery(db, `SELECT COUNT(*) FROM ${name};`);
    const rowCount = count.error ? null : count.rows[0][0];

    const preview = runQuery(db, `SELECT * FROM ${name} LIMIT ${PREVIEW_ROW_LIMIT};`);

    return {
      name,
      columns,
      rowCount,
      previewColumns: preview.error ? [] : preview.columns,
      previewRows: preview.error ? [] : preview.rows,
    };
  });
}