import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — ALLAOUA Location" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Espace d'administration du site ALLAOUA Location." },
    ],
  }),
  component: () => <Outlet />,
});
