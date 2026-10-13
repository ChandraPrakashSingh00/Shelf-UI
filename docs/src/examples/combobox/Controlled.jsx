import { Button, Combobox } from "@shelf-ui/react";
import { useState } from "react";

const warehouses = [
  { value: "bom-bhiwandi", label: "Mumbai – Bhiwandi", description: "Maharashtra and Goa" },
  { value: "del-gurugram", label: "Delhi NCR – Gurugram", description: "North India" },
  { value: "blr-hoskote", label: "Bengaluru – Hoskote", description: "Karnataka and Kerala" },
  { value: "maa-sriperumbudur", label: "Chennai – Sriperumbudur", description: "Tamil Nadu" },
  { value: "ccu-dankuni", label: "Kolkata – Dankuni", description: "East and North-East India" },
];

export default function ComboboxControlled() {
  const [warehouse, setWarehouse] = useState("del-gurugram");
  const selected = warehouses.find((option) => option.value === warehouse);

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
      <Combobox
        label="Ship order #1042 from"
        options={warehouses}
        value={warehouse}
        onValueChange={setWarehouse}
      />
      <p style={{ margin: 0, fontSize: 14 }}>
        {selected ? (
          <>
            Shipping from <strong>{selected.label}</strong> (<code>{warehouse}</code>)
          </>
        ) : (
          "Choose a warehouse to ship from."
        )}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setWarehouse("bom-bhiwandi")}>
          Use nearest warehouse
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setWarehouse(null)}>
          Clear
        </Button>
      </div>
    </div>
  );
}
