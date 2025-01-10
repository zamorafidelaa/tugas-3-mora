# Zamora Management API

Zamora Management API adalah aplikasi backend yang digunakan untuk mengelola data barang dalam sistem. Aplikasi ini menyediakan fitur untuk menambah, memperbarui, menghapus, dan membaca data barang. API ini dilengkapi dengan validasi untuk memastikan data yang dimasukkan sesuai dengan ketentuan.

## Fitur

1. **GET /barang**: Mendapatkan daftar semua barang.
2. **POST /barang**: Menambahkan barang baru ke dalam sistem.
3. **PUT /barang/:id**: Memperbarui data barang berdasarkan ID.
4. **DELETE /barang/:id**: Menghapus barang berdasarkan ID.

### Prasyarat

- Node.js
- PostgreSQL (atau database lainnya yang dapat dikoneksikan dengan `pg` library)