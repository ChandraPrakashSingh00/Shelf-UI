import { NumberInput } from "@shelf-ui/react";
import { useState } from "react";

const MINIMUM_ORDER = 12;

export default function NumberInputValidation() {
  const [cartons, setCartons] = useState(6);
  const tooFew = cartons != null && cartons < MINIMUM_ORDER;

  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <NumberInput
        label="Wholesale cartons"
        required
        min={MINIMUM_ORDER}
        max={500}
        clampOnBlur={false}
        value={cartons}
        onValueChange={setCartons}
        error={
          cartons == null
            ? "Enter the number of cartons."
            : tooFew
              ? `Wholesale orders start at ${MINIMUM_ORDER} cartons.`
              : undefined
        }
        helperText="24 units per carton."
      />
    </div>
  );
}
