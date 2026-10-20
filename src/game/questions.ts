import { QuizQuestion } from './types';

export const DIGITAL_LITERACY_QUESTIONS: QuizQuestion[] = [
  // --- HOAKS (Informasi Palsu / Misinformasi / Penipuan) ---
  {
    id: 'q1',
    headline: '"Peringatan Darurat! Mulai besok aplikasi chat akan berbayar Rp50.000/bulan jika pesan ini tidak diteruskan ke 20 kontak!"',
    sourceContext: 'Pesan Berantai WhatsApp dengan label "Diteruskan berkali-kali"',
    category: 'HOAKS',
    explanation: 'Pesan berantai berbau ancaman yang meminta diteruskan ke banyak orang adalah modus hoaks klasik (chain message). Layanan resmi tidak pernah mengumumkan kebijakan lewat pesan berantai.',
    tip: 'Waspadai pesan berantai dengan kata kunci "Sebarkan!", "Kemenkes merilis rahasia", atau ancaman akun ditutup.'
  },
  {
    id: 'q2',
    headline: '"Beredar video rekaman suara menteri menjanjikan bantuan tunai langsung Rp10 juta tanpa syarat melalui tautan bit.ly/bansos-cair-2026"',
    sourceContext: 'Unggahan akun anonim di media sosial TikTok dengan tautan mencurigakan',
    category: 'HOAKS',
    explanation: 'Ini adalah hoaks phishing berbasis Deepfake AI audio dan tautan jebakan (phishing). Lembaga pemerintah tidak pernah membagikan bansos lewat shortlink tak resmi.',
    tip: 'Selalu verifikasi link ke domain resmi (.go.id) dan jangan pernah mengisi data pribadi seperti NIK atau OTP.'
  },
  {
    id: 'q3',
    headline: '"Ilmuwan rahasia membuktikan bahwa minum rebusan air cabai dicampur pasta gigi bisa membunuh 100% semua varian virus dalam 5 menit"',
    sourceContext: 'Postingan blog kesehatan tidak berizin dan tangkapan layar tanpa nama dokter',
    category: 'HOAKS',
    explanation: 'Klaim pengobatan ajaib tanpa uji klinis dan tanpa rujukan jurnal medis kredibel merupakan hoaks kesehatan (infodemi) yang berbahaya bagi tubuh.',
    tip: 'Cari informasi kesehatan pada situs terpercaya seperti Kemenkes, WHO, atau konsultasi dokter berizin.'
  },
  {
    id: 'q4',
    headline: '"Selamat! Nomor Anda terpilih undian berhadiah Rp150 juta dari Bank Indonesia, hubungi nomor WhatsApp pribadi ini untuk proses pencairan"',
    sourceContext: 'SMS dari nomor ponsel pribadi (+628xxxx) tanpa identitas resmi pengirim',
    category: 'HOAKS',
    explanation: 'Bank Indonesia adalah bank sentral regulator dan tidak pernah mengadakan undian berhadiah uang tunai untuk nasabah umum apalagi lewat nomor HP pribadi.',
    tip: 'Bank resmi tidak pernah meminta transfer biaya administrasi untuk mengklaim hadiah undian.'
  },
  {
    id: 'q5',
    headline: '"Foto langit di Jakarta memperlihatkan awan berbentuk tulisan tertentu yang diklaim sebagai tanda kiamat besok pagi"',
    sourceContext: 'Foto viral di grup Facebook dengan resolusi pecah dan efek filter kasar',
    category: 'HOAKS',
    explanation: 'Foto tersebut merupakan hasil manipulasi gambar (editing digital) yang disebarkan untuk menimbulkan kepanikan atau sekadar mencari interaksi penonton.',
    tip: 'Gunakan fitur Google Lens atau Reverse Image Search untuk melacak asal foto asli sebelum mempercayainya.'
  },
  {
    id: 'q6',
    headline: '"Bagi yang mengisi kuesioner singkat ini akan otomatis mendapatkan kuota internet 100GB gratis dari semua operator"',
    sourceContext: 'Pesan WhatsApp berisi tautan kuota-gratis-operator-2026.xyz',
    category: 'HOAKS',
    explanation: 'Domain .xyz mencurigakan dan tawaran kuota gratis masif tanpa pengumuman resmi provider adalah penipuan pencurian data (phishing malware).',
    tip: 'Cek promo kuota langsung melalui aplikasi resmi operator seluler di Google Play Store atau App Store.'
  },

  // --- FAKTA (Informasi Berdasarkan Data & Bukti Terverifikasi) ---
  {
    id: 'q7',
    headline: '"Kementerian Kominfo menyediakan portal aduankonten.id untuk masyarakat melaporkan konten negatif, hoaks, dan judi online"',
    sourceContext: 'Siaran Pers Resmi Kementerian Komunikasi dan Digital RI',
    category: 'FAKTA',
    explanation: 'Informasi ini adalah fakta karena portal resmi tersebut benar-benar ada dan disediakan oleh kementerian berwenang untuk menangani aduan publik.',
    tip: 'Fakta memiliki sumber primer resmi, data konkret, dan dapat diuji kebenarannya secara objektif.'
  },
  {
    id: 'q8',
    headline: '"Fitur Otentikasi Dua Faktor (Two-Factor Authentication / 2FA) memberikan lapisan keamanan tambahan selain kata sandi"',
    sourceContext: 'Panduan Keamanan Siber Lembaga Keamanan Siber & Sandi Negara (BSSN)',
    category: 'FAKTA',
    explanation: 'Ini adalah fakta teknologis. 2FA secara ilmiah dan teknis mempersulit peretas karena membutuhkan kode kedua (SMS/OTP/Authenticator) selain password.',
    tip: 'Aktifkan selalu 2FA di akun email, media sosial, dan dompet digital Anda.'
  },
  {
    id: 'q9',
    headline: '"Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) merilis informasi gempa magnitudo 4,8 di barat daya pesisir dengan kedalaman 10 km"',
    sourceContext: 'Aplikasi resmi InfoBMKG dan akun media sosial terverifikasi (@infoBMKG)',
    category: 'FAKTA',
    explanation: 'Data waktu, lokasi koordinat, magnitudo, dan kedalaman dicatat oleh sensor seismograf lembaga resmi dan disampaikan dengan parameter ilmiah.',
    tip: 'Cari informasi bencana hanya dari akun resmi seperti BMKG dan BNPB yang bertanda centang biru.'
  },
  {
    id: 'q10',
    headline: '"Protokol HTTPS pada alamat situs web mengenkripsi komunikasi data antara browser pengguna dan server penyedia layanan"',
    sourceContext: 'Standar Protokol Internet IETF (Internet Engineering Task Force)',
    category: 'FAKTA',
    explanation: 'Secara teknis protokol kriptografi SSL/TLS pada HTTPS membungkus paket data sehingga pihak ketiga di jaringan wifi publik tidak bisa membaca password secara polos.',
    tip: 'Perhatikan ikon gembok pada browser sebelum memasukkan username, password, atau nomor kartu kredit.'
  },
  {
    id: 'q11',
    headline: '"Berdasarkan survei Asosiasi Penyelenggara Jasa Internet Indonesia (APJII), pengguna internet di Indonesia menembus lebih dari 200 juta jiwa"',
    sourceContext: 'Laporan Riset Profil Internet Indonesia APJII yang dipublikasikan secara terbuka',
    category: 'FAKTA',
    explanation: 'Pernyataan ini mengacu pada metodologi riset statistik terpublikasi dengan populasi sampel terukur, sehingga merupakan fakta empiris.',
    tip: 'Fakta statistik biasanya memuat nama lembaga riset, tahun survei, dan metodologi yang transparan.'
  },

  // --- OPINI (Pendapat, Pandangan Subjektif, Preferensi Pribadi) ---
  {
    id: 'q12',
    headline: '"Menonton video pendek di media sosial adalah aktivitas paling membuang-buang waktu yang pernah diciptakan manusia"',
    sourceContext: 'Cuitan pribadi seorang warganet di linimasa media sosial X',
    category: 'OPINI',
    explanation: 'Kata "paling membuang-buang waktu" adalah penilaian subjektif (opini). Ada orang yang menganggapnya hiburan atau sarana belajar konten edukasi singkat.',
    tip: 'Opini sering menggunakan kata sifat bernada subjektif seperti: paling bagus, buruk, sebaiknya, seharusnya.'
  },
  {
    id: 'q13',
    headline: '"Smartphone dengan sistem operasi A memiliki antarmuka yang jauh lebih nyaman dan elegan dibanding sistem operasi B"',
    sourceContext: 'Ulasan / Review seorang influencer teknologi di kanal YouTube pribadinya',
    category: 'OPINI',
    explanation: 'Kenyamanan antarmuka (UI/UX) dan keindahan desain adalah preferensi personal yang berbeda-beda bagi setiap pengguna smartphone.',
    tip: 'Review produk merupakan kombinasi antara spesifikasi (fakta teknis) dan kesan penggunaan (opini reviewer).'
  },
  {
    id: 'q14',
    headline: '"Semua pelajar sebaiknya dilarang membawa gawai ke sekolah agar nilai akademik mereka otomatis meningkat pesat"',
    sourceContext: 'Artikel kolom surat pembaca opini di koran mingguan',
    category: 'OPINI',
    explanation: 'Pernyataan ini berisi saran subjektif ("sebaiknya dilarang") dan asumsi sebab-akibat ("otomatis meningkat pesat") yang belum tentu berlaku bagi semua sekolah.',
    tip: 'Opini adalah pandangan yang dapat diperdebatkan dan belum tentu berlaku mutlak untuk semua orang.'
  },
  {
    id: 'q15',
    headline: '"Kecerdasan Buatan (AI) akan membuat manusia menjadi malas berpikir dan kehilangan kemampuan menulis indah"',
    sourceContext: 'Opini editorial penulis esai sastra di sebuah majalah budaya',
    category: 'OPINI',
    explanation: 'Ini adalah kekhawatiran dan prediksi subjektif dari sang penulis esai, bukan fakta mutlak karena dampak AI sangat dipengaruhi cara pengguna memanfaatkannya.',
    tip: 'Prediksi masa depan dan penilaian kualitatif ("malas berpikir", "kehilangan rasa") tergolong opini.'
  },
  {
    id: 'q16',
    headline: '"Game petualangan retro 2D jauh lebih seru dimainkan daripada game 3D modern dengan grafis fotorealistis"',
    sourceContext: 'Pernyataan seorang gamer di forum komunitas diskusi game online',
    category: 'OPINI',
    explanation: 'Kesenangan atau rasa seru saat bermain game adalah pengalaman emosional subjektif yang berbeda untuk setiap pemain.',
    tip: 'Rasa "enak", "seru", "keren", atau "indah" adalah tolok ukur opini perasaan individu.'
  }
];

export function getRandomQuizQuestion(excludeIds: string[] = []): QuizQuestion {
  const pool = DIGITAL_LITERACY_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  if (pool.length === 0) {
    return DIGITAL_LITERACY_QUESTIONS[Math.floor(Math.random() * DIGITAL_LITERACY_QUESTIONS.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
