export interface Organization {
  id: string
  name: string
  plan: string
}

// TODO: replace with organizations fetched from the backend once it's available
export const organizations: Organization[] = [
  { id: "acme-inc", name: "Acme Inc", plan: "Enterprise" },
  { id: "acme-corp", name: "Acme Corp.", plan: "Startup" },
  { id: "evil-corp", name: "Evil Corp.", plan: "Free" },
]
