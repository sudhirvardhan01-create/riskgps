# Release Workflow - Dynamic Environment & Branch Specific

## Overview

The updated `release.yml` GitHub Actions workflow is now **fully dynamic and environment-specific**, automatically adapting to different branches and environments (dev/prod) with proper error handling and fail-fast behavior.

---

## Workflow Triggers

### 1. **Push Events** (Auto-deploy)
```yaml
on:
  push:
    branches:
      - dev      # Push to dev branch → builds and pushes to DEV ECR
      - prod     # Push to prod branch → builds and pushes to PROD ECR
```

### 2. **Pull Request Events** (Pre-validation)
```yaml
on:
  pull_request:
    branches:
      - dev      # PR to dev → runs tests & scans (no push to ECR)
      - prod     # PR to prod → runs scans only (no tests, no push)
```

### 3. **Manual Trigger** (Workflow Dispatch)
```yaml
workflow_dispatch:
  inputs:
    environment:
      type: choice
      options: [dev, prod]  # Manual environment selection
```

---

## Workflow Jobs & Flow

### Job 1: `determine-environment`
**Purpose:** Dynamically determine environment and execution settings based on branch/event

**Logic:**
```
┌─────────────────────────────────┐
│ Event Type & Branch Check       │
├─────────────────────────────────┤
│ workflow_dispatch               │ → Use selected environment
├─────────────────────────────────┤
│ push/pr to 'dev'                │ → Environment: dev
│                                 │ → Run Tests: true
│                                 │ → Build: true
├─────────────────────────────────┤
│ push/pr to 'prod'               │ → Environment: prod
│                                 │ → Run Tests: false (skip)
│                                 │ → Build: true
├─────────────────────────────────┤
│ Any other branch                │ → FAIL (unsupported)
└─────────────────────────────────┘
```

**Outputs:**
- `environment`: `dev` or `prod`
- `run-tests`: `true` or `false`
- `is-push-event`: `true` for push, `false` for PR/dispatch
- `should-build`: `true` if build should proceed

---

### Job 2: `get-services`
**Purpose:** Fetch service names from AWS SSM Parameter Store

**Environment-Specific SSM Path:**
```
DEV:  /bluocean/riskgps/dev/ec2/credentials
PROD: /bluocean/riskgps/prod/ec2/credentials
```

**Process:**
1. Configure AWS credentials (via IAM role)
2. Fetch SSM parameter for the selected environment
3. Parse JSON to extract ECR repository URLs
4. Extract service names: `backend`, `frontend`
5. Return as JSON array for matrix strategy

**Error Handling:**
- ❌ Fails if SSM parameter doesn't exist
- ❌ Fails if no services found
- ❌ Fails if parsing fails

**Example Output:**
```json
["backend", "frontend"]
```

---

### Job 3: `run-tests` (Conditional)
**Runs Only If:** `determine-environment.run-tests == 'true'`

**Matrix Strategy:** Runs for each service (backend, frontend)

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run unit tests (`npm test`)

**Error Handling:**
- ❌ Fails if dependency installation fails
- ❌ Fails if tests fail
- ⏭️ Skipped if `run-tests == 'false'` (prod environment)

**Environment Mapping:**
- **DEV**: Tests RUN (validation gate)
- **PROD**: Tests SKIPPED (already validated via dev)

---

### Job 4: `scan-files`
**Purpose:** Security scanning of source code with Trivy

**Runs For:** Each service (backend, frontend)

**Scan Configuration:**
```
Type:      Filesystem
Format:    Table
Exit Code: 1 (fail on critical/high)
Severity:  CRITICAL, HIGH
Ignore:    Unfixed vulnerabilities
```

**Error Handling:**
- ❌ FAILS if CRITICAL/HIGH vulnerabilities found
- ✅ Continues if LOW/MEDIUM vulnerabilities found
- ❌ Fails on scan execution error

---

### Job 5: `build-scan-push` (Conditional)
**Runs Only If:**
- `should-build == 'true'`
- `scan-files.result == 'success'`
- `run-tests.result == 'success' OR 'skipped'`

**Matrix Strategy:** Runs for each service

**Environment-Specific Configuration:**

#### DEV Environment:
```
ECR Path:     /bluocean/riskgps/dev/ec2/credentials
ECR Repos:    bluocean-riskgps-dev-backend
              bluocean-riskgps-dev-frontend
Run Tests:    ✅ YES
```

