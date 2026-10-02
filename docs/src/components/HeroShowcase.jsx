import { Avatar, Badge, Button, Input, Progress, Stat, Switch } from "@codecps/ui";
import aditi from "../examples/avatar/aditi.svg";
import rohan from "../examples/avatar/rohan.svg";
import sneha from "../examples/avatar/sneha.svg";
import { CheckIcon } from "./icons.jsx";
import { LogoMark } from "./Logo.jsx";

const navItems = ["Dashboard", "Orders", "Products", "Customers", "Settings"];

const weeklySales = [42, 58, 49, 66, 61, 78, 70, 88, 76, 95];

const orders = [
  { name: "Aditi Rao", photo: aditi, total: "₹2,499", status: "Paid", variant: "success" },
  { name: "Rohan Mehta", photo: rohan, total: "₹1,150", status: "Shipped", variant: "primary" },
  { name: "Sneha Iyer", photo: sneha, total: "₹3,820", status: "Pending", variant: "warning" },
];

/**
 * The home page hero: a store dashboard in a browser window, built from live
 * CodeCPS UI components, with two floating cards. Decorative, so it's hidden
 * from assistive tech and inert. It follows the site theme.
 */
export function HeroShowcase() {
  return (
    <div className="docs-showcase-art" aria-hidden="true" inert>
      <div className="docs-browser">
        <div className="docs-browser__bar">
          <span className="docs-browser__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="docs-browser__url">app.codecps.in/dashboard</span>
        </div>

        <div className="docs-browser__body">
          <aside className="docs-app-nav">
            <span className="docs-app-nav__brand">
              <LogoMark />
              Store admin
            </span>
            <ul>
              {navItems.map((item, index) => (
                <li key={item} className={index === 0 ? "is-active" : undefined}>
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="docs-app-main">
            <div className="docs-app-main__header">
              <div>
                <p className="docs-app-main__title">Sales overview</p>
                <p className="docs-app-main__subtitle">Last 30 days</p>
              </div>
              <div className="docs-app-main__actions">
                <Badge variant="success" size="sm">
                  Live
                </Badge>
                <Button size="sm" variant="outline">
                  Export
                </Button>
              </div>
            </div>

            <div className="docs-app-stats">
              <Stat size="sm" label="Revenue" value="₹4.2L" change={12.5} />
              <Stat size="sm" label="Orders" value="1,284" change={8.1} />
              <Stat size="sm" label="Returns" value="1.8%" change={-0.6} higherIsBetter={false} />
            </div>

            <div className="docs-app-grid">
              <div className="docs-app-card">
                <p className="docs-app-card__title">Revenue by week</p>
                <svg className="docs-app-chart" viewBox="0 0 200 80" preserveAspectRatio="none">
                  {weeklySales.map((value, index) => (
                    <rect
                      key={index}
                      x={index * 20 + 4}
                      y={80 - value * 0.8}
                      width="12"
                      height={value * 0.8}
                      rx="3"
                      className={index === weeklySales.length - 1 ? "is-current" : undefined}
                    />
                  ))}
                </svg>
                <Progress size="sm" label="Monthly target" value={72} showValue />
              </div>
              <div className="docs-app-card">
                <p className="docs-app-card__title">Recent orders</p>
                <ul className="docs-app-orders">
                  {orders.map((order) => (
                    <li key={order.name}>
                      <Avatar size="sm" src={order.photo} name={order.name} />
                      <span className="docs-app-orders__name">
                        {order.name}
                        <span>{order.total}</span>
                      </span>
                      <Badge size="sm" variant={order.variant}>
                        {order.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-float docs-float--left">
        <p className="docs-float__title">Welcome back</p>
        <Input size="sm" label="Email" defaultValue="aditi@codecps.in" />
        <Button size="sm" fullWidth>
          Sign in
        </Button>
      </div>

      <div className="docs-float docs-float--right">
        <span className="docs-float__icon">
          <CheckIcon />
        </span>
        <div>
          <p className="docs-float__title">Order #1042 shipped</p>
          <p className="docs-float__text">Aditi will get it by Friday.</p>
        </div>
        <div className="docs-float__footer">
          <Switch size="sm" label="Notify customer" defaultChecked />
        </div>
      </div>
    </div>
  );
}
