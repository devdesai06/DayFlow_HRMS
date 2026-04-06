import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Button } from "../../components/ui/Button.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { getCloudinarySignature } from "./employeeApi.js";

export function AvatarUpload({ value, onChange, name }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => value?.url || "", [value]);

  async function upload(file) {
    setBusy(true);
    try {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image.");
        return;
      }
      if (file.size > 3_000_000) {
        toast.error("Max 3MB image size.");
        return;
      }

      const publicId = `emp_${nanoid(12)}`;
      const sig = await getCloudinarySignature(publicId);
      const { cloudName, apiKey, folder, timestamp, signature } = sig.data;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("public_id", publicId);
      form.append("folder", folder);

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await fetch(url, { method: "POST", body: form });
      const j = await res.json();
      if (!res.ok) {
        throw new Error(j?.error?.message || "Upload failed");
      }

      onChange?.({ url: j.secure_url, publicId: j.public_id });
      toast.success("Avatar uploaded.");
    } catch (e) {
      toast.error(e?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar src={preview} name={name} className="h-12 w-12 rounded-2xl" />
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="subtle"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading..." : "Upload"}
        </Button>
        {value?.url ? (
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => onChange?.(null)}
          >
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

