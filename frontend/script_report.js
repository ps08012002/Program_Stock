(async () => {

    const tbody = document.getElementById('tbody');

 await fetch("http://localhost:3000/report")
  .then((response) => response.json())
  .then((result) => {
    console.log(result.test);
    
    if (result.test) {
        result.test.forEach((value, index) => {

            const tanggal = new Date(value.date * 1000)

            const row = document.createElement("tr");

            const noTd = document.createElement("td");
            noTd.textContent = index+1;
            const namaTd = document.createElement("td");
            namaTd.textContent = value.nama;
            const kodeTd = document.createElement("td");
            kodeTd.textContent = value.kode_tinta;
            const warnaTd = document.createElement("td");
            warnaTd.textContent = value.warna;
            const divisiTd = document.createElement("td");
            divisiTd.textContent = value.divisi;
            const reqTd = document.createElement("td");
            reqTd.textContent = value.request;
            const sisaTd = document.createElement("td");
            sisaTd.textContent = value.sisa;
            const dateTd = document.createElement("td");
            dateTd.textContent =  `${tanggal.getDate()}/${tanggal.getMonth()}/${tanggal.getFullYear()}`

            row.appendChild(noTd);
            row.appendChild(namaTd);
            row.appendChild(divisiTd);
            row.appendChild(kodeTd);
            row.appendChild(warnaTd);
            row.appendChild(reqTd);
            row.appendChild(dateTd);

            tbody.appendChild(row);
        })
    }
  })
  .catch((error) => console.error(error));
            // "id": 1,
            // "nama": "Putra Sangaji",
            // "kode_tinta": "001",
            // "warna": "Cyan",
            // "divisi": "IT",
            // "request": 1,
            // "sisa": 9,
            // "date": 1751029864
})();
