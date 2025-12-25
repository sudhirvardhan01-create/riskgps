# Release Workflow - Before & After Comparison

## Overview of Changes

The workflow has been transformed from a **static main-branch-focused** pipeline to a **dynamic, multi-environment, branch-specific** pipeline with comprehensive error handling.

---

## ❌ BEFORE (Old Workflow)

### Limitations:
```yaml
# Only triggered on main branch (production)
on:
  push:
    branches:
      - dev
      - main  ← Only 'main' mapped to prod, no flexibility
```

### Environment Determination:
```bash
# Static branch mapping
if branch == "dev":
    environment = "dev"
    run_tests = true
elif branch == "main":
    environment = "prod"
    run_tests = false  ← Named 'main', not 'prod'
else:
    environment = "dev"  ← Default to dev (risky)
    run_tests = true
```

### Issues:
- ❌ No support for `prod` branch name
- ❌ Default fallback to dev (implicit behavior)
- ❌ SSM parameter path incorrect: `/bluocean/ec2/credentials/{env}` (should be `/bluocean/riskgps/{env}/ec2/credentials`)
- ❌ Service name parsing incorrect: `sub("^riskgps-"; "")` (didn't handle `bluocean-riskgps-{env}-` prefix)
- ❌ Trivy exit code 0 (warnings treated as success)
- ❌ No explicit error handling
- ❌ No PR support for validation
- ❌ No fail-fast mechanism

---

## ✅ AFTER (New Workflow)

### Dynamic Configuration:
```yaml
# Supports both push and pull_request events
on:
  push:
    branches:
      - dev   # Dev branch triggers dev environment
      - prod  # Prod branch triggers prod environment
  pull_request:
    branches:
      - dev   # PR to dev triggers validation (no push)
      - prod  # PR to prod triggers validation (no push)
  workflow_dispatch:  # Manual override option
    inputs:
      environment:
        options: [dev, prod]
```

### Environment Determination:
```bash
# Smart logic with fail-fast
if event == "workflow_dispatch":
    environment = user_selected
    run_tests = true
elif branch == "dev":
    environment = "dev"
    run_tests = true
elif branch == "prod":
    environment = "prod"
    run_tests = false
else:
    echo "❌ Error: Unsupported branch"
    exit 1  ← FAIL FAST
```

### Improvements:

#### 1. Correct SSM Parameter Paths
```bash
# BEFORE (incorrect)
SSM_EC2_CREDENTIALS="/bluocean/ec2/credentials/${env}"
# Result: /bluocean/ec2/credentials/dev ❌

# AFTER (correct)
SSM_EC2_CREDENTIALS="/bluocean/riskgps/${env}/ec2/credentials"
# Result: /bluocean/riskgps/dev/ec2/credentials ✅
```

#### 2. Correct Service Name Parsing
```bash
# BEFORE (incorrect)
SERVICES=$(echo "$CREDENTIALS" | jq -c '[.ecr_registry_repository_url[] | split("/")[1] | sub("^riskgps-"; "")]')
# For: bluocean-riskgps-dev-backend
# Expected: backend
# Actual: bluocean-riskgps-dev-backend ❌

# AFTER (correct)
SERVICES=$(echo "$CREDENTIALS" | jq -c '[.ecr_registry_repository_url[] | split("/")[1] | sub("bluocean-riskgps-'"${ENVIRONMENT}"'-"; "")]')
# For: bluocean-riskgps-dev-backend
# Result: backend ✅
```

#### 3. Proper Error Handling
```bash
# BEFORE
SSM_EC2_CREDENTIALS="/bluocean/ec2/credentials/${{ env }}"
CREDENTIALS=$(aws ssm get-parameter ...)
SERVICES=$(echo "$CREDENTIALS" | jq -c ...)
# If any step fails, execution continues (no error check)

# AFTER
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to retrieve SSM parameter"
    exit 1  ← Explicit error handling
fi

if [ -z "$SERVICES" ] || [ "$SERVICES" = "[]" ]; then
    echo "❌ Error: No services found"
    exit 1  ← Explicit error handling
fi
```

#### 4. Trivy Exit Codes
```bash
# BEFORE
exit-code: "0"  ← Warnings pass (not secure)

# AFTER
exit-code: "1"  ← Fail on CRITICAL/HIGH vulnerabilities
```

#### 5. Clear Status Messages
```bash
# BEFORE (minimal output)
echo "Branch: ${{ github.ref }}, Environment: unknown"

# AFTER (detailed output)
echo "✅ Environment: dev"
echo "✅ Event: push"
echo "✅ Branch: dev"
echo "✅ Run Tests: true"
echo "✅ Push Event: true"
echo "✅ Services detected: backend, frontend"
```

---

## Detailed Comparison by Job

### Job: determine-environment

| Aspect | Before | After |
|--------|--------|-------|
| Branch Logic | Simple if/elif | Smart if/elif with validation |
| Error Handling | None | Explicit exit 1 on unsupported branch |
| Event Support | Push only | Push, PR, and dispatch |
| Output Variables | 2 (environment, run-tests) | 4 (+ is-push-event, should-build) |
| Logging | Minimal | Detailed with emoji indicators |
| PR Support | ❌ No | ✅ Yes |

### Job: get-services

| Aspect | Before | After |
|--------|--------|-------|
| SSM Path | Incorrect path | Correct path with env variable |
| Error Handling | None | Comprehensive error checks |
| Service Parsing | Incorrect regex | Correct dynamic regex |
| Validation | None | Checks for empty results |
| Logging | None | Detailed status messages |
| Fallback | None | Clear error on failure |

### Job: run-tests

| Aspect | Before | After |
|--------|--------|-------|
| Dependencies | None | Error checks for npm ci |
| Failure Handling | Silent fail | Explicit exit 1 |
| Logging | Minimal | Status emojis ✅ 🧪 |
| Skip Condition | Works | Works + documented |

### Job: scan-files

| Aspect | Before | After |
|--------|--------|-------|
| Exit Code | 0 (pass on warnings) | 1 (fail on critical/high) |
| Severity Filter | CRITICAL,HIGH | CRITICAL,HIGH |
| Error Handling | None | Implicit via exit code 1 |
| Logging | None | Scan progress indication |
| Impact | Vulnerabilities ignored | Vulnerabilities block pipeline |

### Job: build-scan-push

| Aspect | Before | After |
|--------|--------|-------|
| SSM Path | Incorrect | Correct with variable |
| Error Handling | Limited | Comprehensive |
| Service Name | Hardcoded `riskgps-` | Dynamic from service matrix |
| Docker Build | No error check | Explicit error handling |
| Image Scan | Exit code 0 | Exit code 1 (fail safe) |
| Push Error | Silent | Explicit error message |
| Logging | Minimal | Detailed progress output |
| Fallback Versions | None | Defaults to v1.0 if SSM fails |
| Conditional Build | None | Only on push events |

### Job: workflow-summary

| Aspect | Before | After |
|--------|--------|-------|
| Status Reporting | Basic | Comprehensive table format |
| Success Message | Generic | Detailed environment-specific |
| Failure Message | None | Troubleshooting guide |
| Exit Code | None | Explicit fail on job failure |
| Markdown Formatting | Basic | Rich GitHub markdown |
| Visibility | Low | High with emoji indicators |

---

## Key Behavioral Differences

### Scenario 1: Push to Unsupported Branch
```
BEFORE: Silently defaults to dev environment (risky!)
AFTER:  ❌ FAILS with clear error message
        "Branch 'feature/xyz' is not supported"
```

### Scenario 2: SSM Parameter Missing
```
BEFORE: jq parse error (implicit)
        No clear error message
AFTER:  ❌ FAILS with explicit message
        "Failed to retrieve SSM parameter: {path}"
```

### Scenario 3: No Services Found
```
BEFORE: Proceeds with empty services array
        Matrix runs with undefined service
AFTER:  ❌ FAILS with clear message
        "No services found in ecr_registry_repository_url"
```

### Scenario 4: Trivy Finds Vulnerabilities
```
BEFORE: ✅ PASSES (exit code 0)
        Vulnerabilities ignored
AFTER:  ❌ FAILS (exit code 1)
        Pipeline blocked, must fix vulnerabilities
```

### Scenario 5: Pull Request to dev
```
BEFORE: Runs tests + builds
        Attempts to push to ECR (wrong!)
AFTER:  Runs tests + builds
        Skips ECR push (correct!)
        Just validates code quality
```

### Scenario 6: Prod Branch Build
```
BEFORE: branch=main (not prod)
        Must maintain separate main branch
AFTER:  branch=prod (clearer naming)
        Dedicated prod branch
        No test execution (correct for prod)
```

---

## Error Detection Improvements

### Critical Paths Now Protected:

```
┌─────────────────────────────────────────┐
│ BEFORE: Any error in silent fail mode   │
├─────────────────────────────────────────┤
│ ❌ Service discovery fails → Continue   │
│ ❌ Tests fail → Continue                │
│ ❌ Docker build fails → Continue        │
│ ❌ Vulnerabilities found → Continue     │
│ ❌ ECR push fails → Continue            │
│                                         │
│ Result: Partial/corrupted deployment   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ AFTER: Explicit error handling          │
├─────────────────────────────────────────┤
│ ✅ Service discovery fails → STOP       │
│ ✅ Tests fail → STOP                    │
│ ✅ Docker build fails → STOP            │
│ ✅ Vulnerabilities found → STOP         │
│ ✅ ECR push fails → STOP                │
│                                         │
│ Result: No partial deployments         │
└─────────────────────────────────────────┘
```

---

## Migration Path

### For Existing Users:

1. **Update branch names:**
   - `main` → `prod`
   - Keep `dev`

2. **Update default branch:**
   - GitHub Settings → Branches → Default Branch
   - Change from `main` to `prod` (or keep custom default)

3. **Update CI/CD references:**
   - Any references to `main` branch
   - Update to `prod` branch

4. **Test the new workflow:**
   ```bash
   # Test dev environment
   git push origin dev
   
   # Test prod environment
   git push origin prod
   
   # Test PR validation
   git checkout -b feature/test
   git push origin feature/test
   git create PR to dev
   ```

---

## Summary of Improvements

| Category | Before | After |
|----------|--------|-------|
| **Branch Support** | dev, main | dev, prod |
| **Event Support** | push only | push, PR, dispatch |
| **Error Handling** | Implicit/silent | Explicit/fail-fast |
| **SSM Paths** | ❌ Incorrect | ✅ Correct |
| **Service Parsing** | ❌ Broken | ✅ Dynamic & correct |
| **Security Gates** | Warnings pass | CRITICAL/HIGH blocks |
| **Logging** | Minimal | Comprehensive |
| **PR Support** | ❌ No | ✅ Yes |
| **Conditional Logic** | Static | Dynamic |
| **Fallbacks** | None | Version defaults |
| **User Feedback** | Poor | Excellent |
| **Deployment Safety** | Low | High |

---

## Transition Checklist

- [ ] Update GitHub default branch from `main` to `prod` (or custom)
- [ ] Rename existing `main` branch to `prod`
- [ ] Update any CI/CD references to use new branch names
- [ ] Test workflow on dev branch
- [ ] Test workflow on prod branch
- [ ] Test PR workflow to dev branch
- [ ] Update documentation for team
- [ ] Monitor first few deployments
- [ ] Remove old main branch after verification

---

## Conclusion

The updated workflow transforms from a **fragile, implicit, error-ignoring** system to a **robust, explicit, fail-fast** system with:

✅ Correct infrastructure integration  
✅ Comprehensive error handling  
✅ Security-first approach  
✅ Clear visibility and logging  
✅ Support for modern git workflows (PRs, multiple branches)  
✅ Scalable multi-service architecture  
