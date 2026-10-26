# Workspace Agent Guidelines

## Automatic Multi-Repository Git Push Workflow
Jab bhi user bole "git push kar do", "push kar do", ya code push karne ko kahe:
Agent ko hamesha **charo (4) repositories** par push karna hai:

1. **User Origin (Monorepo)**:
   - Remote: `origin` (`https://github.com/Adarsh535/Codeguru.git`)
   - Branch: `main`
   - Command: `git push origin main`

2. **Admin Repo (`CodeGurru/CodeGurru_admin.git`)**:
   - Remote: `admin_repo` (Uses `~/.ssh/id_ed25519_cgukvk_admin`)
   - Split admin: `git subtree split --prefix=admin main` -> `<commit>`
   - `git branch -f cgukvk-admin-deploy <commit>`
   - `git push admin_repo cgukvk-admin-deploy:main`

3. **Backend Repo (`CodeGurru/CodeGurru_backend.git`)**:
   - Remote: `backend_repo` (Uses `~/.ssh/id_ed25519_cgukvk_backend`)
   - Split backend: `git subtree split --prefix=backend main` -> `<commit>`
   - `git branch -f cgukvk-backend-clean <commit>`
   - `git push backend_repo cgukvk-backend-clean:main`

4. **Frontend Repo (`CodeGurru/code.git`)**:
   - Remote: `frontend_repo` (Uses `~/.ssh/id_ed25519_cgukvk_frontend`)
   - Deploy branch: `cgukvk-deploy-frontend`
   - `git checkout cgukvk-deploy-frontend`
   - `git checkout main -- frontend`
   - `git commit -m "build(deploy): sync frontend with main"`
   - `git push frontend_repo cgukvk-deploy-frontend:main`
   - `git checkout main`

## SSH Keys Registered:
- Frontend: `~/.ssh/id_ed25519_cgukvk_frontend` (`cgukvk@gmail.com`)
- Admin: `~/.ssh/id_ed25519_cgukvk_admin` (`cgukvk@gmail.com`)
- Backend: `~/.ssh/id_ed25519_cgukvk_backend` (`cgukvk@gmail.com`)
- Main: `~/.ssh/id_ed25519_cgukvk` (`cgukvk@gmail.com`)
