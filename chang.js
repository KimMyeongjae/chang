const sheetId = "1l4fgMDc0htCgCqC-OHq5gbP1o9K_-z6NLLQOJfZqSOU";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const date = new Date();
const sheetName = `${date.getFullYear()}년`;
const query = encodeURIComponent("Select *");
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];
document.addEventListener("DOMContentLoaded", init);

const output = document.querySelector(".output");

function init() {
  fetch(url)
    .then((res) => res.text())
    .then((rep) => {
      //Remove additional text and extract only JSON:
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

      const colz = [];
      const tr = document.createElement("tr");
      //Extract column labels

      jsonData.table.cols.forEach((heading, idx) => {
        if (idx === 13) return;
        let column = heading.label;
        colz.push(column);
        const th = document.createElement("th");

        if (column === null || column === undefined || column === "") {
          column = "10000000";
          th.style.backgroundColor = "#40d0f0";
          th.style.color = "#40d0f0";
        }

        th.innerText = column;
        tr.appendChild(th);
      });
      output.appendChild(tr);

      const rmk = jsonData.table.rows[12].c[13].v;
      console.log(rmk);

      //extract row data:
      jsonData.table.rows.forEach((rowData, idx) => {
        if (idx === 11) return;
        const row = {};
        colz.forEach((ele, ind) => {
          row[ele] = rowData.c[ind] != null ? rowData.c[ind].v : "";
          if (row[ele] === null || row[ele] === undefined || row[ele] === 0)
            row[ele] = "";
          if (typeof row[ele] === "number") {
            row[ele] = row[ele].toLocaleString("ko-KR");
          }
        });

        data.push(row);
      });
      processRows(data);

      const h = document.querySelector(".h");
      const r = document.querySelector(".rmk");
      r.innerText = rmk;
      h.innerText = date.getFullYear();
    });

  // document.querySelector("th").innerText = 100000000;
}

function processRows(json) {
  json.forEach((row) => {
    const tr = document.createElement("tr");

    const keys = Object.keys(row);

    keys.forEach((key) => {
      const td = document.createElement("td");
      td.style.border = "5px";
      td.textContent = row[key];
      tr.appendChild(td);
    });
    output.appendChild(tr);
  });
}
