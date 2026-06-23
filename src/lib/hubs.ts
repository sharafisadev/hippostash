export type HubId = "company" | "help" | "legal";

export interface HubSectionMeta {
  /** in-page anchor id */
  id: string;
  label: string;
}

export interface HubMeta {
  id: HubId;
  route: string;
  /** label shown as the group heading in the side index */
  group: string;
  sections: HubSectionMeta[];
}

/** The single source of truth for cross-page (hub) navigation. */
export const HUBS: HubMeta[] = [
  {
    id: "company",
    route: "/company",
    group: "Company",
    sections: [
      { id: "about", label: "About" },
      { id: "story", label: "Our story" },
      { id: "security", label: "Security" },
    ],
  },
  {
    id: "help",
    route: "/help",
    group: "Resources",
    sections: [
      { id: "help", label: "Help Center" },
      { id: "faq", label: "FAQ" },
    ],
  },
  {
    id: "legal",
    route: "/legal",
    group: "Legal",
    sections: [
      { id: "privacy", label: "Privacy Policy" },
      { id: "terms", label: "Terms of Service" },
    ],
  },
];

export const getHub = (id: HubId) => HUBS.find((h) => h.id === id)!;
