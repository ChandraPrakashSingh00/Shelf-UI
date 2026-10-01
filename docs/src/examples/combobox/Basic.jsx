import { Combobox } from "@codecps/ui";

const cities = [
  "Ahmedabad",
  "Bengaluru",
  "Bhopal",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Delhi",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Nagpur",
  "Navi Mumbai",
  "Pune",
  "Surat",
  "Thiruvananthapuram",
];

export default function ComboboxBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Combobox
        label="Delivery city"
        placeholder="Search cities"
        options={cities}
        helperText="Free delivery on orders above ₹499."
      />
    </div>
  );
}
