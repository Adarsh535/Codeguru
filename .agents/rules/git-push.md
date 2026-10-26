# Git Multi-Repository Push Rule

When the user asks to push code to Git (e.g. "git push kar do", "push to github", etc.), ALWAYS execute the complete multi-repository sync workflow across all 4 destinations:

## 1. Monorepo (User's Origin)
- Ensure all files on `main` are committed with descriptive messages.
- Verify secrets/passwords (such as live Twilio/Cloudinary secrets) are kept as templates in committed files so GitHub Push Protection never fails.
- Push to origin:
  ```bash
  git push origin main
  ```
  (Remote: `https://github.com/Adarsh535/Codeguru.git`)

---

## 2. Admin Repository (`CodeGurru/CodeGurru_admin.git`)
- SSH Key: `~/.ssh/id_ed25519_cgukvk_admin` (Host: `github-cgukvk-admin`)
- Generate split commit for `admin`:
  ```bash
  git subtree split --prefix=admin main
  ```
- Fast-forward deploy branch and push:
  ```bash
  git branch -f cgukvk-admin-deploy <admin_split_commit>
  git push admin_repo cgukvk-admin-deploy:main
  ```

---

## 3. Backend Repository (`CodeGurru/CodeGurru_backend.git`)
- SSH Key: `~/.ssh/id_ed25519_cgukvk_backend` (Host: `github-cgukvk-backend`)
- Generate split commit for `backend`:
  ```bash
  git subtree split --prefix=backend main
  ```
- Fast-forward clean branch and push:
  ```bash
  git branch -f cgukvk-backend-clean <backend_split_commit>
  git push backend_repo cgukvk-backend-clean:main
  ```

---

## 4. Frontend Repository (`CodeGurru/code.git`)
- SSH Key: `~/.ssh/id_ed25519_cgukvk_frontend` (Host: `github-cgukvk-frontend`)
- Sync to deployment branch `cgukvk-deploy-frontend`:
  ```bash
  git checkout cgukvk-deploy-frontend
  git checkout main -- frontend
  git commit -m "build(deploy): sync frontend with main"
  git push frontend_repo cgukvk-deploy-frontend:main
  git checkout main
  ```

---

## SSH Key Reference:
- **Frontend Key**: `id_ed25519_cgukvk_frontend` (`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKOCGiRdoOunyXsJg0e8kVdRShRzt+lkWMNv1flrYMk7 cgukvk@gmail.com`) -> `git@github-cgukvk-frontend:CodeGurru/code.git`
- **Admin Key**: `id_ed25519_cgukvk_admin` (`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOjzSal3RjASjTiKI8MNFCPETL1Ii/oK58YwVMX+O6Da cgukvk@gmail.com`) -> `git@github-cgukvk-admin:CodeGurru/CodeGurru_admin.git`
- **Backend Key**: `id_ed25519_cgukvk_backend` (`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAmUCYAKLBXVVbQ/FcQx/kHBxRPFdh6NCHyJOyadl8zo cgukvk@gmail.com`) -> `git@github-cgukvk-backend:CodeGurru/CodeGurru_backend.git`
- **Main Account Key**: `id_ed25519_cgukvk` (`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE4qxApna+vkYoJa+TId0r/3V2nrh7/OKrEhbvBjBDtr cgukvk@gmail.com`) -> `github-cgukvk`
