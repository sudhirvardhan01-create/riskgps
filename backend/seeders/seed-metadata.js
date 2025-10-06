"use strict";

module.exports = {
  async up(queryInterface) {
    const {
      Process,
      MetaData,
      ProcessAttribute,
      Asset,
      AssetAttribute,
      RiskScenario,
      RiskScenarioAttribute,
      ProcessRiskScenarioMappings,
    } = require("../models");

    const now = new Date();

    const seedMetadatas = [
      {
        name: "Severity",
        label: "Severity",
        input_type: "multiselect",
        supported_values: ["High", "Medium", "Low"],
        applies_to: ["all"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Asset Category",
        label: "Asset Category",
        input_type: "select",
        supported_values: [
          "Windows",
          "Linux",
          "Office 365",
          "Azure AD",
          "Google Workspace",
          "SaaS",
          "IaaS",
          "Network Devices",
          "Containers",
          "Android",
          "iOS",
          "macOS",
        ],
        applies_to: [],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Industry",
        label: "Industry",
        input_type: "text",
        supported_values: ["Healthcare", "Banking", "Government"],
        applies_to: ["all"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Domain",
        label: "Domain",
        input_type: "select",
        supported_values: ["NIST", "NIST CSF", "GDPR", "MITRE", "ISO", "SOC 2"],
        applies_to: ["all"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "CIA Mapping",
        label: "CIA Mapping",
        input_type: "text",
        supported_values: [
          '{"label":"Confidentiality","value":"C"}',
          '{"label":"Integrity","value":"I"}',
          '{"label":"Availability","value":"A"}',
        ],
        applies_to: ["risk_scenario", "threat"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Control Framework",
        label: "Control Framework",
        input_type: "text",
        supported_values: ["NIST", "ATLAS", "CRI"],
        applies_to: ["control"],
        description: "",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Threat Bundle",
        label: "Threat Bundle",
        input_type: "text",
        supported_values: ["TOP10", "FSI"],
        applies_to: ["threat"],
        description: "",
        created_at: now,
        updated_at: now,
      },
    ];

    const seeedProcesses = [
      {
        "process_name": "Account Management Process",
        "process_description": "Covers the creation, maintenance, and updating of customer account information, including personal details, account settings, and service preferences. Ensures data integrity, compliance, and customer access to account management services.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Electronic Banking",
        "process_description": "Provides customers with digital access to their accounts via online and mobile platforms, enabling balance inquiries, fund transfers, bill payments, and account services. Ensures availability, confidentiality, and integrity of digital transactions.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "ACH",
        "process_description": "Handles Automated Clearing House (ACH) transactions, enabling batch electronic funds transfers such as payroll, vendor payments, and bill collections. Ensures timely settlement, accuracy, and compliance with regulatory standards.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Wire Transfer",
        "process_description": "Manages real-time electronic transfer of funds between banks and financial institutions, both domestic and international. Ensures high-value transactions are processed securely, accurately, and in compliance with financial regulations.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "ATM Management",
        "process_description": "Oversees the operation of Automated Teller Machines, providing customers with cash withdrawal, deposit, balance inquiry, and fund transfer services. Ensures availability, security, and accuracy of ATM transactions.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Fraud Monitoring",
        "process_description": "Involves detection, analysis, and prevention of fraudulent activities across customer accounts and transactions. Uses monitoring tools and models to identify suspicious activity, mitigate financial losses, and maintain compliance.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "KYC",
        "process_description": "Know Your Customer (KYC) process involves collecting, verifying, and maintaining customer identification data to comply with anti-money laundering (AML) and counter-terrorist financing (CTF) regulations. Ensures only verified customers gain access to financial products and services.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Loan Origination",
        "process_description": "Covers the end-to-end process of initiating and approving new customer loans, including application intake, eligibility checks, credit review, and approval. Ensures accurate assessments, compliance, and customer satisfaction.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Underwriting",
        "process_description": "Involves the use of models, data, and policies to evaluate customer risk and determine creditworthiness for lending decisions. Ensures consistent, fair, and compliant credit evaluations.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      },
      {
        "process_name": "Loan Servicing",
        "process_description": "Covers ongoing management of active loans, including repayment tracking, interest calculation, customer inquiries, and delinquency management. Ensures accuracy, compliance, and customer satisfaction throughout the loan lifecycle.",
        "senior_executive__owner_name": "",
        "enior_executive__owner_email": "",
        "operations__owner_name": "",
        "operations__owner_email": "",
        "technology_owner_name": "",
        "technology_owner_email": "",
        "organizational_revenue_impact_percentage": null,
        "financial_materiality": "",
        "third_party_involvement": null,
        "users_customers": "",
        "regulatory_and_compliance": null,
        "criticality_of_data_processed": "",
        "data_processed": null,
        "status": "published",
        "created_at": "2025-10-03T08:22:48.841Z",
        "updated_at": "2025-10-03T08:22:48.841Z",
        "industry": [
          "Healthcare",
          "Banking",
          "Government"
        ]
      }
    ];

    const seedAssets = [
      {
        application_name: "Customer Database",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "SaaS",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        application_name: "Banking Application",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "Windows",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        application_name: "Payment Rails",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "SaaS",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        application_name: "Fraud Application",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "Windows",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        application_name: "Loan Application",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "SaaS",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        application_name: "Underwriting Application",
        application_owner: "",
        application_it_owner: "",
        is_third_party_management: null,
        third_party_name: "",
        third_party_location: "",
        hosting: "",
        hosting_facility: "",
        cloud_service_provider: [],
        geographic_location: "",
        has_redundancy: null,
        databases: "",
        has_network_segmentation: null,
        network_name: "",
        asset_category: "Windows",
        asset_name: "",
        asset_description: "",
        status: "published",
        created_at: now,
        updated_at: now,
      },
    ];

    const seedRiskScenarios = [
      {
        "risk_scenario": "Customer account data is exposed",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of customer account data could compromise confidentiality.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Fraud Monitoring",
          "Account Management Process"
        ]
      },
      {
        "risk_scenario": "Customer account data is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of customer account data is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "KYC",
          "Loan Servicing"
        ]
      },
      {
        "risk_scenario": "Customer accounts cannot be managed for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged unavailability of customer account management services.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Origination",
          "Wire Transfer"
        ]
      },
      {
        "risk_scenario": "Electronic banking accounts are exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of electronic banking account data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Origination",
          "Electronic Banking"
        ]
      },
      {
        "risk_scenario": "Electronic banking accounts are corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of electronic banking accounts is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "ATM Management"
        ]
      },
      {
        "risk_scenario": "Electronic banking applicaton cannot be accessed for 4 hours.",
        "risk_description": "",
        "risk_statement": "Short-term unavailability of online banking services.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "KYC"
        ]
      },
      {
        "risk_scenario": "Electronic banking applicaton cannot be accessed for 1 day.",
        "risk_description": "",
        "risk_statement": "One-day outage of online banking platform.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Wire Transfer",
          "ACH"
        ]
      },
      {
        "risk_scenario": "Electronic banking applicaton cannot be accessed for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged outage of online banking platform.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ATM Management",
          "Wire Transfer"
        ]
      },
      {
        "risk_scenario": "Payments data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of payments data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Origination",
          "KYC"
        ]
      },
      {
        "risk_scenario": "Payment data is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of payment transaction data is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Origination",
          "ACH"
        ]
      },
      {
        "risk_scenario": "ACH payments cannot be completed for 4 hours.",
        "risk_description": "",
        "risk_statement": "Temporary outage of ACH payment processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ACH",
          "Loan Origination"
        ]
      },
      {
        "risk_scenario": "ACH payments cannot be completed for 1 day.",
        "risk_description": "",
        "risk_statement": "One-day outage of ACH payment processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ACH",
          "Fraud Monitoring"
        ]
      },
      {
        "risk_scenario": "ACH payments cannot be completed for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged outage of ACH payment processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Servicing",
          "KYC"
        ]
      },
      {
        "risk_scenario": "Wire transfer data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of wire transfer data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Wire Transfer",
          "Account Management Process"
        ]
      },
      {
        "risk_scenario": "Wire transfer is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of wire transfer data is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "KYC",
          "Electronic Banking"
        ]
      },
      {
        "risk_scenario": "Wire transfers cannot be completed for 4 hours.",
        "risk_description": "",
        "risk_statement": "Temporary outage of wire transfer processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Electronic Banking",
          "Fraud Monitoring"
        ]
      },
      {
        "risk_scenario": "Wire transfers cannot be completed for 1 day.",
        "risk_description": "",
        "risk_statement": "One-day outage of wire transfer processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Fraud Monitoring",
          "Underwriting"
        ]
      },
      {
        "risk_scenario": "Wire transfers cannot be completed for 1 week.",
        "risk_description": "",
        "risk_statement": "Extended outage of wire transfer processing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Electronic Banking",
          "Wire Transfer"
        ]
      },
      {
        "risk_scenario": "ATM data is exposed",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of ATM transaction data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ATM Management",
          "KYC"
        ]
      },
      {
        "risk_scenario": "ATM data is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of ATM transaction data is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "Electronic Banking"
        ]
      },
      {
        "risk_scenario": "ATMs are not available for 1 day.",
        "risk_description": "",
        "risk_statement": "Outage of ATM services for 24 hours.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Origination",
          "Underwriting"
        ]
      },
      {
        "risk_scenario": "ATMs are not available for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged outage of ATM services.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "Loan Origination"
        ]
      },
      {
        "risk_scenario": "Fraud monitoring data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of fraud monitoring data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "Electronic Banking"
        ]
      },
      {
        "risk_scenario": "Fraud monitoring is not available for 1 week.",
        "risk_description": "",
        "risk_statement": "Extended unavailability of fraud monitoring systems.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "KYC",
          "Fraud Monitoring"
        ]
      },
      {
        "risk_scenario": "KYC data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of customer KYC data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Fraud Monitoring",
          "Loan Servicing"
        ]
      },
      {
        "risk_scenario": "KYC data is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of KYC records is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Underwriting",
          "Loan Origination"
        ]
      },
      {
        "risk_scenario": "KYC is not able to process new applications for 1 week.",
        "risk_description": "",
        "risk_statement": "KYC services unavailable for one week.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ATM Management",
          "KYC"
        ]
      },
      {
        "risk_scenario": "Customer loan data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of customer loan data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Wire Transfer",
          "ACH"
        ]
      },
      {
        "risk_scenario": "Loans cannot be originated for 4 hours.",
        "risk_description": "",
        "risk_statement": "Temporary disruption in loan origination.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Loan Servicing",
          "Loan Origination"
        ]
      },
      {
        "risk_scenario": "Loans cannot be originated for 1 day.",
        "risk_description": "",
        "risk_statement": "One-day outage in loan origination.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Wire Transfer",
          "Fraud Monitoring"
        ]
      },
      {
        "risk_scenario": "Loans cannot be originated for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged disruption in loan origination.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "KYC",
          "Account Management Process"
        ]
      },
      {
        "risk_scenario": "Customer underwriting data is exposed.",
        "risk_description": "",
        "risk_statement": "Unauthorized disclosure of underwriting data.",
        "cia_mapping": [
          "C"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Electronic Banking",
          "KYC"
        ]
      },
      {
        "risk_scenario": "Underwriting models are corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of underwriting data is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "ATM Management",
          "Wire Transfer"
        ]
      },
      {
        "risk_scenario": "Underwriting cannot take place for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged disruption of underwriting processes.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "Electronic Banking"
        ]
      },
      {
        "risk_scenario": "Customer loan data is corrupted and no longer accurate.",
        "risk_description": "",
        "risk_statement": "Integrity of customer loan records is compromised.",
        "cia_mapping": [
          "I"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Fraud Monitoring",
          "Wire Transfer"
        ]
      },
      {
        "risk_scenario": "Loans cannot be serviced for 1 day.",
        "risk_description": "",
        "risk_statement": "One-day disruption in loan servicing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Electronic Banking",
          "Account Management Process"
        ]
      },
      {
        "risk_scenario": "Loans cannot be serviced for 1 week.",
        "risk_description": "",
        "risk_statement": "Prolonged disruption in loan servicing.",
        "cia_mapping": [
          "A"
        ],
        "status": "published",
        "risk_field_1": "",
        "risk_field_2": "",
        "created_at": "2025-10-03T08:27:23.097Z",
        "updated_at": "2025-10-03T08:27:23.097Z",
        "related_process": [
          "Account Management Process",
          "ATM Management"
        ]
      }
    ];

    await queryInterface.bulkInsert("library_meta_datas", seedMetadatas);

    /* Application logic to seed Library Process and Process Attributes  */

    const industryMetadata = await MetaData.findOne({
      where: { name: "Industry" },
    });
    if (!industryMetadata) throw new Error("Industry metadata not found");

    const processAttributes = [];
    for (const process of seeedProcesses) {
      const allowedProcessFields = [
        "process_name",
        "process_description",
        "senior_executive__owner_name",
        "enior_executive__owner_email",
        "operations__owner_name",
        "operations__owner_email",
        "technology_owner_name",
        "technology_owner_email",
        "organizational_revenue_impact_percentage",
        "financial_materiality",
        "third_party_involvement",
        "users_customers",
        "regulatory_and_compliance",
        "criticality_of_data_processed",
        "data_processed",
        "status",
        "created_at",
        "updated_at",
      ];

      const processData = {};
      for (const key of allowedProcessFields) {
        if (process[key] !== undefined) processData[key] = process[key];
      }
      // Insert the process
      const createdProcess = await Process.create(processData);

      for (let i = 0; i < process.industry?.length; i++) {
        const value = process.industry ?? [];
        const validIndustryValues = value.filter((v) =>
          supportedValues.includes(v)
        );

        if (validIndustryValues.length > 0) {
          processAttributes.push({
            process_id: createdProcess.id,
            meta_data_id: industryMetadata.id,
            value: validIndustryValues,
            created_at: now,
            updated_at: now,
          });
        } else {
          console.log("invalid value for industry for process:", process.process_name)
        }
      }
    }
    await ProcessAttribute.bulkCreate(processAttributes);

    /* Application logic to seed Library Assets and Asset Attributes  */

    await queryInterface.bulkInsert("library_assets", seedAssets);

    /* Application logic to seed Library Risk Scenarios, risk Scenarios Related processes and risk scenario attributes */

    const processRiskScenarioMappings = [];
    for (const risk of seedRiskScenarios) {
      const allowedRiskScenarioFields = [
        "risk_scenario",
        "risk_description",
        "risk_statement",
        "cia_mapping",
        "status",
        "risk_field_1",
        "risk_field_2",
        "created_at",
        "updated_at",
      ];

      const riskData = {};
      for (const key of allowedRiskScenarioFields) {
        if (risk[key] !== undefined) riskData[key] = risk[key];
      }
      const createdRisk = await RiskScenario.create(riskData);

      // Loop over all related process names
      if (risk.related_process && Array.isArray(risk.related_process)) {
        for (const processName of risk.related_process) {
          const process = await Process.findOne({
            where: { process_name: processName },
          });

          if (!process) {
            console.log(`Process not found: ${processName}`);
            continue;
          }

          processRiskScenarioMappings.push({
            process_id: process.id,
            risk_scenario_id: createdRisk.id,
          });
        }
      }
    }

    // Insert all process-risk mappings at once
    await ProcessRiskScenarioMappings.bulkCreate(processRiskScenarioMappings);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("library_risk_scenarios", null, {});
    await queryInterface.bulkDelete(
      "library_process_risk_scenario_mapping",
      null,
      {}
    );
    await queryInterface.bulkDelete(
      "library_attributes_risk_scenario_mapping",
      null,
      {}
    );
    await queryInterface.bulkDelete("library_assets", null, {});
    await queryInterface.bulkDelete(
      "library_attributes_asset_mapping",
      null,
      {}
    );
    await queryInterface.bulkDelete("library_processes", null, {});
    await queryInterface.bulkDelete(
      "library_attributes_process_mapping",
      null,
      {}
    );
    await queryInterface.bulkDelete("library_meta_datas", null, {});
  },
};
