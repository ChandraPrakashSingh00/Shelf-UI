import { Button, Navbar } from "@shelf-ui/react";

export default function NavbarBasic() {
  return (
    <Navbar>
      <Navbar.Brand href="#home">Acme</Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Links>
          <Navbar.Link href="#home" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#products">Products</Navbar.Link>
          <Navbar.Link href="#pricing">Pricing</Navbar.Link>
          <Navbar.Link href="#about">About</Navbar.Link>
        </Navbar.Links>
        <Navbar.Actions>
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm">Get Started</Button>
        </Navbar.Actions>
      </Navbar.Menu>
    </Navbar>
  );
}
