# Release Workflow - Visual Guide

## 🎯 At-a-Glance Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS - DOCKER BUILD, SCAN, AND PUSH TO AWS ECR       │
│  Dynamic, Environment-Specific, Branch-Specific Pipeline         │
└─────────────────────────────────────────────────────────────────┘

TRIGGERS:
  Push to dev    →  Full pipeline with tests
  Push to prod   →  Pipeline without tests
  PR to dev/prod →  Validation only (no ECR push)
  Manual dispatch →  User-selected environment
```

---

## 🔄 Job Flow Diagram

```
                    ┌──────────────────────────┐
                    │  GitHub Event Received   │
                    │  (push/PR/dispatch)      │
                    └────────────┬─────────────┘
                                 │
                   ┌─────────────▼──────────────┐
                   │ 1. determine-environment   │
                   │  - Detect branch          │
                   │  - Set environment        │
                   │  - Set flags              │
                   └──────────┬────────────────┘
                              │
                              ├─► dev branch    → run-tests=true
                              ├─► prod branch   → run-tests=false
                              ├─► PR event      → should-build=false (no push)
                              └─► else          → ❌ FAIL
                                 
                   ┌──────────────▼──────────────┐
                   │ 2. get-services            │
                   │  - Fetch SSM parameter     │
                   │  - Parse ECR URLs          │
                   │  - Extract service names   │
                   └───┬──────────────┬─────────┘
                       │              │
                   backend       frontend
                       │              │
            ┌──────────┴──────────────┴──────────┐
            │                                     │
   ┌────────▼─────────┐            ┌────────────▼────────┐
   │ 3a. run-tests    │ (if needed)│ 3b. scan-files      │
   │  - Install deps  │            │  - Install deps     │
   │  - Run npm test  │            │  - Trivy filesystem │
   │  ❌ Fails on     │            │  ❌ Fails on        │
   │     test errors  │            │     CRITICAL/HIGH   │
   └────────┬─────────┘            └────────┬────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                   ┌────────▼────────────────┐
                   │ 4. build-scan-push      │
                   │ (Matrix: backend, ...   │
                   │  frontend)              │
                   │                         │
                   │  ✅ Checkout code      │
                   │  ✅ Build Docker img   │
                   │  ✅ Scan Docker image  │
                   │  ✅ Tag image          │
                   │  ✅ Push to ECR        │
                   │                         │
                   │  Conditional:           │
                   │  - Only if tests pass   │
                   │  - Only on push events  │
                   └────────┬────────────────┘
                            │
                   ┌────────▼────────────────┐
                   │ 5. workflow-summary     │
                   │  - Generate report      │
                   │  - Show success/failure │
                   │  - Provide next steps   │
                   │  ❌ Fail if any error   │
                   └────────┬────────────────┘
                            │
                      ┌─────▼──────────┐
                      │ Done!          │
                      │ ✅ or ❌       │
                      └────────────────┘
```

---

## 🌳 Decision Tree

```
                       START
                         │
              ┌──────────▼──────────────┐
              │ What event triggered?   │
              └──────────┬──────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼──┐     ┌──────▼─────┐   ┌────▼─────┐
    │ PUSH   │     │ PR         │   │ DISPATCH │
    └────┬──┘     └──────┬─────┘   └────┬─────┘
         │               │              │
    ┌────▼─────────┐    │         ┌─────▼──────┐
    │ Which branch?│    │         │ User input │
    └────┬─────────┘    │         └─────┬──────┘
         │              │               │
    ┌────┼────┐    ┌────┴─┐        ┌────┴──┐
    │ dev │prod│   │target│        │ dev   │
    │     │    │   │branch│        │ or    │
    └┬──┬─┘    │   │      │        │ prod  │
     │  │      │   └──┬───┘        └───┬───┘
     │  │      │      │                │
   ┌─▼──▼┐  ┌─▼──────▼┐            ┌──▼────┐
   │DEV  │  │PROD     │            │Manual │
   │env  │  │env      │            │env    │
   │test │  │no test  │            │user   │
   │push │  │push     │            │select │
   └──┬──┘  └──┬──────┘            └──┬────┘
      │        │                       │
      └────────┴───────────────────────┘
               │
        ┌──────▼──────┐
        │Get Services │
        │from SSM     │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │Run Pipeline │
        │(with or     │
        │ without     │
        │ tests)      │
        └──────┬──────┘
               │
        ┌──────▼────────┐
        │Scan & Build   │
        └──────┬────────┘
               │
        ┌──────▼────────────────┐
        │Push to ECR?           │
        │(only on push events)  │
        └──────┬────────────────┘
               │
        ┌──────▼──────┐
        │ SUCCESS ✅  │
        └─────────────┘
