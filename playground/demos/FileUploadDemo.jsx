import { FileUpload } from "@shelf-ui/react";
import { useState } from "react";

export function FileUploadDemo() {
  const [images, setImages] = useState([]);
  return (
    <div className="pg-grid">
      <FileUpload
        label="Product images"
        multiple
        accept="image/png,image/jpeg,image/webp"
        maxSize={5 * 1024 * 1024}
        maxFiles={4}
        value={images}
        onValueChange={setImages}
        helperText={`PNG, JPG or WebP, up to 5 MB each. ${images.length} of 4 added.`}
      />
      <FileUpload
        label="GST certificate"
        accept=".pdf"
        maxSize={10 * 1024 * 1024}
        required
        helperText="PDF, up to 10 MB."
      />
      <FileUpload
        label="Store banner"
        accept="image/*"
        disabled
        helperText="Upgrade to Acme Pro to change the banner."
      />
    </div>
  );
}
