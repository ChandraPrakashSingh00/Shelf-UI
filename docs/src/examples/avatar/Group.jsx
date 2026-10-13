import { Avatar, AvatarGroup } from "shelf-ui-react";
import aditi from "./aditi.svg";
import rohan from "./rohan.svg";
import sneha from "./sneha.svg";

const members = [
  { name: "Aditi Rao", photo: aditi },
  { name: "Rohan Mehta", photo: rohan },
  { name: "Sneha Iyer", photo: sneha },
  { name: "Arjun Nair" },
  { name: "Kavya Reddy" },
  { name: "Vikram Singh" },
  { name: "Meera Pillai" },
];

export default function AvatarGroupExample() {
  return (
    <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <AvatarGroup max={4} label="Project members">
        {members.map((member) => (
          <Avatar key={member.name} src={member.photo} name={member.name} />
        ))}
      </AvatarGroup>
      <AvatarGroup size="sm" max={3} label="Reviewers">
        {members.slice(0, 5).map((member) => (
          <Avatar key={member.name} src={member.photo} name={member.name} />
        ))}
      </AvatarGroup>
    </div>
  );
}