#### PROD Environment:
```
ECR Path:     /bluocean/riskgps/prod/ec2/credentials
ECR Repos:    bluocean-riskgps-prod-backend
              bluocean-riskgps-prod-frontend
Run Tests:    ❌ NO (skipped)
```

**Steps:**

1. **Configure AWS Credentials**
   - Assumes IAM role: `arn:aws:iam::739962689681:role/GithubActionRole`
   - Grants ECR push permissions

2. **Fetch Credentials from SSM**
   - Gets ECR repository URLs
   - Extracts version info (MAJOR_VERSION, MINOR_VERSION)
   - Falls back to defaults if version SSM unavailable
   
3. **Build Docker Image**
   ```bash
   docker build -t {service}:v{MAJOR}.{MINOR}.{RUN_NUMBER} -f Dockerfile .
   ```
   - Uses `Dockerfile` from service directory
   - Tags with semantic versioning

4. **Scan Docker Image with Trivy**
   ```
   Type:      Docker image
   Format:    Table
   Exit Code: 1 (fail on critical/high)
   Severity:  CRITICAL, HIGH
   ```

5. **Tag Image**
   - Tags image with full ECR registry path
   - Format: `{AWS_ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/{REPO}:v{VERSION}`

6. **Push to ECR**
   - Authenticates to ECR
   - Pushes tagged image
   - Fails on push error

**Error Handling:**
- ❌ Fails if SSM parameter fetch fails
- ❌ Fails if Docker build fails
- ❌ Fails if image scan detects CRITICAL/HIGH vulnerabilities
- ❌ Fails if ECR push fails
- ✅ Succeeds if all steps pass

---

### Job 6: `workflow-summary`
**Purpose:** Generate execution summary and fail the pipeline if needed

**Outputs:**

#### Success Summary:
```
🎉 Docker Build and Push Summary
Environment: DEV/PROD
Branch: dev/prod
Tests Run: true/false
Status: ✅ SUCCESS

Dev Environment: Ran tests, built, scanned, and pushed to DEV ECR
Prod Environment: Built, scanned, and pushed to PROD ECR (tests skipped)
```

#### Failure Summary:
```
❌ Workflow Failed
Status: FAILED

Reason: Build, Scan, or Push stage failed
Troubleshooting: Check logs, SSM parameters, AWS credentials
```

---

## Complete Workflow Examples

### Example 1: Push to DEV Branch
```
Event:    push to dev
          ↓
determine-environment: environment=dev, run-tests=true
          ↓
get-services: ["backend", "frontend"]
          ↓
run-tests: ✅ Tests run for backend & frontend
          ↓
scan-files: ✅ Scan backend & frontend source code
          ↓
build-scan-push: 
  - Build backend:frontend with version tag
  - Scan Docker image
  - Push to: bluocean-riskgps-dev-backend:v1.0.123
           bluocean-riskgps-dev-frontend:v1.0.123
          ↓
workflow-summary: ✅ SUCCESS - Images pushed to DEV ECR
```

### Example 2: Push to PROD Branch
```
Event:    push to prod
          ↓
determine-environment: environment=prod, run-tests=false
          ↓
get-services: ["backend", "frontend"]
          ↓
run-tests: ⏭️ SKIPPED (prod doesn't need tests)
          ↓
scan-files: ✅ Scan backend & frontend source code
          ↓
build-scan-push:
  - Build backend:frontend with version tag
  - Scan Docker image
  - Push to: bluocean-riskgps-prod-backend:v1.0.124
           bluocean-riskgps-prod-frontend:v1.0.124
          ↓
workflow-summary: ✅ SUCCESS - Images pushed to PROD ECR
```

### Example 3: Pull Request to DEV
```
Event:    pull_request to dev
          ↓
determine-environment: environment=dev, run-tests=true
          ↓
get-services: ["backend", "frontend"]
          ↓
run-tests: ✅ Tests run for backend & frontend
          ↓
scan-files: ✅ Scan backend & frontend source code
          ↓
build-scan-push: ⏭️ SKIPPED (PR doesn't push to ECR, only validates)
          ↓
workflow-summary: ✅ SUCCESS - PR validation complete (no push)
```

---

## Error Scenarios & Failure Handling

