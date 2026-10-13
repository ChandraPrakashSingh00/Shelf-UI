import { Button, Radio, RadioGroup } from "@shelf-ui/react";
import { useState } from "react";

const frameworks = [
  { value: "react", label: "React (Vite)" },
  { value: "next", label: "Next.js" },
  { value: "astro", label: "Astro" },
];

export default function RadioGroupValidation() {
  const [framework, setFramework] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const selected = frameworks.find((option) => option.value === framework);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 16, justifyItems: "start" }}
    >
      <RadioGroup
        label="Framework"
        description="We'll set up the build command for you."
        required
        value={framework}
        onValueChange={setFramework}
        error={submitted && !selected ? "Choose a framework to continue." : undefined}
      >
        {frameworks.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
      <Button type="submit">Create project</Button>
      {submitted && selected && (
        <p style={{ margin: 0 }}>Creating your {selected.label} project…</p>
      )}
    </form>
  );
}
