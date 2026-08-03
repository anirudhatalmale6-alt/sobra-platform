import { useRef } from "react";

export interface PendingImage {
  file: File;
  preview: string;
}

interface Props {
  images: PendingImage[];
  onChange: (imgs: PendingImage[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 3 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const room = max - images.length;
    const picked = Array.from(files).slice(0, room);
    const next = picked.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...images, ...next]);
  }

  function remove(i: number) {
    const copy = [...images];
    URL.revokeObjectURL(copy[i].preview);
    copy.splice(i, 1);
    onChange(copy);
  }

  return (
    <div>
      <div className="uploader" onClick={() => inputRef.current?.click()}>
        📷 Clique para adicionar fotografias ({images.length}/{max})
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {images.length > 0 && (
        <div className="previews">
          {images.map((img, i) => (
            <div className="pv" key={i}>
              <img src={img.preview} alt={`preview ${i + 1}`} />
              <button type="button" onClick={() => remove(i)} aria-label="Remover">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
