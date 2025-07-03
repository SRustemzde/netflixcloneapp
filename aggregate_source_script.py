import os

# --- CONFIGURATION ---
INPUT_FILE_LIST = "proje_dizin_yapisi_find.txt"
# Yeni bir çıktı dosyası adı, daha açıklayıcı olması için
OUTPUT_AGGREGATED_FILE = "aggregated_frontend_source_code.txt"
PROJECT_ROOT_MARKER = "netflix-clone" # Ana proje klasörümüz

# İçeriğini dahil etmek istediğimiz dosya uzantıları
CONTENT_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx',  # JavaScript/TypeScript dosyaları
    '.css', '.scss', '.sass',      # Stil dosyaları
}

# İçeriğini dahil etmek istediğimiz önemli dosya adları (kaynak/konfigürasyon)
IMPORTANT_FILENAMES = {
    'package.json',               # Proje bağımlılıkları ve script'leri
    'index.html',                 # Ana HTML giriş noktası (genellikle public/src altında)
    'manifest.json',              # Web app manifest (PWA için, public/src altında)
    # 'asset-manifest.json',      # Genellikle build klasöründe olur, o yüzden hariç tutulacak.
                                  # Eğer kök dizinde veya src/public içinde varsa diye bırakılabilir ama build'dekini istemiyoruz.
    'vercel.json',                # Vercel dağıtım yapılandırması
    # '.gitignore',               # Analiz için şart değil, çıkarılabilir.
}

# Tamamen hariç tutulacak yolların başlangıç kısımları (proje kökünden itibaren)
# Bu yollar ve içerdikleri tüm dosyalar/klasörler atlanacak.
# ÖNEMLİ: Bu yolların sonuna '/' ekleyin ki doğru klasörleri eşleştirsin.
EXCLUDED_PATH_PREFIXES = [
    f"{PROJECT_ROOT_MARKER}/backend/",
    f"{PROJECT_ROOT_MARKER}/build/",
    # Eğer proje_dizin_yapisi_find.txt içinde node_modules yolları olsaydı:
    # f"{PROJECT_ROOT_MARKER}/node_modules/",
]
# Ayrıca, yolun herhangi bir yerinde "/node_modules/" geçenleri de hariç tutalım.
EXCLUDE_IF_CONTAINS = [
    "/node_modules/",
]
# --- END CONFIGURATION ---

def aggregate_source_frontend_code():
    if not os.path.exists(INPUT_FILE_LIST):
        print(f"Hata: '{INPUT_FILE_LIST}' bulunamadı. Script'i doğru dizinde çalıştırdığınızdan emin olun.")
        return

    aggregated_content = []
    files_processed_content = 0
    files_skipped_excluded_path = 0 # Backend, build, node_modules vb. için genel sayaç
    files_skipped_type = 0
    dirs_skipped_from_list = 0 # Eğer listede açıkça dizin varsa (bu script onları işlemez)
    files_not_found = 0

    print(f"'{INPUT_FILE_LIST}' okunuyor...")

    with open(INPUT_FILE_LIST, 'r', encoding='utf-8') as f_list:
        file_paths = [line.strip() for line in f_list if line.strip()]

    print(f"{len(file_paths)} yol bulundu. Kaynak frontend dosyaları toplanıyor...")

    for file_path in file_paths:
        # Çıktı dosyasını atla
        if file_path == OUTPUT_AGGREGATED_FILE:
            continue

        # Yolları normalleştir (Windows için \ -> /)
        normalized_file_path = file_path.replace("\\", "/")

        # 1. Hariç tutulacak prefix'leri kontrol et
        skip_file = False
        for prefix in EXCLUDED_PATH_PREFIXES:
            if normalized_file_path.startswith(prefix):
                skip_file = True
                break
        
        if skip_file:
            files_skipped_excluded_path += 1
            continue

        # 2. Hariç tutulacak segment'leri (örn: /node_modules/) kontrol et
        for segment in EXCLUDE_IF_CONTAINS:
            if segment in normalized_file_path:
                skip_file = True
                break
        
        if skip_file:
            files_skipped_excluded_path += 1
            continue

        # Dosya sisteminde var mı kontrol et
        if not os.path.exists(file_path):
            files_not_found += 1
            continue # Bulunamayan dosyayı çıktıya ekleme

        # Eğer listedeki path bir dizinse atla (find komutu -type f ile sadece dosya listelemeli)
        if os.path.isdir(file_path):
            dirs_skipped_from_list +=1
            continue

        filename = os.path.basename(normalized_file_path)
        _, ext = os.path.splitext(filename)
        ext_lower = ext.lower()

        # Dosya, içerik uzantılarından birine sahip mi VEYA önemli dosya adlarından biri mi?
        should_include = (ext_lower in CONTENT_EXTENSIONS or
                          filename in IMPORTANT_FILENAMES)

        if should_include:
            aggregated_content.append(f"--- START OF FILE {file_path} ---\n")
            try:
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f_content:
                    aggregated_content.append(f_content.read())
                files_processed_content += 1
            except Exception as e:
                aggregated_content.append(f"[Error reading file: {e}]\n")
            aggregated_content.append(f"\n--- END OF FILE {file_path} ---\n\n")
        else:
            # Bu dosyayı türü/adı uymadığı için atlıyoruz (resimler, .md, .map vb.)
            files_skipped_type += 1

    print("\nToplama tamamlandı. Sonuçlar:")
    print(f"  İçeriği dahil edilen kaynak dosyalar: {files_processed_content}")
    print(f"  Hariç tutulan yollar nedeniyle atlanan dosyalar (backend, build, node_modules vb.): {files_skipped_excluded_path}")
    print(f"  Uzantı/tür nedeniyle (içeriği alınmayan) atlanan dosyalar: {files_skipped_type}")
    if dirs_skipped_from_list > 0:
        print(f"  Atlanan dizinler (giriş listesinden): {dirs_skipped_from_list}")
    print(f"  Bulunamayan dosyalar (giriş listesinden): {files_not_found}")

    if not aggregated_content:
        print("\nUyarı: Belirtilen kriterlere uyan hiçbir dosya bulunamadı veya işlenemedi.")
        print("Lütfen `CONTENT_EXTENSIONS`, `IMPORTANT_FILENAMES` ve `EXCLUDED_PATH_PREFIXES` ayarlarını kontrol edin.")
        return

    with open(OUTPUT_AGGREGATED_FILE, 'w', encoding='utf-8') as f_out:
        f_out.write("".join(aggregated_content))

    print(f"\nFiltrelenmiş kaynak frontend kodu '{OUTPUT_AGGREGATED_FILE}' dosyasına yazıldı.")
    print("Lütfen bu yeni dosyayı bana iletin.")

if __name__ == "__main__":
    aggregate_source_frontend_code()