```

---

## 📊 Environment Configuration Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEV ENVIRONMENT                              │
├─────────────────────────────────────────────────────────────────┤
│ Trigger Branch:     dev                                          │
│ SSM Parameter:      /bluocean/riskgps/dev/ec2/credentials       │
│ ECR Repository:     bluocean-riskgps-dev-backend                │
│                     bluocean-riskgps-dev-frontend               │
│ Run Tests:          ✅ YES                                       │
│ Scan Code:          ✅ YES                                       │
│ Build Images:       ✅ YES                                       │
│ Scan Images:        ✅ YES                                       │
│ Push to ECR:        ✅ YES (push events only)                    │
│ Skip in PR:         No (validation still runs)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   PROD ENVIRONMENT                              │
├─────────────────────────────────────────────────────────────────┤
│ Trigger Branch:     prod                                         │
│ SSM Parameter:      /bluocean/riskgps/prod/ec2/credentials      │
│ ECR Repository:     bluocean-riskgps-prod-backend               │
│                     bluocean-riskgps-prod-frontend              │
│ Run Tests:          ❌ NO (already tested in dev)                │
│ Scan Code:          ✅ YES                                       │
│ Build Images:       ✅ YES                                       │
│ Scan Images:        ✅ YES                                       │
│ Push to ECR:        ✅ YES (push events only)                    │
│ Skip in PR:         No (validation still runs)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Event-Based Pipeline Variations

### Push to Dev
```
Event: git push origin dev
       │
       ├─► determine-environment: dev, run-tests=true
       ├─► get-services: [backend, frontend]
       ├─► run-tests: ✅ Tests execute
       ├─► scan-files: ✅ Code scanned
       ├─► build-scan-push: ✅ Build, scan, push
       └─► workflow-summary: ✅ Success report

Result: Images in dev ECR with version tags
```

### Push to Prod
```
Event: git push origin prod
       │
       ├─► determine-environment: prod, run-tests=false
       ├─► get-services: [backend, frontend]
       ├─► run-tests: ⏭️ SKIPPED
       ├─► scan-files: ✅ Code scanned
       ├─► build-scan-push: ✅ Build, scan, push
       └─► workflow-summary: ✅ Success report

Result: Images in prod ECR with version tags
```

### PR to Dev
```
Event: Create PR targeting dev
       │
       ├─► determine-environment: dev, should-build=false
       ├─► get-services: [backend, frontend]
       ├─► run-tests: ✅ Tests execute (validation)
       ├─► scan-files: ✅ Code scanned (validation)
       ├─► build-scan-push: ⏭️ SKIPPED (no ECR push)
       └─► workflow-summary: ✅ Validation passed

Result: Code validated, ready for review
```

### Manual Dispatch (Dev)
```
Event: User selects "dev" in workflow_dispatch
       │
       ├─► determine-environment: dev, run-tests=true
       ├─► get-services: [backend, frontend]
       ├─► run-tests: ✅ Tests execute
       ├─► scan-files: ✅ Code scanned
       ├─► build-scan-push: ✅ Build, scan, push
       └─► workflow-summary: ✅ Success report

Result: Manual trigger for on-demand builds
```

---

## ❌ Error Handling Flow

```
┌──────────────────────────┐
│ Determine Environment    │
└────────┬─────────────────┘
         │
    ┌────▼──────┐
    │ Valid env?│
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "Branch not supported"
         │
┌────────▼──────────────────┐
│ Get Services from SSM     │
└────────┬─────────────────┘
         │
    ┌────▼──────┐
    │ SSM OK?   │
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "Failed to fetch SSM"
         │
    ┌────▼──────┐
    │ Services  │
    │ found?    │
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "No services found"
         │
┌────────▼──────────────────┐
│ Run Tests (if needed)     │
└────────┬─────────────────┘
         │
    ┌────▼──────┐
    │ Tests OK? │
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "Tests failed"
         │
┌────────▼──────────────────┐
│ Scan Files                │
└────────┬─────────────────┘
         │
    ┌────▼──────────┐
    │ No vulns?     │
    └────┬──┬───────┘
         │ │
      YES│ │FOUND
         │ └─────► ❌ Exit with error
         │        "Vulnerabilities found"
         │
┌────────▼──────────────────┐
│ Build & Push              │
└────────┬─────────────────┘
         │
    ┌────▼──────┐
    │ Build OK? │
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "Build failed"
         │
    ┌────▼──────────┐
    │ Image vulns?  │
    └────┬──┬───────┘
         │ │
      YES│ │FOUND
         │ └─────► ❌ Exit with error
         │        "Image vulnerabilities"
         │
    ┌────▼──────┐
    │ Push OK?  │
    └────┬──┬───┘
         │ │
      YES│ │NO
         │ └─────► ❌ Exit with error
         │        "ECR push failed"
         │
┌────────▼──────────────────┐
│ ✅ SUCCESS                │
│ Workflow Complete         │
└──────────────────────────┘
```

---

## 📱 Image Versioning

```
Version Format: v{MAJOR}.{MINOR}.{RUN_NUMBER}

Example: v1.0.456

Components:
  │
  ├─ v (prefix)
  │  │
  │  ├─ 1 (MAJOR version from SSM: /bluocean/creds/{env})
  │  │
  │  ├─ 0 (MINOR version from SSM: /bluocean/creds/{env})
  │  │
  │  └─ 456 (GitHub Actions run number, auto-incremented)

