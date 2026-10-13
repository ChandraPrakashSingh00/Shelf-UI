import { Avatar } from "shelf-ui-react";
import aditi from "./aditi.svg";
import rohan from "./rohan.svg";
import sneha from "./sneha.svg";

export default function AvatarImages() {
  return (
    <>
      <Avatar src={aditi} name="Aditi Rao" />
      <Avatar src={rohan} name="Rohan Mehta" />
      <Avatar src={sneha} name="Sneha Iyer" alt="Sneha Iyer, project owner" />
    </>
  );
}
