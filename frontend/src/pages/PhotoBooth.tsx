import { useState, type ChangeEvent, type FormEvent } from "react";
import { api, mediaUrl } from "@/lib/api";
import { Button, Card, PageHeader } from "@/components/ui";

const MAX_TEXT_LENGTH = 80;

export default function PhotoBooth() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ thumbnail_path: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
    setResult(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("photo", file);
      if (caption) data.append("caption", caption);
      const res = await api.post<{ thumbnail_path: string }>("/photobooth", data);
      setResult(res);
      setFile(null);
      setPreview(null);
      setCaption("");
    } catch {
      setError("Upload fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-2">
      <PageHeader title="Fotobox" subtitle="Foto aufnehmen oder hochladen – ganz ohne Anmeldung." />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center gap-2 min-h-40 rounded-xl bg-white/10 cursor-pointer overflow-hidden">
            {preview ? (
              <img src={preview} alt="Vorschau" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">📷</span>
            )}
            <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-camp-neutral">Text (optional, max. {MAX_TEXT_LENGTH} Zeichen)</span>
            <input
              className="min-h-12 rounded-xl bg-white/10 px-4 text-base"
              maxLength={MAX_TEXT_LENGTH}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={!file || loading}>
            {loading ? "Wird gespeichert…" : "Foto speichern"}
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-4 text-center">
          <p className="text-camp-primary font-semibold mb-2">Foto gespeichert! 🎉</p>
          <img src={mediaUrl(result.thumbnail_path)} alt="" className="mx-auto rounded-xl max-h-60" />
        </Card>
      )}
    </div>
  );
}
