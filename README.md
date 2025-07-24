# RiskGPS Project

## Overview

RiskGPS is a web application composed of a frontend, backend, PostgreSQL database, and an Nginx reverse proxy, orchestrated using Docker Compose and deployed to an AWS EC2 instance via GitHub Actions. This README provides detailed instructions on the project's setup, the GitHub Actions CI/CD pipelines, Docker Compose dynamic handling, and the deployment process.

## Project Structure

```
.
├── .env.example              # Example environment variables file
├── .github/                  # GitHub Actions workflows
│   ├── workflows/
│   │   ├── deploy-to-ec2.yml           # Workflow for deploying to EC2
│   │   └── docker-build-and-deploy.yml # Workflow for building, scanning, and pushing Docker images
├── backend/                  # Backend service source code
├── frontend/                 # Frontend service source code
├── nginx.conf                # Nginx configuration for reverse proxy
├── docker-compose.yml        # Docker Compose configuration for production
├── docker-compose-prod.yml   # Alternative Docker Compose configuration (if applicable)
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

## Prerequisites

Before running the project, ensure the following dependencies and configurations are manually set up:

- **Docker**: For building and running containers.
- **Docker Compose**: For orchestrating multi-container services.
- **AWS CLI**: For interacting with AWS services (e.g., ECR, SSM).
- **GitHub Actions**: Configured with appropriate AWS IAM roles and permissions.
- **AWS Account**: With access to EC2, ECR, and SSM for storing credentials.
- **Node.js** (for local frontend development): Version 18 or 20 as specified in workflows.
- **jq**: For parsing JSON in GitHub Actions workflows.

### AWS-Specific Prerequisites

1. **IAM OIDC Provider for GitHub Actions**:
   - Open the AWS IAM console.
   - Navigate to **Identity providers** in the left menu.
   - Choose **Add provider** and select **OpenID Connect** as the **Provider type**.
   - Enter the **Provider URL**: `https://token.actions.githubusercontent.com`.
   - Click **Get thumbprint** to verify the server certificate (see [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html#manage-oidc-provider-console) for details).
   - For **Audience**, enter `sts.amazonaws.com` to allow AWS STS API calls.
   - Optionally, add tags to organize your identity providers.
   - Click **Add provider** to create the OIDC provider.

2. **IAM Role for GitHub Actions**:
   - In the IAM console, select the newly created OIDC provider and choose **Assign role**.
   - Click **Create a new role** and select **Next**.
   - Ensure **Web identity** is selected as the trusted entity, with the OIDC provider populated in the **Identity provider** field.
   - In the **Audience** list, select `sts.amazonaws.com`, then click **Next**.
   - On the **Permissions** page, click **Next**. (No permissions are added initially; for additional actions like AWS CodeBuild, refer to [AWS CI/CD documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) or [least privilege policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)).
   - On the **Tags** page, add tags to organize the role, then click **Next: Review**.
   - Enter a role name, e.g., `GithubActionRole` (used as `arn:aws:iam::739962689681:role/GithubActionRole` in this project). Optionally, add a description.
   - Click **Create role** to finalize.

3. **S3 Bucket for Terraform Backend**:
   - Create an S3 bucket to store Terraform state files if using Terraform for infrastructure management.
   - Ensure the bucket is configured with versioning and appropriate access policies.

4. **AWS Systems Manager Parameter Store**:
   - Store sensitive data (e.g., secrets, API keys) as secure strings in AWS SSM Parameter Store:
     - `/bluocean/ec2/credentials`: Contains EC2 public IP, PEM key, and ECR repository URLs.
     - `/bluocean/creds`: Contains application credentials, including `MAJOR_VERSION`, `MINOR_VERSION`, and database credentials.

### GitHub Secrets

To enable GitHub Actions to interact with AWS and the EC2 instance, configure the following secrets in your GitHub repository:

1. Navigate to your repository on GitHub.
2. Go to **Settings** > **Secrets and variables** > **Actions** > **Secrets**.
3. Add the following repository secrets:
   - `AWS_REGION`: Set to `us-east-1`.
   - `SSM_EC2_CREDENTIALS`: Set to `/bluocean/ec2/credentials`.
   - `SSM_CREDS`: Set to `/bluocean/creds`.
   - `AWS_ACCOUNT_ID`: Set to your AWS account ID (e.g., `739962689681`).
   - `EC2_SSH_USER`: Set to `ubuntu`.
   - `EC2_DEST_DIR`: Set to `/home/ubuntu/riskgps`.

These secrets are used in the `deploy-to-ec2.yml` and `docker-build-and-deploy.yml` workflows to authenticate with AWS and deploy to the EC2 instance.

## Environment Variables

The project relies on environment variables for configuration. Create a `.env` file based on `.env.example` with the following variables:

- `FRONTEND_IMAGE_url`: URL of the frontend Docker image in AWS ECR.
- `BACKEND_IMAGE_url`: URL of the backend Docker image in AWS ECR.
- `IMAGE_TAG`: Docker image tag (set automatically by the pipeline).
- `POSTGRES_USER`: PostgreSQL database user.
- `POSTGRES_PASSWORD`: PostgreSQL database password.
- `POSTGRES_DB`: PostgreSQL database name.
- `DATABASE_URL`: Connection string for the backend to connect to the database.

## Docker Compose Configuration

The `docker-compose.yml` file defines the services, networks, and volumes for the production environment. Below is an overview of the services and their dynamic handling:

### Services

1. **frontend**:
   - **Image**: Dynamically pulled from AWS ECR using `${FRONTEND_IMAGE_url}:${IMAGE_TAG}`.
   - **Port**: Exposes port 3000 internally for Nginx communication.
   - **Dependencies**: Depends on the `backend` service.
   - **Restart Policy**: `unless-stopped`.

2. **backend**:
   - **Image**: Dynamically pulled from AWS ECR using `${BACKEND_IMAGE_url}:${IMAGE_TAG}`.
   - **Port**: Exposes port 8000 internally for Nginx communication.
   - **Dependencies**: Depends on the `db` service.
   - **Environment**: Uses `DATABASE_URL` for database connectivity.
   - **Restart Policy**: `unless-stopped`.

3. **db**:
   - **Image**: `postgres:15`.
   - **Port**: Exposes port 5432 internally for backend communication.
   - **Environment**: Configured with `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
   - **Volumes**: Persists data using the `pgdata` volume.
   - **Restart Policy**: `unless-stopped`.

4. **nginx**:
   - **Image**: `nginx:latest`.
   - **Port**: Maps port 80 on the host to port 80 in the container for public access.
   - **Volumes**: Mounts `nginx.conf` for reverse proxy configuration.
   - **Dependencies**: Depends on `frontend` and `backend` services.
   - **Restart Policy**: `unless-stopped`.

### Networks and Volumes

- **Network**: All services are connected to the `webnet` bridge network for internal communication.
- **Volume**: The `pgdata` volume persists PostgreSQL data.

### Dynamic Handling in Docker Compose

The `docker-compose.yml` file uses environment variables (`${FRONTEND_IMAGE_url}`, `${BACKEND_IMAGE_url}`, `${IMAGE_TAG}`) to dynamically pull the correct Docker images from AWS ECR. These variables are set during the deployment process by the `deploy-to-ec2.yml` workflow, which:

1. Retrieves the latest image tags from ECR.
2. Creates a `.env` file with the appropriate image URLs and tag.
3. Copies the `.env` file, along with `docker-compose.yml` and `nginx.conf`, to the EC2 instance.
4. Runs `docker-compose up -d` to start the services with the dynamically configured images.

This approach ensures that the latest images are always used without hardcoding repository URLs or tags in the `docker-compose.yml` file.

### Running Docker Compose

To start the services on the EC2 instance (handled automatically by the pipeline):

```bash
cd /home/ubuntu/riskgps
docker-compose -f docker-compose.yml up -d
```

To stop the services:

```bash
cd /home/ubuntu/riskgps
docker-compose -f docker-compose.yml down
```

## GitHub Actions CI/CD Pipelines

The project uses two GitHub Actions workflows for continuous integration and deployment. Below is an explanation of their triggers, steps, and how they interact with Docker Compose.

### 1. `docker-build-and-deploy.yml`

**Trigger**:
- **Pull Request**: Runs on pull requests to the `main` branch when changes are made to `frontend/` or `backend/` directories.
- **Manual Trigger**: Can be triggered manually via the GitHub Actions **Workflow Dispatch** option.

**Workflow Steps**:

1. **Lint (Frontend)**:
   - Runs ESLint on the frontend code to ensure code quality.
   - Uses Node.js 18 and caches npm dependencies.

2. **Test (Frontend)**:
   - Runs unit tests on the frontend code.
   - Depends on the `lint` job to ensure code quality before testing.

3. **Build (Frontend)**:
   - Builds the frontend project using `npm run build`.
   - Saves the build artifact for potential use in later steps.
   - Depends on the `test` job.

4. **Get Services**:
   - Retrieves ECR repository URLs from AWS SSM (`/bluocean/ec2/credentials`).
   - Outputs a list of services (`frontend`, `backend`) for matrix jobs.

5. **Scan Files**:
   - Uses Trivy to scan source files for vulnerabilities (CRITICAL and HIGH severity).
   - Runs for each service (`frontend`, `backend`) in a matrix strategy.

6. **Build, Scan, and Push**:
   - Builds Docker images for each service using their respective `Dockerfile`.
   - Scans the built images with Trivy for vulnerabilities.
   - Tags images with `v<MAJOR_VERSION>.<MINOR_VERSION>.<github.run_number>` (e.g., `v1.0.123`).
   - Pushes images to AWS ECR.
   - Retrieves `MAJOR_VERSION` and `MINOR_VERSION` from SSM (`/bluocean/creds`).

**Dependencies**:
- AWS IAM role (`GithubActionRole`) with permissions for ECR and SSM.
- `jq` for JSON parsing.
- Node.js 20 for scanning dependencies.
- Docker Buildx for building images.

### 2. `deploy-to-ec2.yml`

**Trigger**:
- **Push to Main**: Runs on pushes to the `main` branch.
- **Manual Trigger**: Can be triggered manually via the GitHub Actions **Workflow Dispatch** option.

**Workflow Steps**:

1. **Checkout Code**:
   - Clones the repository to access project files.

2. **Install jq**:
   - Installs `jq` for parsing SSM parameters.

3. **Configure AWS Credentials**:
   - Assumes the `GithubActionRole` IAM role for AWS access using OIDC.

4. **Get EC2 and ECR Credentials**:
   - Retrieves EC2 public IP, PEM key, and ECR repository URLs from SSM (`/bluocean/ec2/credentials`).
   - Sets environment variables (`PUBLIC_IP`, `FRONTEND_IMAGE_url`, `BACKEND_IMAGE_url`, `ECR_REGISTRY`).

5. **Get Application Credentials**:
   - Retrieves application credentials from SSM (`/bluocean/creds`) and writes them to `.env`.

6. **Get Latest Image Tag**:
   - Queries ECR for the latest image tags for `riskgps-frontend` and `riskgps-backend`.
   - Ensures tags match to avoid version mismatches.

7. **Create .env File**:
   - Generates a `.env` file with `FRONTEND_IMAGE_url`, `BACKEND_IMAGE_url`, and `IMAGE_TAG`.

8. **Create Destination Directory on EC2**:
   - Creates the deployment directory (`/home/ubuntu/riskgps`) on the EC2 instance via SSH.

9. **Copy Files to EC2**:
   - Transfers `nginx.conf`, `docker-compose.yml`, and `.env` to the EC2 instance using `scp`.
   - Files are copied to `/home/ubuntu/riskgps`.

10. **Authenticate Docker with ECR**:
    - Logs into ECR on the EC2 instance using AWS credentials to allow pulling images.

11. **Stop Existing Services**:
    - Stops and removes existing Docker Compose services (if any) to ensure a clean deployment.

12. **Run Docker Compose**:
    - Executes `docker-compose up -d` in `/home/ubuntu/riskgps` to start the services with the latest images.

13. **Clean Up**:
    - Removes the SSH key file from the runner to maintain security.

**Dependencies**:
- AWS IAM role (`GithubActionRole`) with permissions for EC2, ECR, and SSM.
- SSH access to the EC2 instance (`ubuntu` user).
- `jq` for JSON parsing.

### Workflow and Docker Compose Integration

The pipelines and Docker Compose work together as follows:

1. **Build and Push Images**:
   - The `docker-build-and-deploy.yml` workflow builds and pushes Docker images to ECR with a dynamic tag (`v<MAJOR_VERSION>.<MINOR_VERSION>.<github.run_number>`).
   - This ensures that the latest code changes are packaged into images and stored in ECR.

2. **Dynamic Configuration**:
   - The `deploy-to-ec2.yml` workflow retrieves the latest image tags and repository URLs from ECR.
   - It creates a `.env` file with these values, which is used by `docker-compose.yml` to pull the correct images.

3. **Deployment to EC2**:
   - The workflow copies `docker-compose.yml`, `nginx.conf`, and `.env` to the EC2 instance.
   - Docker Compose dynamically pulls the specified images and starts the services, ensuring zero-downtime updates.

## Setup Instructions

1. **Configure AWS**:
   - Set up an EC2 instance with Docker and Docker Compose installed.
   - Configure the IAM OIDC Provider and `GithubActionRole` as described in the prerequisites.
   - Store EC2 credentials and ECR repository URLs in SSM (`/bluocean/ec2/credentials`).
   - Store application credentials in SSM (`/bluocean/creds`).
   - Create an S3 bucket for Terraform state if applicable.

2. **Set Up GitHub Secrets**:
   - Add the following secrets in your GitHub repository:
     - `AWS_REGION`: `us-east-1`
     - `SSM_EC2_CREDENTIALS`: `/bluocean/ec2/credentials`
     - `SSM_CREDS`: `/bluocean/creds`
     - `AWS_ACCOUNT_ID`: Your AWS account ID (e.g., `739962689681`)
     - `EC2_SSH_USER`: `ubuntu`
     - `EC2_DEST_DIR`: `/home/ubuntu/riskgps`

3. **Prepare the Project**:
   - Clone the repository and ensure `.env.example` is populated with appropriate values.
   - Create `nginx.conf` for reverse proxy configuration.

4. **Run Locally (Optional)**:
   - Create a `.env` file based on `.env.example`.
   - Run `docker-compose up -d` to start the services locally.

5. **Trigger CI/CD**:
   - Push changes to the `main` branch to trigger `deploy-to-ec2.yml`.
   - Create a pull request with changes to `frontend/` or `backend/` to trigger `docker-build-and-deploy.yml`.
   - Monitor the GitHub Actions runs for build and deployment status.

## Troubleshooting

- **Pipeline Failures**:
  - Check GitHub Actions logs for errors in linting, testing, or Trivy scans.
  - Verify AWS credentials, IAM role permissions, and OIDC provider configuration.
  - Ensure SSM parameters are correctly configured and accessible.

- **Docker Compose Issues**:
  - Verify that environment variables in `.env` are correctly set.
  - Check Docker logs (`docker-compose logs`) for service-specific errors.
  - Ensure the EC2 instance has sufficient resources (CPU, memory, disk).

- **ECR Authentication**:
  - Confirm that the EC2 instance has AWS CLI installed and configured.
  - Validate the ECR login command in the `deploy-to-ec2.yml` workflow.

- **SSH Issues**:
  - Ensure the PEM key in SSM is valid and has the correct permissions (`chmod 600`).
  - Verify that the EC2 security group allows SSH access (port 22).

## Contributing

To contribute to the project:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request to the `main` branch.

Ensure all tests pass and Trivy scans report no CRITICAL or HIGH vulnerabilities.

