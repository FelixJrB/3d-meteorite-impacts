# Your Project

This is your project's GitLab repository. You have **Maintainer** access — you can configure pipelines, manage project settings, and work freely within the repository.

## What lives here

This repository is the hub for your project. Use it to:

- Document your project in the **Wiki** (Plan → Wiki)
- Track requirements in **Requirements Management** (Plan → Requirements)
- Plan and track work in **Issues** and **Milestones** (Plan → Issues)
- Set up your **CI/CD pipeline** via `.gitlab-ci.yml`

If your project has multiple components (e.g. a frontend and a backend), create separate repositories for each within your GitLab `workspace` group, and use this repository as the project hub.

---

👉 **Replace this README with a description of your own project.**

stucture / work in progress >_<

3D-meteorite-impacts/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
├── README.md
├── server.js
└── src/
    ├── main.js
    ├── api/
    │   └── meteorites.js
    ├── cesiumjs/
    │   ├── markers.js
    │   └── viewer.js
    └── config/
        └── mongoose.js