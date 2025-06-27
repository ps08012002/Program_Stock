(async () => {
  const tr = document.getElementById('tr_table');

  await fetch("http://localhost:3000/all")
    .then((response) => response.json())
    .then((result) => {
      const inktype = result.inktype;
      console.log(inktype);

      if (inktype) {
        inktype.forEach((value, index) => {
          if (value?.tb_warna?.length !== 0) {
            value.tb_warna.forEach((val, idx) => {
              const row = document.createElement("tr");

              const typeTd = document.createElement("td");
              typeTd.textContent = value.kode_tinta;

              const colorTd = document.createElement("td"); 
              colorTd.textContent = val.warna;

              const quantityTd = document.createElement("td");
              quantityTd.textContent = val.quantity;

              row.appendChild(typeTd);
              row.appendChild(colorTd);
              row.appendChild(quantityTd);

              tr.appendChild(row);
            });
          }
        });
      }
    })
    .catch((error) => console.error(error));
})();
