import { DatePicker } from "@codecps/ui";

export default function DatePickerBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <DatePicker label="Delivery date" helperText="We deliver Monday to Saturday, 9 AM – 9 PM." />
    </div>
  );
}
