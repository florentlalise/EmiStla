export interface Project {
  name: string;
  url: string;
  type: "project";
  target: "_self" | "_blank" | "browser";
  disabled?: boolean;
}

export interface Folder {
  name: string;
  type: "folder";
  children: (Folder | Project)[];
}

export type FileSystemItem = Folder | Project;

export const fileSystem: FileSystemItem[] = [
  {
    name: "Pro",
    type: "folder",
    children: [
      {
        name: "Wizi",
        url: "https://wizi.io",
        target: "browser",
        type: "project",
      },
    ],
  },
  {
    name: "Side",
    type: "folder",
    children: [
      {
        name: "emistla.me",
        url: "#",
        target: "_self",
        type: "project",
        disabled: true,
      },
    ],
  },
  {
    name: "Do",
    type: "folder",
    children: [
      {
        name: "Not",
        type: "folder",
        children: [
          {
            name: "Open",
            type: "folder",
            children: [
              {
                name: "404",
                url: "/404",
                target: "_self",
                type: "project",
              },
            ],
          },
        ],
      },
    ],
  },
];
