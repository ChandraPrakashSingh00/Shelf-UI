import { DescriptionList } from "@codecps/ui";

export default function DescriptionListCompact() {
  return (
    <DescriptionList size="sm" termWidth="7rem" style={{ maxWidth: 360 }}>
      <DescriptionList.Item term="Courier">Delhivery</DescriptionList.Item>
      <DescriptionList.Item term="AWB">1490 8823 7712</DescriptionList.Item>
      <DescriptionList.Item term="Package">1.2 kg · 30 × 20 × 10 cm</DescriptionList.Item>
      <DescriptionList.Item term="Pickup">Bhiwandi warehouse, 7 Oct</DescriptionList.Item>
      <DescriptionList.Item term="Deliver to">Koramangala, Bengaluru 560034</DescriptionList.Item>
    </DescriptionList>
  );
}
