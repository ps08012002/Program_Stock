const inkTypeSelect = document.getElementById('InkTypeUser');
const inkColorSelect = document.getElementById('inkColorUser');
const quantityInput = document.getElementById('quantity');
const userName = document.getElementById('userName');
let latestReportData = null;

function getParameterByName(name) {
  const url = window.location.search;
  name = name.replace(/[\[\]]/g, "\\$&");

  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2]);
}

const date = new Date()


const formatDate = new Intl.DateTimeFormat("en-GB", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  timeZone: "Asia/Jakarta"
}).format(date);

const timefrotmat = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Jakarta"
}).format(date);

document.getElementById("dateUser").value = formatDate;
document.getElementById("timeUser").value = timefrotmat;
console.log(document.getElementById("dateUser").value);
console.log(formatDate);

userName.addEventListener('change' ,()=>{
    console.log(this.event.target.value);

    userName.value =this.event.target.value
    
})

quantity.addEventListener('change' ,()=>{
    console.log(this.event.target.value);

    quantity.value =this.event.target.value
    
})


//send report adn minus quantity
console.log(getParameterByName('divisi'));
console.log(inkColorSelect.value);


async function onSubmit() {

  const divisi = getParameterByName("divisi");
  const raw = JSON.stringify({
  "id": inkColorSelect.value,
  "nama": userName.value,
  "kode": inkTypeSelect.value,
  "qty": quantity.value,
  "divisi": divisi
});

console.log(raw);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

 const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/minus", requestOptions)
  .then(async(response) => {if(response.ok) alert("Permintaan Akan Di Proses !!!"); const data = await response.json();
      latestReportData = data; sendMessage()})
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  
}


let warnaList = [];

// 1. Load Ink Types
async function loadInkTypes() {
    try {
        const res = await fetch('http://localhost:3000/kode');
        const json = await res.json();
        const inkTypes = json.data;

        inkTypes.forEach(kode => {
            const option = document.createElement('option');
            option.value = kode.id;
            option.textContent = kode.kode_tinta;
            inkTypeSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Gagal mengambil kode tinta:', err);
    }
}

// 2. Ketika Ink Type berubah
inkTypeSelect.addEventListener('change', async function () {
    const idKode = this.value;
    inkTypeSelect.value = this.value
    inkColorSelect.innerHTML = '<option value="">Loading...</option>';

    if (!idKode) {
        inkColorSelect.innerHTML = '<option value="">Select ink type first</option>';
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/warna/${idKode}`);
        const json = await res.json();
        warnaList = json.result; 

        inkColorSelect.innerHTML = '<option value="">Select ink color</option>';
        warnaList.forEach(warna => {
            const option = document.createElement('option');
            option.value = warna.id;
            option.textContent = warna.warna;
            inkColorSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Gagal mengambil warna:', err);
        inkColorSelect.innerHTML = '<option value="">Failed to load</option>';
    }
});

async function getData() {
    const id = parseInt(inkTypeSelect.value)
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

   const response = await fetch(`http://localhost:3000/all/${id}`, requestOptions);
  return await response.json();
}

async function sendMessage(){
   const token = '8125474717:AAH9OH8r1FSloByJcP1Cs0VlmsPZszr4K8U';
  const chat_id = '-1002776606224';
    
      const name = userName.value
      const inkType = latestReportData?.kode_tinta
      const inkColor = latestReportData?.warna
      const jmlh = quantity.value
      const divisi = getParameterByName("divisi");
      const date = document.getElementById("dateUser").value
      const time = document.getElementById("timeUser").value 

      console.log(latestReportData?.kode_tinta);
      
      if (!name || !divisi || !inkType || !inkColor || !jmlh || !date || !time) {
        alert("Please fill out all fields before sending.");
        return;
      }

      const message = 
      
      `Haloo, Ada Permintaan Nih 

      Name: ${name}
      Divisi : ${divisi}
      Ink Type: ${inkType}
      Ink Color: ${inkColor}
      Quantity: ${jmlh}
      Date: ${date}
      Time: ${time}
      `

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: chat_id,
        text: message
      })
    })
    .then(res => res.json())
    // .then(data => {
    //   alert('Pesan terkirim ke Telegram');
    // })
    .catch(err => {
      alert('Gagal mengirim pesan');
      console.error(err);
    });
}
// Jalankan saat halaman dimuat
window.onload = loadInkTypes;
