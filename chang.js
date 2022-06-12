document.addEventListener("DOMContentLoaded", init);

const output = document.querySelector(".output");
const combo = document.querySelector(".combo");
const sheetId = "1l4fgMDc0htCgCqC-OHq5gbP1o9K_-z6NLLQOJfZqSOU";
let year = combo.value;
let base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
let sheetName = `${year}년`;
let query = encodeURIComponent("Select *");
let url = `${base}&sheet=${sheetName}&tq=${query}`;
let data = [];

const setUrl = () => {
  data = [];
  year = combo.value;
  sheetName = `${year}년`;
  url = `${base}&sheet=${sheetName}&tq=${query}`;
};

function handleOnChange(e) {
  // 선택된 데이터 가져오기
  output.innerHTML = "";
  init();
}

function init() {
  setUrl();
  fetch(url)
    .then((res) => res.text())
    .then((rep) => {
      //Remove additional text and extract only JSON:
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

      const colz = [];
      const tr = document.createElement("tr");
      //Extract column labels

      jsonData.table.cols.forEach((heading, idx) => {
        if (idx > 12) return;
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

      let rmk = jsonData.table.rows.filter((value, idx) => idx > 11);
      let remark = {};
      remark = rmk.map((r) => r.c[13].v);
      remark = remark.filter((r) => r != "비고");

      rmk = remark.join("\n");

      // jsonData.table.rows[12].c[13].v;

      //extract row data:
      jsonData.table.rows.forEach((rowData, idx) => {
        if (idx == 0 || idx > 10) {
          return;
        }

        const row = {};
        colz.forEach((ele, ind) => {
          row[ele] = rowData.c[ind] != null ? rowData.c[ind].v : "";

          if (row[ele] === null || row[ele] === undefined) row[ele] = "";
          if (row[ele] === 0) {
            row[ele] = "O";
          }
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
    });

  // document.querySelector("th").innerText = 100000000;
}

function processRows(json) {
  json.forEach((row) => {
    const tr = document.createElement("tr");

    const keys = Object.keys(row);

    keys.forEach((key) => {
      const td = document.createElement("td");
      if (row[key] === "O") {
        td.style.textAlign = "center";
      }
      td.style.border = "5px";
      td.textContent = row[key];

      tr.appendChild(td);
    });
    output.appendChild(tr);
  });
}
