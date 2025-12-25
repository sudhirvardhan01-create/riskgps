# Release Workflow - Quick Reference Guide

## 🚀 Workflow Overview

| Aspect | Dev | Prod |
|--------|-----|------|
| **Trigger Branch** | `dev` | `prod` |
| **SSM Parameter** | `/bluocean/riskgps/dev/ec2/credentials` | `/bluocean/riskgps/prod/ec2/credentials` |
| **ECR Repositories** | `bluocean-riskgps-dev-*` | `bluocean-riskgps-prod-*` |
| **Run Tests** | ✅ Yes | ❌ No |
| **Scan Code** | ✅ Yes | ✅ Yes |
| **Build Images** | ✅ Yes | ✅ Yes |
| **Scan Images** | ✅ Yes | ✅ Yes |
| **Push to ECR** | ✅ Yes | ✅ Yes |
| **Manual Override** | Via `workflow_dispatch` | Via `workflow_dispatch` |

---

## 📋 Job Execution Order

```
┌─────────────────────────────┐
│ 1. determine-environment     │  ← Decides environment & flags
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│ 2. get-services             │  ← Fetches backend, frontend from SSM
└────────────┬────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐   ┌──────▼──────┐
│ 3a. Tests│   │ 3b. Scan    │  ← Parallel
└───┬──────┘   └──────┬──────┘
    │    (if needed)   │
    │        AND       │
    └────────┬─────────┘
             │
┌────────────▼────────────────┐
│ 4. build-scan-push          │  ← Build, scan, and push images
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│ 5. workflow-summary         │  ← Final status + fail if needed
└─────────────────────────────┘
```

---

## 🔄 Workflow Triggers

### Push to Dev
```bash
git push origin dev
```
**Result:** Tests → Scan → Build → Scan Image → Push to DEV ECR

### Push to Prod
```bash
git push origin prod
```
**Result:** Scan → Build → Scan Image → Push to PROD ECR (no tests)

### Pull Request to Dev/Prod
```bash
git push origin feature-branch
# Then create PR to dev or prod
```
**Result:** Tests → Scan → Build → Scan Image (no ECR push)

### Manual Trigger
```
GitHub UI → Actions → Release Workflow → Run Workflow
→ Select Environment (dev/prod)
```
**Result:** Full pipeline for selected environment

---

## ❌ Error Handling Summary

