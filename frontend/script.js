const inkTypeSelect = document.getElementById('inkType');
const inkColorSelect = document.getElementById('inkColor');
const quantityInput = document.getElementById('quantity');

let warnaList = [];

// 1. Load Ink Types
async function loadInkTypes() {
    try {
        const res = await fetch('http://192.168.179.144:3000/kode');
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
    inkColorSelect.innerHTML = '<option value="">Loading...</option>';

    if (!idKode) {
        inkColorSelect.innerHTML = '<option value="">Select ink type first</option>';
        return;
    }

    try {
        const res = await fetch(`http://192.168.179.144:3000/warna/${idKode}`);
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
        const res = await fetch('http://192.168.179.144:3000/warna', {
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

// Jalankan saat halaman dimuat
window.onload = loadInkTypes;