Sources:
  ┌─────────────────────────────────────────┐
  │ /bluocean/creds/dev                     │
  │ MAJOR_VERSION=1                         │
  │ MINOR_VERSION=0                         │
  └─────────────────────────────────────────┘
                   ↓
  Combined with GitHub run number
                   ↓
  Full tag: v1.0.456

Fallback (if SSM unavailable):
  v1.0.{run_number}
```

---

## 🚀 Deployment Timeline

```
Time    Event                     Status
────────────────────────────────────────
 0:00   Code pushed to dev        ⏳ Pending
 0:05   Determine environment     ✅ dev, run-tests=true
 0:10   Get services              ✅ backend, frontend
 0:15   Run tests (backend)       🏃 In progress
 0:20   Run tests (frontend)      🏃 In progress
 0:30   Both tests complete       ✅ Passed
 0:35   Scan files                🏃 In progress
 0:45   Scan files complete       ✅ No vulns found
 0:50   Build backend image       🏃 In progress
 1:00   Build frontend image      🏃 In progress
 1:10   Both images built         ✅ Complete
 1:15   Scan backend image        🏃 In progress
 1:20   Scan frontend image       🏃 In progress
 1:25   Both images scanned       ✅ No vulns found
 1:30   Tag images                ✅ Complete
 1:35   Push backend to ECR       🏃 In progress
 1:40   Push frontend to ECR      🏃 In progress
 1:45   Both pushed               ✅ Complete
 1:50   Generate summary          ✅ Success report
 1:55   Workflow complete         ✅ SUCCESS

Total Time: ~2 minutes
```

---

## 🎯 Success Indicators

```
✅ WORKFLOW SUCCESS:

Job Status:
  determine-environment  ✅ Success
  get-services           ✅ Success
  run-tests              ✅ Success (dev only)
  scan-files             ✅ Success
  build-scan-push        ✅ Success
  workflow-summary       ✅ Success

GitHub Step Summary:
  ┌──────────────────────────────────────┐
  │ 🎉 Docker Build and Push Summary     │
  ├──────────────────────────────────────┤
  │ Environment: DEV                     │
  │ Branch: dev                          │
  │ Tests Run: true                      │
  │ Status: ✅ SUCCESS                   │
  │                                      │
  │ ✅ Dev Environment: Ran tests,       │
  │    built, scanned, and pushed        │
  │    to DEV ECR repository             │
  └──────────────────────────────────────┘

ECR Result:
  bluocean-riskgps-dev-backend:v1.0.XXX
  bluocean-riskgps-dev-frontend:v1.0.XXX
  ✅ Both images in ECR
```

---

## ❌ Failure Indicators

```
❌ WORKFLOW FAILURE:

Job Status:
  determine-environment  ✅ Success
  get-services           ✅ Success
  run-tests              ❌ FAILED
  scan-files             ⏭️ Skipped (on failure)
  build-scan-push        ⏭️ Skipped (on failure)
  workflow-summary       ❌ FAILED

GitHub Step Summary:
  ┌──────────────────────────────────────┐
  │ ❌ Workflow Failed                   │
  ├──────────────────────────────────────┤
  │ Environment: DEV                     │
  │ Branch: dev                          │
  │ Status: ❌ FAILED                    │
  │                                      │
  │ 🔍 Troubleshooting:                 │
  │ 1. Check logs for error messages    │
  │ 2. Fix issues locally               │
  │ 3. Re-run workflow                  │
  └──────────────────────────────────────┘

Action Required:
  ❌ No images pushed to ECR
  ❌ Pipeline stopped
  ❌ Manual fix required
```

---

## 📋 Quick Command Reference

```
DEV ENVIRONMENT:
  # Push to dev (triggers workflow)
  $ git push origin dev
  
  # Create PR to dev (validates without pushing)
  $ git push origin feature-branch
  $ # Create PR on GitHub UI

PROD ENVIRONMENT:
  # Push to prod (triggers workflow, no tests)
  $ git push origin prod
  
  # Create PR to prod (validates without pushing)
  $ git push origin feature-branch
  $ # Create PR targeting prod on GitHub UI

MANUAL TRIGGER:
  # Go to GitHub Actions
  # Select "Release Workflow"
  # Click "Run workflow"
  # Select environment (dev/prod)
  # Click "Run"
```

---

## ✅ Key Reminders

```
DO ✅:
  ✅ Test locally before pushing
  ✅ Create PRs for code review
  ✅ Wait for workflow to complete
  ✅ Check ECR for pushed images
  ✅ Monitor for vulnerabilities

DON'T ❌:
  ❌ Push directly to prod without testing in dev
  ❌ Ignore test failures
  ❌ Bypass vulnerability scans
  ❌ Force merge failing PRs
  ❌ Use unsupported branch names
```

---

This visual guide completes your workflow documentation package!

For detailed information, refer to:
- WORKFLOW_DOCUMENTATION.md (comprehensive)
- WORKFLOW_QUICK_REFERENCE.md (quick lookup)
- WORKFLOW_BEFORE_AFTER.md (comparison)
- WORKFLOW_UPDATE_SUMMARY.md (implementation details)