| Step | Failure Action |
|------|----------------|
| Invalid Branch | ❌ Fail immediately (only dev/prod allowed) |
| SSM Fetch | ❌ Fail (cannot determine services) |
| Tests | ❌ Fail (don't build if tests fail) |
| Filesystem Scan | ❌ Fail if CRITICAL/HIGH vulnerabilities |
| Docker Build | ❌ Fail on build error |
| Image Scan | ❌ Fail if CRITICAL/HIGH vulnerabilities |
| ECR Push | ❌ Fail on push error |
| Workflow Summary | ❌ Explicit fail if any previous step failed |

**Key Point:** Pipeline fails fast - no partial/incomplete deployments

---

## 🔐 Security Gates

### Trivy Filesystem Scan
- **Checks:** Source code for vulnerabilities
- **Fail On:** CRITICAL and HIGH severity vulnerabilities
- **Ignore:** MEDIUM, LOW, and unfixed vulnerabilities
- **When:** Every build (both dev and prod)

### Trivy Docker Image Scan
- **Checks:** Compiled Docker image for vulnerabilities
- **Fail On:** CRITICAL and HIGH severity vulnerabilities
- **Ignore:** MEDIUM, LOW, and unfixed vulnerabilities
- **When:** Every build (both dev and prod)

**Bypass:** No manual override - security cannot be bypassed

---

## 📊 Services Matrix

The workflow automatically detects and processes these services:

```
Services discovered from ECR:
├── backend
│   └── Image: {account}.dkr.ecr.{region}.amazonaws.com/bluocean-riskgps-{env}-backend
└── frontend
    └── Image: {account}.dkr.ecr.{region}.amazonaws.com/bluocean-riskgps-{env}-frontend
```

**Discovery Method:** Parse ECR repository URLs from SSM Parameter Store

---

## 📦 Image Versioning

**Format:** `v{MAJOR}.{MINOR}.{GITHUB_RUN_NUMBER}`

**Example:** `v1.0.456`

**Variables:**
- `{MAJOR}` - Major version from SSM (`/bluocean/creds/{env}`)
- `{MINOR}` - Minor version from SSM (`/bluocean/creds/{env}`)
- `{GITHUB_RUN_NUMBER}` - Unique GitHub Actions run number

**Fallback:** If SSM version unavailable, defaults to `v1.0.{run_number}`

---

## 🔑 AWS Credentials & Permissions

**IAM Role:** `arn:aws:iam::739962689681:role/GithubActionRole`

**Required Permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:aws:ssm:us-east-1:739962689681:parameter/bluocean/riskgps/*/ec2/credentials",
        "arn:aws:ssm:us-east-1:739962689681:parameter/bluocean/creds/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🐳 Docker Build Process

### Build Command:
```bash
cd {service}
docker build -t {service}:v{VERSION} -f Dockerfile .
```

### Environment-Specific:
- **Dev:** Dockerfile (or Dockerfile.dev if exists)
- **Prod:** Dockerfile (or Dockerfile.prod if exists)

### Build Context:
- Service directory only (`backend/` or `frontend/`)
- Searches for `Dockerfile` in service root

---

## 📋 Environment Variables

### Available in Workflow:
```yaml
AWS_REGION: us-east-1
ENVIRONMENT: dev or prod (from output)
MAJOR_VERSION: from SSM
MINOR_VERSION: from SSM
TAG: v{MAJOR}.{MINOR}.{RUN_NUMBER}
ECR_REGISTRY: {account}.dkr.ecr.{region}.amazonaws.com
ECR_IMAGE: {full path with tag}
```

---

## 🚨 Common Issues & Solutions

### Issue: "Branch not supported"
```
Error: Branch 'feature/xyz' is not supported. Only 'dev' and 'prod' branches are allowed.
```
**Fix:** Create PR to `dev` branch, not feature branch

### Issue: "No services found"
```
Error: No services found in ecr_registry_repository_url
```
**Fix:** Verify SSM parameter exists:
```bash
aws ssm get-parameter \
  --name "/bluocean/riskgps/dev/ec2/credentials" \
  --region us-east-1 \
  --with-decryption
```

### Issue: "Tests failed"
```
Tests failed for backend/frontend
```
**Fix:** Fix issues locally, test, then push:
```bash
npm test  # Run locally first
git commit -am "Fix test"
git push origin dev
```

### Issue: "Trivy vulnerabilities detected"
```
Trivy found CRITICAL/HIGH vulnerabilities
```
**Fix:** Update dependencies or fix code:
```bash
npm audit fix
# or manually fix issues
git commit -am "Fix vulnerabilities"
git push origin dev
```

### Issue: "Failed to push to ECR"
```
Error: Push denied - authentication required
```
**Fix:** Check IAM role and ECR repository:
1. Verify role has ECR permissions
2. Verify repository exists: `aws ecr describe-repositories`
3. Check GitHub Actions logs for detailed error

---

## 📈 Monitoring & Logs

### View Workflow Status:
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Release Workflow"
4. Click the latest run

### Key Log Sections:
- **determine-environment:** Environment selection
- **get-services:** Service discovery
- **run-tests:** Test execution (dev only)
- **scan-files:** Source code vulnerability scan
- **build-scan-push:** Build, image scan, and ECR push
- **workflow-summary:** Final status and summary

### Real-time Monitoring:
- Watch the job progress in GitHub UI
- Each step shows elapsed time
- Failed steps highlighted in red

---

## ✅ Deployment Checklist

Before pushing to `prod`:

- [ ] All tests passing in `dev`
- [ ] Code reviewed and approved
- [ ] No HIGH/CRITICAL vulnerabilities in source scan
- [ ] Docker images scan cleanly
- [ ] Images successfully pushed to dev ECR
- [ ] Ready for production deployment

Before pushing to `dev`:

- [ ] Code committed locally
- [ ] Tests pass locally: `npm test`
- [ ] No linting errors
- [ ] Ready for CI/CD validation

---

## 🔄 Full Deployment Flow

### Development → Production Pipeline:

```
1. Developer pushes to dev branch
   ↓
   GitHub Actions triggers on push
   ↓
2. Workflow runs tests + builds
   ↓
   All checks pass ✅
   ↓
3. Image pushed to dev ECR
   ↓
4. Dev team validates in dev environment
   ↓
5. Create PR from dev → prod
   ↓
   PR review + approval
   ↓
6. Merge to prod branch
   ↓
   GitHub Actions triggers on push
   ↓
7. Workflow builds (no tests)
   ↓
8. Image pushed to prod ECR
   ↓
9. Prod deployment pipeline pulls from prod ECR
   ↓
10. Application updated in production ✅
```

---

## 📞 Support

For issues, check:
1. **Logs:** GitHub Actions → Your workflow run
2. **Documentation:** [WORKFLOW_DOCUMENTATION.md](WORKFLOW_DOCUMENTATION.md)
3. **AWS Permissions:** Verify IAM role configuration
4. **SSM Parameters:** Verify parameter values and paths
5. **Docker:** Test locally: `docker build .`
6. **Tests:** Run locally: `npm test`

---

## 🎯 Key Takeaways

✅ **Fully Automated** - No manual environment selection in CI/CD  
✅ **Branch Specific** - dev and prod branches have different pipelines  
✅ **Fail Fast** - Any error stops the pipeline immediately  
✅ **Security First** - Automatic vulnerability scanning  
✅ **Quality Gate** - Tests run for dev, skipped for prod  
✅ **Clear Visibility** - Detailed logging and GitHub summaries  
✅ **Scalable** - Supports multiple services via matrix strategy  
