import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [barang, setBarang] = useState([]);
  const [namaBarang, setNamaBarang] = useState("");
  const [category, setCategory] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const response = await axios.get("http://localhost:3000/barang");
      setBarang(response.data);
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/barang/${editId}`, {
          nama_barang: namaBarang,
          category,
          harga: parseFloat(harga),
          stok: parseInt(stok),
        });
        alert("Barang berhasil diperbarui");
      } else {
        await axios.post("http://localhost:3000/barang", {
          nama_barang: namaBarang,
          category,
          harga: parseFloat(harga),
          stok: parseInt(stok),
        });
        alert("Barang berhasil ditambahkan");
      }
      fetchBarang();
      resetForm();
    } catch (error) {
      console.error("Error submitting barang:", error);
    }
  };

  const validateInputs = () => {
    const errors = {};
    if (!category || /\d/.test(category)) {
      errors.category = "Kategori harus berupa teks dan tidak boleh mengandung angka.";
    }
    if (!harga || isNaN(harga) || harga <= 0) {
      errors.harga = "Harga harus berupa angka positif.";
    }
    if (!stok || isNaN(stok) || stok <= 0) {
      errors.stok = "Stok harus berupa angka bulat dan positif.";
    }
    return errors;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://localhost:3000/barang/${id}`);
        alert("Barang berhasil dihapus");
        fetchBarang();
      } catch (error) {
        console.error("Error deleting barang:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNamaBarang(item.nama_barang);
    setCategory(item.category);
    setHarga(item.harga);
    setStok(item.stok);
  };

  const resetForm = () => {
    setEditId(null);
    setNamaBarang("");
    setCategory("");
    setHarga("");
    setStok("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300 flex items-center justify-center font-serif">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-8 border border-pink-200 transition-all hover:scale-105">
        <h1 className="text-5xl font-extrabold text-center text-pink-700 mb-6">Zamora Management</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <input
            className="px-4 py-2 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none bg-pink-50 hover:border-pink-500 transition-all"
            type="text"
            placeholder="Nama Barang"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
          />
          <div className="relative">
            <input
              className={`px-4 py-2 border-2 ${errors.category ? 'border-red-500' : 'border-pink-300'} rounded-lg focus:ring-2 focus:ring-pink-400 outline-none bg-pink-50 hover:border-pink-500 transition-all`}
              type="text"
              placeholder="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            {errors.category && (
              <div className="absolute text-red-500 text-xs mt-1 left-0">{errors.category}</div>
            )}
          </div>
          <div className="relative">
            <input
              className={`px-4 py-2 border-2 ${errors.harga ? 'border-red-500' : 'border-pink-300'} rounded-lg focus:ring-2 focus:ring-pink-400 outline-none bg-pink-50 hover:border-pink-500 transition-all`}
              type="number"
              placeholder="Harga"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              required
            />
            {errors.harga && (
              <div className="absolute text-red-500 text-xs mt-1 left-0">{errors.harga}</div>
            )}
          </div>
          <div className="relative">
            <input
              className={`px-4 py-2 border-2 ${errors.stok ? 'border-red-500' : 'border-pink-300'} rounded-lg focus:ring-2 focus:ring-pink-400 outline-none bg-pink-50 hover:border-pink-500 transition-all`}
              type="number"
              placeholder="Stok"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              required
            />
            {errors.stok && (
              <div className="absolute text-red-500 text-xs mt-1 left-0">{errors.stok}</div>
            )}
          </div>
          <button
            className={`w-full sm:w-auto md:w-full px-6 py-2 rounded-lg shadow-lg transition-all ${
              editId
                ? "bg-yellow-400 hover:bg-yellow-300 text-yellow-900"
                : "bg-pink-500 hover:bg-pink-400 text-white"
            }`}
            type="submit"
          >
            {editId ? "Update Barang" : "Tambah Barang"}
          </button>
        </form>

        <div className="overflow-x-auto rounded-lg shadow-lg border border-pink-200">
          <table className="w-full text-left table-auto border-collapse border border-pink-200 mt-2">
            <thead>
              <tr className="bg-pink-200">
                <th className="px-6 py-3 border border-pink-300">ID</th>
                <th className="px-6 py-3 border border-pink-300">Nama Barang</th>
                <th className="px-6 py-3 border border-pink-300">Kategori</th>
                <th className="px-6 py-3 border border-pink-300">Harga</th>
                <th className="px-6 py-3 border border-pink-300">Stok</th>
                <th className="px-6 py-3 border border-pink-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-pink-50" : "bg-pink-100"
                  } hover:bg-pink-200 transition-all`}
                >
                  <td className="px-6 py-3 border border-pink-300 text-center">{item.id}</td>
                  <td className="px-6 py-3 border border-pink-300">{item.nama_barang}</td>
                  <td className="px-6 py-3 border border-pink-300">{item.category}</td>
                  <td className="px-6 py-3 border border-pink-300">Rp {item.harga.toLocaleString()}</td>
                  <td className="px-6 py-3 border border-pink-300">{item.stok}</td>
                  <td className="px-6 py-3 border border-pink-300 text-center space-x-4">
                    <button
                      className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg shadow hover:bg-yellow-300 transition-all"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-red-300 transition-all"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-8 text-center text-pink-600 text-sm">
          &copy; 2025 Zamora Management
        </footer>
      </div>
    </div>
  );
};

export default App;
