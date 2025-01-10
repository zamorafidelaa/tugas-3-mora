import express from "express";
import pool from "./db.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/barang", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM barang");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/barang", async (req, res) => {
  const { nama_barang, category, harga, stok } = req.body;

  if (!nama_barang || !category || harga === undefined || stok === undefined) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (typeof nama_barang !== "string" || nama_barang.length > 100) {
    return res.status(400).json({
      message: "Nama barang harus berupa teks maksimal 100 karakter.",
    });
  }

  if (
    typeof category !== "string" ||
    category.length > 50 ||
    /\d/.test(category)
  ) {
    return res.status(400).json({
      message: "Kategori harus berupa teks dan tidak boleh mengandung angka.",
    });
  }

  if (isNaN(harga) || parseFloat(harga) <= 0) {
    return res
      .status(400)
      .json({ message: "Harga harus berupa angka positif." });
  }

  if (!Number.isInteger(stok) || stok < 0) {
    return res.status(400).json({
      message: "Stok harus berupa angka bulat dan tidak boleh negatif.",
    });
  }

  try {
    const existingItem = await pool.query(
      "SELECT * FROM barang WHERE nama_barang = $1",
      [nama_barang]
    );
    if (existingItem.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Nama barang sudah ada, gunakan nama yang berbeda." });
    }

    const result = await pool.query(
      "INSERT INTO barang (nama_barang, category, harga, stok) VALUES ($1, $2, $3, $4) RETURNING *",
      [nama_barang, category, harga, stok]
    );
    res.status(201).json({
      message: "Data barang berhasil ditambahkan.",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Kesalahan server.", error: err });
  }
});

app.put("/barang/:id", async (req, res) => {
  const { id } = req.params;
  const { nama_barang, category, harga, stok } = req.body;

  if (!nama_barang || !category || harga === undefined || stok === undefined) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (typeof nama_barang !== "string" || nama_barang.length > 100) {
    return res
      .status(400)
      .json({
        message: "Nama barang harus berupa teks maksimal 100 karakter.",
      });
  }

  if (
    typeof category !== "string" ||
    category.length > 50 ||
    /\d/.test(category)
  ) {
    return res
      .status(400)
      .json({
        message: "Kategori harus berupa teks dan tidak boleh mengandung angka.",
      });
  }

  if (isNaN(harga) || parseFloat(harga) <= 0) {
    return res
      .status(400)
      .json({ message: "Harga harus berupa angka positif." });
  }

  if (!Number.isInteger(stok) || stok < 0) {
    return res
      .status(400)
      .json({
        message: "Stok harus berupa angka bulat dan tidak boleh negatif.",
      });
  }

  try {
    const existingItem = await pool.query(
      "SELECT * FROM barang WHERE nama_barang = $1 AND id != $2",
      [nama_barang, id]
    );

    if (existingItem.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Nama barang sudah ada, gunakan nama yang berbeda." });
    }

    const result = await pool.query(
      "UPDATE barang SET nama_barang = $1, category = $2, harga = $3, stok = $4 WHERE id = $5 RETURNING *",
      [nama_barang, category, harga, stok, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `Barang dengan ID ${id} tidak ditemukan.` });
    }

    res
      .status(200)
      .json({
        message: "Data barang berhasil diperbarui.",
        data: result.rows[0],
      });
  } catch (err) {
    res.status(500).json({ message: "Kesalahan server.", error: err });
  }
});

app.delete("/barang/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM barang WHERE id = $1", [id]);
    res.status(200).send(`Barang dengan ID ${id} berhasil dihapus.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3000, () => {
  console.log("Server Telah Berjalan");
});
