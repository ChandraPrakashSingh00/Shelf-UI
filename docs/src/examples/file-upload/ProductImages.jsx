import { FileUpload } from "shelf-ui-react";

export default function FileUploadProductImages() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <FileUpload
        label="Product images"
        multiple
        accept="image/png,image/jpeg,image/webp"
        maxSize={5 * 1024 * 1024}
        maxFiles={6}
        helperText="PNG, JPG or WebP, up to 5 MB each. Add up to 6 images; the first is the cover."
      />
    </div>
  );
}
