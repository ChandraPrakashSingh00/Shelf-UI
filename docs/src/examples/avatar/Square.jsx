import { Avatar } from "shelf-ui-react";

const workspaces = [
  { name: "Acme Studio", members: "24 members" },
  { name: "Sharma Textiles", members: "8 members" },
  { name: "Udaan Logistics", members: "3 members" },
];

export default function AvatarSquare() {
  return (
    <ul
      style={{
        display: "grid",
        gap: 16,
        width: "100%",
        maxWidth: 320,
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
    >
      {workspaces.map((workspace) => (
        <li key={workspace.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* The name is shown next to the avatar, so alt="" avoids reading it twice. */}
          <Avatar shape="square" name={workspace.name} alt="" />
          <div>
            <div style={{ fontWeight: 600 }}>{workspace.name}</div>
            <div style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
              {workspace.members}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
