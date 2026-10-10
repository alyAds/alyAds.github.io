# Inpit — Digital Invitation Wedding

Inpit is digital invitation wedding.

## Link Undangan

Undangan dapat diakses di:

```
https://alyads.github.io/01/
```

## Cara Menambahkan Nama Tamu

Tambahkan parameter `to` di akhir link, berisi nama orang yang diundang:

```
https://alyads.github.io/01/?to=Nama+Tamu
```

Nama tamu akan tampil di halaman cover undangan dan otomatis terisi pada kolom nama di form RSVP/ucapan.

### Aturan Penulisan

- Pisahkan kata dengan tanda `+` atau `%20` (spasi tidak boleh ditulis langsung di URL).
- Untuk karakter khusus seperti `&`, gunakan `%26`.
- Jika parameter `to` tidak diisi, undangan tetap bisa dibuka tanpa nama tamu.

### Contoh

| Tamu | Link |
|------|------|
| Budi Santoso | `https://alyads.github.io/01/?to=Budi+Santoso` |
| Bapak/Ibu Andi | `https://alyads.github.io/01/?to=Bapak%2FIbu+Andi` |
| Keluarga Besar Siregar | `https://alyads.github.io/01/?to=Keluarga+Besar+Siregar` |
| Dina & Rudi | `https://alyads.github.io/01/?to=Dina+%26+Rudi` |