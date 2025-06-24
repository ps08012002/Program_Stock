const inkTypeSelect = document.getElementById('InkTypeUser');
const inkColorSelect = document.getElementById('inkColorUser');
const quantityInput = document.getElementById('quantity');
const userName = document.getElementById('userName');

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

const timefrotma = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Jakarta"
}).format(date);

document.getElementById("dateUser").value = formatDate;
document.getElementById("timeUser").value = timefrotma;
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


console.log(getParameterByName('divisi'));

async function onSubmit() {
  const divisi = getParameterByName("divisi");
  const raw = JSON.stringify({
  "id": inkTypeSelect.value,
  "nama": userName.value,
  "kode_tinta": inkColorSelect.value,
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
  .then((response) => {if(response.ok) alert("Permintaan Akan Segera Diproses")})
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
        warnaList = json.result; // 🛠️ perbaikan di sini!

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

// 3. Update Stock
async function updateStock() {
    const idWarna = inkColorSelect.value;
    const qty = parseInt(quantityInput.value);

    if (!idWarna || isNaN(qty) || qty <= 0) {
        alert('Mohon pilih warna tinta dan isi jumlah yang valid.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/warna', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: parseInt(idWarna), quantity: qty }),
        });

        if (res.ok) {
            alert('Stock berhasil diupdate!');
        } else {
            alert('Gagal mengupdate stock.');
        }
    } catch (err) {
        console.error('Error saat update stock:', err);
    }
}

function sendwhatsapp() {
      const phonenumber = "+62895401473163";

      const name = document.getElementById('userName').value;
      const printer = document.getElementById('printerType').value;
      const inkColor = document.getElementById('inkColor').value;
      const quantity = document.getElementById('quantity').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;

      if (!name || !printer || !inkColor || !quantity || !date || !time) {
        alert("Please fill out all fields before sending.");
        return;
      }

      const url = `https://wa.me/${phonenumber}?text=` +
        `*Name:* ${name}%0a` +
        `*Type:* ${printer}%0a` +
        `*Ink Color:* ${inkColor}%0a` +
        `*Quantity:* ${quantity}%0a` +
        `*Date:* ${date}%0a` +
        `*Time:* ${time}`;

      window.open(url, '_blank').focus();
    }

// Jalankan saat halaman dimuat
window.onload = loadInkTypes;
