  let currentPage = 1;
  let totalPages = 1

  async function fetchData(page) {
    try {
      const response = await fetch(`http://localhost:3000/all?page=${currentPage}&per_page=1`);
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function displayData(data) {
    
    const tr = document.getElementById('tr_table');
    totalPages = data.total;
    tr.innerHTML = "";

    const inktype = data.inktype; 
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
  