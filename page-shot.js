var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname + "/db.sqlite3", err => {
  if (err) {
    console.error(err);
  }
});

sqlite3.verbose();

function run(sql, values) {
  return new Promise(function(resolve, reject) {
    db.run(sql, values, function(err, rows) {
      if (err) {
        reject(err);
      }

      resolve({
        lastInsertedId: this.lastID,
        changes: this.chagnes
      });
    });
  });
}

function query(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, function(err, rows) {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
}

class PageShot {
  static fetch() {
    return query("SELECT * FROM page_shots");
  }

  static create({ url, duration, errors, resources }) {
    return run(
      "INSERT INTO page_shots (url, created_at, duration, errors, resources) VALUES (?, ?, ?, ?, ?)",
      [url, Date.now(), duration, errors, resources]
    );
  }
}

module.exports = PageShot;
