import { fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Avatar, AvatarGroup } from "./Avatar.jsx";

describe("Avatar", () => {
  it("renders the image with the name as its alt text", () => {
    const { container } = render(<Avatar src="/avatars/aditi.png" name="Aditi Rao" />);

    const image = screen.getByRole("img", { name: "Aditi Rao" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "/avatars/aditi.png");

    const root = container.firstElementChild;
    expect(root).toHaveClass("shelf-avatar", "shelf-avatar--md", "shelf-avatar--circle");
    expect(root).not.toHaveClass("shelf-avatar--fallback");
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("aria-hidden");
  });

  it("uses alt instead of the name when given", () => {
    render(<Avatar src="/avatars/aditi.png" name="Aditi Rao" alt="Aditi Rao, workspace owner" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Aditi Rao, workspace owner");
  });

  it("shows initials from the first and last words of the name, named by the name", () => {
    render(<Avatar name="Sai Kiran Reddy" />);

    const avatar = screen.getByRole("img", { name: "Sai Kiran Reddy" });
    expect(avatar.tagName).toBe("SPAN");
    expect(avatar).toHaveTextContent(/^SR$/);
    expect(avatar).toHaveClass("shelf-avatar--fallback");
  });

  it.each([
    ["Aditi Rao", "AR"],
    ["rohan", "R"],
    ["  kavya   iyer  ", "KI"],
    ["Ñandu Ávila", "ÑÁ"],
  ])("turns %j into the initials %j", (name, initials) => {
    render(<Avatar name={name} />);
    expect(screen.getByRole("img")).toHaveTextContent(new RegExp(`^${initials}$`));
  });

  it("falls back to the initials when the image fails, and retries when src changes", () => {
    const { rerender } = render(<Avatar src="/missing.png" name="Kavya Iyer" />);
    fireEvent.error(screen.getByRole("img", { name: "Kavya Iyer" }));

    const fallback = screen.getByRole("img", { name: "Kavya Iyer" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("KI");

    rerender(<Avatar src="/avatars/kavya.png" name="Kavya Iyer" />);
    const image = screen.getByRole("img", { name: "Kavya Iyer" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "/avatars/kavya.png");
  });

  it("detects an image that already failed before hydration", () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const naturalWidth = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get");

    naturalWidth.mockReturnValue(96);
    const { unmount } = render(<Avatar src="/avatars/arjun.png" name="Arjun Nair" />);
    expect(screen.getByRole("img", { name: "Arjun Nair" }).tagName).toBe("IMG");
    unmount();

    naturalWidth.mockReturnValue(0);
    render(<Avatar src="/missing.png" name="Arjun Nair" />);
    expect(screen.getByRole("img", { name: "Arjun Nair" })).toHaveTextContent("AN");
  });

  it("shows a custom fallback instead of the initials", () => {
    render(<Avatar name="Acme Bot" fallback={<svg data-testid="bot-icon" />} />);

    const avatar = screen.getByRole("img", { name: "Acme Bot" });
    expect(within(avatar).getByTestId("bot-icon")).toBeInTheDocument();
    expect(avatar).not.toHaveTextContent("AB");
  });

  it("is decorative, with a user icon, when there is no name", () => {
    const { container } = render(<Avatar />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).not.toHaveAttribute("role");
    expect(root.querySelector("svg.shelf-avatar__icon")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it('is decorative with alt="", for names that are already visible', () => {
    const { container, rerender } = render(
      <Avatar src="/avatars/aditi.png" name="Aditi Rao" alt="" />,
    );
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");

    rerender(<Avatar name="Aditi Rao" alt="" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(container.firstElementChild).toHaveTextContent("AR");
  });

  it.each(["xs", "sm", "md", "lg", "xl"])("applies the %s size", (size) => {
    render(<Avatar name="Aditi Rao" size={size} />);
    expect(screen.getByRole("img")).toHaveClass(`shelf-avatar--${size}`);
  });

  it("applies the square shape", () => {
    render(<Avatar name="Acme Cloud" shape="square" />);
    expect(screen.getByRole("img")).toHaveClass("shelf-avatar--square");
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(<Avatar ref={ref} name="Aditi Rao" className="custom" id="owner" title="Owner" />);

    const avatar = screen.getByRole("img", { name: "Aditi Rao" });
    expect(ref.current).toBe(avatar);
    expect(avatar).toHaveClass("shelf-avatar", "custom");
    expect(avatar).toHaveAttribute("id", "owner");
    expect(avatar).toHaveAttribute("title", "Owner");
  });
});

const members = ["Aditi Rao", "Rohan Mehta", "Sneha Iyer", "Arjun Nair", "Kavya Reddy"];

describe("AvatarGroup", () => {
  it("renders a group named by label", () => {
    render(
      <AvatarGroup label="Project members">
        {members.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>,
    );

    const group = screen.getByRole("group", { name: "Project members" });
    expect(within(group).getAllByRole("img")).toHaveLength(5);
    expect(within(group).queryByRole("img", { name: /more$/ })).not.toBeInTheDocument();
  });

  it('shows the first max avatars and sums up the rest in a "+N" avatar', () => {
    render(
      <AvatarGroup max={2} label="Project members">
        {members.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>,
    );

    const group = screen.getByRole("group", { name: "Project members" });
    const avatars = within(group).getAllByRole("img");
    expect(avatars.map((avatar) => avatar.getAttribute("aria-label"))).toEqual([
      "Aditi Rao",
      "Rohan Mehta",
      "3 more",
    ]);
    expect(avatars[2]).toHaveTextContent("+3");
    expect(avatars[2]).toHaveClass("shelf-avatar-group__more");
  });

  it("sizes its avatars, and an avatar's own size wins", () => {
    render(
      <AvatarGroup size="sm" max={2}>
        <Avatar name="Aditi Rao" />
        <Avatar name="Rohan Mehta" size="lg" />
        <Avatar name="Sneha Iyer" />
      </AvatarGroup>,
    );

    expect(screen.getByRole("img", { name: "Aditi Rao" })).toHaveClass("shelf-avatar--sm");
    expect(screen.getByRole("img", { name: "Rohan Mehta" })).toHaveClass("shelf-avatar--lg");
    expect(screen.getByRole("img", { name: "1 more" })).toHaveClass("shelf-avatar--sm");
  });

  it("sizes avatars wrapped in other elements, such as profile links", () => {
    render(
      <AvatarGroup size="lg" label="Team">
        <a href="/people/aditi">
          <Avatar name="Aditi Rao" />
        </a>
        <Avatar name="Rohan Mehta" />
      </AvatarGroup>,
    );

    expect(screen.getByRole("link", { name: "Aditi Rao" })).toHaveAttribute(
      "href",
      "/people/aditi",
    );
    expect(screen.getByRole("img", { name: "Aditi Rao" })).toHaveClass("shelf-avatar--lg");
  });

  it("accepts aria-label, forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <AvatarGroup ref={ref} aria-label="Reviewers" className="custom" data-testid="reviewers">
        <Avatar name="Aditi Rao" />
      </AvatarGroup>,
    );

    const group = screen.getByRole("group", { name: "Reviewers" });
    expect(ref.current).toBe(group);
    expect(group).toHaveClass("shelf-avatar-group", "shelf-avatar-group--md", "custom");
    expect(group).toHaveAttribute("data-testid", "reviewers");
  });
});
