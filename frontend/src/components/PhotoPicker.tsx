interface PhotoPickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  previewSrc?: string | null;
}

export default function PhotoPicker({ file, onChange, previewSrc }: PhotoPickerProps) {
  const preview = previewSrc ?? (file ? URL.createObjectURL(file) : null);

  if (preview) {
    return (
      <div className="flex flex-col items-center gap-2">
        <img src={preview} alt="Vorschau" className="w-full max-h-60 object-cover rounded-xl" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-sm text-camp-secondary font-semibold"
        >
          Anderes Foto wählen
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="flex flex-col items-center justify-center gap-1 min-h-32 rounded-xl bg-white/10 cursor-pointer active:scale-[0.98] transition">
        <span className="text-3xl">📷</span>
        <span className="text-sm font-semibold">Kamera</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>
      <label className="flex flex-col items-center justify-center gap-1 min-h-32 rounded-xl bg-white/10 cursor-pointer active:scale-[0.98] transition">
        <span className="text-3xl">🖼️</span>
        <span className="text-sm font-semibold">Galerie</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>
    </div>
  );
}
