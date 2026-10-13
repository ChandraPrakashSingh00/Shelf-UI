import { Kbd } from "@shelf-ui/react";

export default function KbdSizes() {
  return (
    <>
      <Kbd size="sm" keys={["Ctrl", "P"]} />
      <Kbd size="md" keys={["Ctrl", "P"]} />
    </>
  );
}
