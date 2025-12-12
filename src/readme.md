5. Kuis Pilihan Ganda (Latihan)
Mengapa kita perlu melakukan validasi input? 
a. Agar database penuh 
b. Mencegah data sampah atau berbahaya masuk ke sistem 
c. Agar user bingung 
d. Supaya aplikasi berjalan lambat

answer: b. Mencegah data sampah atau berbahaya masuk ke sistem 

Library populer untuk validasi di Express.js adalah... 
a. express-check 
b. express-validator 
c. express-secure 
d. express-guard

answer: b. express-validator

HTTP Status Code yang tepat jika validasi gagal adalah... 
a. 200 OK 
b. 500 Internal Server Error 
c. 400 Bad Request 
d. 404 Not Found

answer: c. 400 Bad Request

Dalam Prisma, relasi One-to-Many didefinisikan dengan... 
a. Array di satu sisi (contoh: Product[]) dan field relation di sisi lain 
b. Array di kedua sisi 
c. Tidak perlu didefinisikan 
d. Menggunakan JSON

answer: a. Array di satu sisi (contoh: Product[]) dan field relation di sisi lain

Apa fungsi include saat melakukan query findMany? 
a. Memfilter data 
b. Mengurutkan data 
c. Mengambil data relasi (join) agar ikut muncul di response 
d. Menghapus data relasi

answer: c. Mengambil data relasi (join) agar ikut muncul di response

Jika Product punya categoryId, maka categoryId disebut sebagai... 
a. Primary Key 
b. Foreign Key 
c. Candidate Key 
d. Super Key

answer: b. Foreign Key

Apa arti @relation(fields: [categoryId], references: [id]) di schema Prisma? 
a. Membuat tabel baru 
b. Menghapus kolom categoryId 
c. Mendefinisikan hubungan Foreign Key antara kolom categoryId di tabel ini dengan id di tabel referensi 
d. Membuat index pencarian

answer: c. Mendefinisikan hubungan Foreign Key antara kolom categoryId di tabel ini dengan id di tabel referensi

Manakah format JSON response error validasi yang baik? 
a. <html>Error</html> 
b. {"message": "Error"} 
c. {"success": false, "errors": [...]} 
d. Kosong saja

answer: c. {"success": false, "errors": [...]}

Kapan validasi sebaiknya dilakukan? 
a. Setelah data masuk database 
b. Sebelum data diproses atau disimpan ke database 
c. Saat user logout 
d. Tidak perlu validasi

answer: b. Sebelum data diproses atau disimpan ke database

Library validasi modern yang sangat Type-safe dan sering dipasangkan dengan TypeScript adalah... 
a. Joi 
b. Zod 
c. Yup 
d. Validator.js

answer: b. Zod

Apa nama file konfigurasi utama untuk setup Prisma yang kustom (seperti mengatur path schema)? 
a. prisma/schema.prisma 
b. prisma.config.ts 
c. src/config/database.js 
d. package.json

answer: a. prisma/schema.prisma

Berdasarkan konfigurasi prisma.config.ts, di mana lokasi file schema model disimpan? 
a. prisma/ 
b. src/models/ 
c. src/prisma/schema/ 
d. database/schema/

answer: c. src/prisma/schema/

File apa yang menjadi entry point definisi schema di prisma.config.ts? 
a. src/prisma/schema/base.prisma 
b. src/prisma/schema.prisma 
c. prisma/schema.prisma 
d. index.ts

answer: b. src/prisma/schema.prisma

Bagaimana cara mendefinisikan fungsi service? 
a. public getAllProducts() {} 
b. static async getAllProducts() {} 
c. export const getAllProducts = async () => {} 
d. function getAllProducts() {} (di dalam class)

answer: c. export const getAllProducts = async () => {}

Di mana lokasi file migrasi disimpan sesuai konfigurasi prisma.config.ts kita? 
a. prisma/migrations 
b. src/prisma/migrations 
c. migrations/ 
d. database/migrations

answer: b. src/prisma/migrations

Jika ingin membuat model baru Transaction, apa yang harus dilakukan? 
a. Edit src/prisma/schema.prisma langsung 
b. Buat file baru src/prisma/schema/Transaction.prisma 
c. Buat file src/models/Transaction.ts 
d. Jalankan query SQL manual

answer: b. Buat file baru src/prisma/schema/Transaction.prisma

Bagaimana cara mengimport semua fungsi dari product.service.ts ke controller? 
a. import ProductService from '../services/product.service' 
b. import { getAll } from '../services/product.service' 
c. import * as productService from '../services/product.service' 
d. require('../services/product.service')

answer: c. import * as productService from '../services/product.service'

Dari mana prisma.config.ts mengambil URL database? 
a. Hardcoded string 
b. File src/config/database.js (yang load .env) 
c. Langsung dari process.env 
d. Dari file package.json

answer: c. Langsung dari process.env

Mengapa kita memecah schema menjadi banyak file (Modular Schema)? 
a. Agar terlihat keren 
b. Agar file schema.prisma tidak terlalu panjang dan lebih mudah di-maintain 
c. Agar Prisma bingung 
d. Karena wajib dari Prisma

answer: b. Agar file schema.prisma tidak terlalu panjang dan lebih mudah di-maintain