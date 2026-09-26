import { Input } from "@codecps/ui";

export default function InputBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Input label="Email" type="email" placeholder="you@company.com" />
    </div>
  );
}
