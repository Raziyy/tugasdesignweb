// Project
class Project {
    constructor(judul, deskripsi, tahun, sampul) {
        this.judul = judul;
        this.deskripsi = deskripsi;
        this.tahun = tahun;
        this.sampul = sampul;
    }

    tampilkanInfo() {
        return `${this.judul} - ${this.deskripsi} (${this.tahun})`;
    }
}

let daftarProject = [];
let projectFavorit = [];

// Mengambil elemen DOM
const formTambahProject = document.getElementById('form-tambah-project');
const divDaftarProject = document.getElementById('daftar-proyek');
const divProjectFavorit = document.getElementById('proyek-favorit');

// Event Listener untuk Form Tambah Project
formTambahProject.addEventListener('submit', function (e) {
    e.preventDefault();
    tambahProject();
});

// Fungsi untuk menambahkan project ke daftar
function tambahProject() {
    const judul = document.getElementById('judul').value;
    const deskripsi = document.getElementById('deskripsi').value;
    const tahun = new Date().getFullYear();
    const sampul = document.getElementById('sampul').files[0];

    if (judul === '' || deskripsi === '' || !sampul) {
        alert('Semua kolom harus diisi dan gambar sampul harus diunggah!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const projectBaru = new Project(judul, deskripsi, tahun, e.target.result);
        daftarProject.push(projectBaru);
        simpanDaftarProject();
        tampilkanDaftarProject();
        formTambahProject.reset();
    };
    reader.readAsDataURL(sampul);
}

// Fungsi untuk menyimpan daftar project ke Local Storage
function simpanDaftarProject() {
    localStorage.setItem('daftarProject', JSON.stringify(daftarProject));
}

// Fungsi untuk menampilkan daftar project
function tampilkanDaftarProject() {
    divDaftarProject.innerHTML = '';

    daftarProject.forEach((project, index) => {
        const divProject = document.createElement('div');
        divProject.classList.add('project');
        divProject.innerHTML = `
            <img src="${project.sampul}" alt="Sampul Project" />
            <p>${project.tampilkanInfo()}</p>
            <button onclick="tambahKeFavorit(${index})">Tambah ke Favorit</button>
            <button onclick="hapusProject(${index})">Hapus</button>
        `;
        divDaftarProject.appendChild(divProject);
    });
}

// Fungsi untuk menambahkan project ke favorit
function tambahKeFavorit(index) {
    const project = daftarProject[index];

    const sudahAda = projectFavorit.some(favProject => {
        return favProject.judul === project.judul &&
               favProject.deskripsi === project.deskripsi &&
               favProject.tahun === project.tahun;
    });

    if (sudahAda) {
        alert('Project ini sudah ada di daftar favorit!');
        return;
    }

    projectFavorit.push(project);
    simpanProjectFavorit();
    tampilkanProjectFavorit();
}

// Fungsi untuk menyimpan project favorit ke Local Storage
function simpanProjectFavorit() {
    localStorage.setItem('projectFavorit', JSON.stringify(projectFavorit));
}

// Fungsi untuk menampilkan project favorit
function tampilkanProjectFavorit() {
    divProjectFavorit.innerHTML = '';

    projectFavorit.forEach((project, index) => {
        const divProject = document.createElement('div');
        divProject.classList.add('project');
        divProject.innerHTML = `
            <img src="${project.sampul}" alt="Sampul Project" />
            <p>${project.tampilkanInfo()}</p>
            <button onclick="hapusProjectFavorit(${index})">Hapus</button>
        `;
        divProjectFavorit.appendChild(divProject);
    });
}

// Fungsi untuk mencari project
function cariProject() {
    const input = document.getElementById('search').value.toLowerCase();
    const filteredProject = daftarProject.filter(project => {
        return project.judul.toLowerCase().includes(input) || 
               project.deskripsi.toLowerCase().includes(input);
    });
    
    divDaftarProject.innerHTML = '';

    filteredProject.forEach((project, index) => {
        const divProject = document.createElement('div');
        divProject.classList.add('project');
        divProject.innerHTML = `
            <img src="${project.sampul}" alt="Sampul Project" />
            <p>${project.tampilkanInfo()}</p>
            <button onclick="tambahKeFavorit(${index})">Tambah ke Favorit</button>
            <button onclick="hapusProject(${index})">Hapus</button>
        `;
        divDaftarProject.appendChild(divProject);
    });
}

// Fungsi untuk menghapus project dari daftar umum
function hapusProject(index) {
    daftarProject.splice(index, 1);
    simpanDaftarProject();
    tampilkanDaftarProject();
}

// Fungsi untuk menghapus project dari daftar favorit
function hapusProjectFavorit(index) {
    projectFavorit.splice(index, 1);
    simpanProjectFavorit();
    tampilkanProjectFavorit();
}

// Inisialisasi data saat halaman dimuat
window.onload = function () {
    const daftarProjectData = JSON.parse(localStorage.getItem('daftarProject')) || [];
    const projectFavoritData = JSON.parse(localStorage.getItem('projectFavorit')) || [];
    daftarProject = daftarProjectData.map(project => new Project(project.judul, project.deskripsi, project.tahun, project.sampul));
    projectFavorit = projectFavoritData;
    tampilkanDaftarProject();
    tampilkanProjectFavorit();
};

// Hilangkan kelas .active dari semua tautan terlebih dahulu
document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
});

// Aktifkan hanya tautan yang cocok dengan URL saat ini
document.querySelectorAll('nav a').forEach(link => {
    if (link.href.endsWith(window.location.pathname)) {
        link.classList.add('active');
    }
});

// Seleksi elemen menu toggle dan nav
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Event listener untuk menu toggle
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active'); // Tambahkan atau hapus kelas 'active' pada nav
});
