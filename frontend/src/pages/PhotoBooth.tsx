import { useState, type FormEvent } from "react";
import { api, mediaUrl } from "@/lib/api";
import { Button, Card, PageHeader } from "@/components/ui";
import PhotoPicker from "@/components/PhotoPicker";

const MAX_TEXT_LENGTH = 80;

export default function PhotoBooth() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ thumbnail_path: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          <PhotoPicker file={file} onChange={setFile} />

          <label className="flex flex-col gap-1">
            <span className="text-sm text-camp-neutral">Text (optional, max. {MAX_TEXT_LENGTH} Zeichen)</span>
            <input
              className="min-h-12 rounded-xl bg-white/10 px-4 text-base"
              maxLength={MAX_TEXT_LENGTH}
              placeholder="z. B. dein Spruch, Camp-Name oder was gerade passiert…"
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
