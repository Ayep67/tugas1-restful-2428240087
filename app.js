const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// DATA LIVESTOCK
let livestock = [
    {
        id: 1,
        nama: "Sapi Limousin",
        jenis: "sapi",
        umur: 3,
        berat: 450,
        sehat: true
    },
    {
        id: 2,
        nama: "Kambing Etawa",
        jenis: "kambing",
        umur: 2,
        berat: 55,
        sehat: true
    },
    {
        id: 3,
        nama: "Ayam Broiler",
        jenis: "ayam",
        umur: 1,
        berat: 2,
        sehat: false
    }
];

// ID berikutnya
let nextId = 4;


// GET /livestock
app.get("/livestock", (req, res) => {
    const { jenis } = req.query;

    if (jenis) {
        const result = livestock.filter(
            item => item.jenis.toLowerCase() === jenis.toLowerCase()
        );

        return res.json(result);
    }

    res.json(livestock);
});


// GET /livestock/:id
app.get("/livestock/:id", (req, res) => {
    const id = Number(req.params.id);

    const data = livestock.find(item => item.id === id);

    if (!data) {
        return res.status(404).json({
            status: "error",
            message: `Data livestock dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    res.json(data);
});


// POST /livestock
app.post("/livestock", (req, res) => {
    const { nama, jenis, umur, berat, sehat } = req.body;

    // Validasi field wajib
    if (
        !nama ||
        !jenis ||
        umur === undefined ||
        berat === undefined ||
        sehat === undefined
    ) {
        return res.status(400).json({
            status: "error",
            message: "Semua field wajib diisi",
            data: null
        });
    }

    // Validasi tipe sehat
    if (typeof sehat !== "boolean") {
        return res.status(400).json({
            status: "error",
            message: "Field sehat harus bernilai true atau false",
            data: null
        });
    }

    const newLivestock = {
        id: nextId++,nama,jenis,umur,berat,sehat
    };

    livestock.push(newLivestock);

    res.status(201).json({
        status: "success",
        message: "Data livestock berhasil ditambahkan",
        data: newLivestock
    });
});

// PUT /livestock/:id
app.put("/livestock/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = livestock.findIndex(item => item.id === id);

    // Validasi data tidak ditemukan
    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data livestock dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    const { nama, jenis, umur, berat, sehat } = req.body;

    // PUT wajib mengisi seluruh field
    if (
        !nama ||
        !jenis ||
        umur === undefined ||
        berat === undefined ||
        sehat === undefined
    ) {
        return res.status(400).json({
            status: "error",
            message: "Semua field wajib diisi untuk PUT",
            data: null
        });
    }

    // Validasi sehat
    if (typeof sehat !== "boolean") {
        return res.status(400).json({
            status: "error",
            message: "Field sehat harus bernilai true atau false",
            data: null
        });
    }

    // Ganti seluruh data kecuali id
    livestock[index] = {
        id: id,nama,jenis,umur,berat,sehat
    };

    res.json({
        status: "success",
        message: `Data livestock dengan id ${id} berhasil diperbarui`,
        data: livestock[index]
    });
});


// DELETE /livestock
app.delete("/livestock/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = livestock.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data livestock dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    livestock.splice(index, 1);

    res.json({
        status: "success",
        message: `Data livestock dengan id ${id} berhasil dihapus`,
        data: null
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan",
        data: null
    });
});

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

// Export untuk Vercel
module.exports = app;