| Scenario | Trigger | Result | Action |
|----------|---------|--------|--------|
| Unsupported branch | Push to `feature/*` | ❌ FAIL | `determine-environment` exits with error |
| SSM param not found | No `/bluocean/riskgps/{env}/ec2/credentials` | ❌ FAIL | `get-services` exits with error |
| Test failure | `npm test` fails | ❌ FAIL | Pipeline stops, doesn't build/push |
| Source code vulnerability | Trivy finds CRITICAL/HIGH | ❌ FAIL | `scan-files` exits with code 1 |
| Docker build error | `docker build` fails | ❌ FAIL | `build-scan-push` stops, no push |
| Image vulnerability | Docker image has CRITICAL/HIGH | ❌ FAIL | `build-scan-push` exits with code 1 |
| ECR push error | Network/permission issue | ❌ FAIL | `build-scan-push` fails, rollback not needed (immutable) |
| Invalid environment input | Manual dispatch with wrong env | ❌ FAIL | `determine-environment` exits with error |

---

## Key Features

### ✅ Environment Automation
- Detects environment from git branch automatically
- No manual environment selection needed for CI/CD
- Manual override via `workflow_dispatch`

### ✅ Branch Specificity
- **dev branch** → Full testing pipeline
- **prod branch** → Production-safe pipeline (no tests)
- **Other branches** → Immediately rejected

### ✅ Fail-Fast
- Exits early on any error
- No partial deployments
- Clear error messages in logs

### ✅ Dynamic Configuration
- Environment-specific SSM parameters
- Service discovery from infrastructure outputs
- Semantic versioning with build numbers

### ✅ Matrix Strategy
- Parallel build/scan/push for each service
- Faster execution for multiple services
- Independent failures isolated per service

### ✅ Security
- Trivy filesystem scanning (source code)
- Trivy image scanning (Docker images)
- Fails on CRITICAL/HIGH vulnerabilities
- No manual overrides for security gates

### ✅ Comprehensive Logging
- Each step has clear status messages
- Emoji indicators for quick scanning
- Detailed error messages for troubleshooting
- GitHub Step Summary with visual formatting

---

## Variable Reference

| Variable | DEV | PROD |
|----------|-----|------|
| Environment | `dev` | `prod` |
| SSM Path | `/bluocean/riskgps/dev/ec2/credentials` | `/bluocean/riskgps/prod/ec2/credentials` |
| VPC CIDR | `10.0.0.0/16` | `10.1.0.0/16` |
| ECR Repo: Backend | `bluocean-riskgps-dev-backend` | `bluocean-riskgps-prod-backend` |
| ECR Repo: Frontend | `bluocean-riskgps-dev-frontend` | `bluocean-riskgps-prod-frontend` |
| Run Tests | ✅ YES | ❌ NO |
| Instance Type | (from tfvars) | (from tfvars) |
| Elastic IP | (dynamic) | (dynamic) |

---

## Deployment Process

### For DEV Deployment:
```bash
git checkout dev
git commit -m "Feature implementation"
git push origin dev
# Workflow automatically:
# 1. ✅ Runs tests
# 2. ✅ Scans source code
# 3. ✅ Builds Docker images
# 4. ✅ Scans Docker images
# 5. ✅ Pushes to dev ECR
```

### For PROD Deployment:
```bash
git checkout prod
git merge dev (or cherry-pick commits)
git push origin prod
# Workflow automatically:
# 1. ⏭️ Skips tests (already tested in dev)
# 2. ✅ Scans source code
# 3. ✅ Builds Docker images
# 4. ✅ Scans Docker images
# 5. ✅ Pushes to prod ECR
```

---

## Troubleshooting

### Problem: "Branch '{branch}' is not supported"
**Solution:** Only `dev` and `prod` branches are supported. Create a PR to one of these branches.

### Problem: "No services found in ecr_registry_repository_url"
**Solution:** Verify the SSM parameter exists:
```bash
aws ssm get-parameter --name "/bluocean/riskgps/dev/ec2/credentials" --with-decryption
```

### Problem: "Tests failed"
**Solution:** Fix failing tests locally, commit, and push again.

### Problem: "Trivy found vulnerabilities"
**Solution:** Either fix vulnerabilities or update Trivy ignore rules if false positives.

### Problem: "Failed to push to ECR"
**Solution:** Verify:
1. IAM role has ECR push permissions
2. Repository exists in ECR
3. Network connectivity to AWS

---

## Summary

This workflow provides:
- ✅ **Full automation** - No manual environment selection
- ✅ **Environment isolation** - Dev and prod completely separate
- ✅ **Security gates** - Automated vulnerability scanning
- ✅ **Quality assurance** - Tests run automatically for dev
- ✅ **Fast feedback** - Fail-fast on any error
- ✅ **Clear visibility** - Comprehensive logging and summaries
- ✅ **Scalability** - Supports multiple services via matrix strategy
