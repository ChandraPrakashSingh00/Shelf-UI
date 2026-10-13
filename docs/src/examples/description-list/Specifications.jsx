import { DescriptionList } from "@shelf-ui/react";

const specifications = [
  { term: "Brand", description: "Sonic Wave" },
  { term: "Model", description: "SW-141 wireless earbuds" },
  { term: "Colour", description: "Midnight black" },
  { term: "Battery life", description: "Up to 42 hours with the case" },
  { term: "Charging", description: "USB Type-C, 10 min for 2 hours of play" },
  { term: "Bluetooth", description: "5.3" },
  { term: "Water resistance", description: "IPX4 (sweat and splash)" },
  { term: "Weight", description: "42 g" },
  { term: "Warranty", description: "1 year manufacturer warranty" },
  { term: "Country of origin", description: "India" },
];

export default function DescriptionListSpecifications() {
  return <DescriptionList items={specifications} columns={2} divided style={{ maxWidth: 880 }} />;
}
