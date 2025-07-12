  let currentPage = 1;
  let totalPages = 1

  async function fetchData(page) {
    try {
      const response = await fetch(`http://localhost:3000/report?page=${currentPage}&per_page=5`);
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function displayData(data) {
    
    const tbody = document.getElementById('tbody');
    const report = data.test;
    totalPages = data.total/5;
    tbody.innerHTML = "";

    console.log(report);
    
    if (report) {
        report.forEach((value, index) => {

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
  }
  
  function nextPage() {
    if (currentPage < totalPages) {
      
      currentPage++;
      fetchData(currentPage);
    }
  }
  
  function prevPage() {
    if (currentPage > 1) {
      
      currentPage--;
      fetchData(currentPage);
    }
  }
  
  fetchData(currentPage);
  