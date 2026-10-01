export type Sponsor = {
  name: string;
  /** One line under the name. */
  tagline: string;
  /** Tagged with ?ref=allglossary so the sponsor can see the traffic came from here. */
  href: string;
  /** Under public/sponsors, with its pixel size. */
  logo: { src: string; width: number; height: number };
  /** Brand color for the card's logo tile and hover accents. */
  accent: string;
  /** Which rail the card sits in on wide screens. */
  side: "left" | "right";
};

export const SPONSORS: Sponsor[] = [
  {
    name: "Woodtech",
    tagline: "Engineered plywood & wooden doors",
    href: "https://www.woodtechipl.com/?ref=allglossary",
    logo: { src: "/sponsors/woodtech.png", width: 256, height: 255 },
    accent: "#b0763a",
    side: "left",
  },
  {
    name: "ModOutfit",
    tagline: "Custom t-shirts & corporate apparel",
    href: "https://modoutfit.com/?ref=allglossary",
    logo: { src: "/sponsors/modoutfit.png", width: 256, height: 50 },
    accent: "#1ea7e1",
    side: "left",
  },
  {
    name: "PoopUp",
    tagline: "Popups that turn visitors into customers",
    href: "https://poopup.co/?ref=allglossary",
    logo: { src: "/sponsors/poopup.png", width: 512, height: 512 },
    accent: "#b8860b",
    side: "right",
  },
  {
    name: "Shikhi AI",
    tagline: "AI voice tutor for kids",
    href: "https://shikhiai.com/?ref=allglossary",
    logo: { src: "/sponsors/shikhiai.png", width: 256, height: 274 },
    accent: "#7c5cd6",
    side: "right",
  },
];
