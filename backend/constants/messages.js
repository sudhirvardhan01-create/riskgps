module.exports = {
    USER: {
        NOT_FOUND: 'User not found.',
        CREATED: 'User created successfully.',
        UPDATED: 'User updated successfully.',
        DELETED: 'User deleted successfully.',
        FETCHED: 'Fetched all users successfully.'
    },
    AUTH: {
        UNAUTHORIZED: 'Unauthorized access.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        TOKEN_EXPIRED: 'Authentication token expired.',
        INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
        LOGIN_SUCCESS: 'Login successful.',
        LOGOUT_SUCCESS: 'Logout successful.',
        REFRESH_SUCCESS: 'Access token refreshed successfully.',
        INVALID_ROLE: 'Invalid role specified.'
    },
    GENERAL: {
        SERVER_ERROR: 'Something went wrong. Please try again later.',
        BAD_REQUEST: 'Bad request.',
        INVALID_INPUT: 'Invalid input.',
        REQUIRED_FIELD_MISSING: 'Required field is missing',
    },
    LIBARY: {
        INVALID_STATUS_VALUE: 'Invalid value for status',
        MISSING_ATTRIBUTE_FIELD: 'Each attribute must have meta_data_key_id and values.',
        METADATA_NOT_FOUND: 'MetaData not found for provided key.',
        INVALID_ATTRIBUTE_VALUE: 'Invalid value for one or more attributes.',

    },
    META_DATA: {
        NOT_FOUND: 'Meta data not found.',
        CREATED: 'Meta data created successfully.',
        UPDATED: 'Meta data updated successfully.',
        DELETED: 'Meta data deleted successfully.',
        OBTAINED: 'Obtained all meta data.',
        INVALID_INPUT_TYPE: 'Invalid input_type.',
        INVALID_APPLIES_TO: 'Invalid value for applies_to.'
    },
    PROCESS: {
        NOT_FOUND: 'Process not found.',
        CREATED: 'Process created successfully.',
        UPDATED: 'Process updated successfully.',
        DELETED: 'Process deleted successfully.',
        FETCHED: 'Fetched all process successfully.',
        STATUS_UPDATED: 'Process status updated successfully.',
        IMPORTED_SUCCESSFULLY: "Process imported successfully",
        EXPORTED_SUCCESSFULLY: "Process exported successfully",
        INVALID_STATUS: 'Invalid status provided.',
        INVALID_RELATIONSHIP_TYPE: 'Invalid relationship type for process dependency.',
        MISSING_TARGET_ID: 'Missing or invalid target_process_id.',
        SOURCE_NOT_FOUND: 'Source process not found for dependency.',
        TARGET_NOT_FOUND: 'Target process not found for dependency.',
        MISSING_ATTRIBUTE_FIELD: 'Each attribute must have meta_data_key_id and values.',
        INVALID_ATTRIBUTE_VALUE: 'Invalid value for one or more attributes.',
        METADATA_NOT_FOUND: 'MetaData not found for provided key.',
        PROCESS_NAME_REQUIRED: 'process_name is required.',
        INVALID_VALUE: 'Invalid Value for Status.',
        FETCHED_BY_ID: 'Fetched process by ID successfully.',
        FAILED_TO_IMPORT_PROCESS_CSV:' Failed to import process CSV',
        FAILED_TO_EXPORT_PROCESS_CSV:' Failed to export process CSV',
        FAILED_TO_DOWNLOAD_PROCESS_TEMPLATE_FILE: "Failed to download process template file"


    },
    RISK_SCENARIO: {
        CREATED: 'Risk Scenario created successfully.',
        UPDATED: 'Risk Scenario updated successfully.',
        DELETED: 'Risk Scenario deleted successfully.',
        FETCHED: 'Fetched all risk scenarios successfully.',
        FETCHED_BY_ID: 'Fetched risk scenario by ID successfully.',
        STATUS_UPDATED: 'Risk Scenario status updated successfully.',
        IMPORTED_SUCCESSFULLY: "Risk Scenario imported successfully",
        NOT_FOUND: (id) => `Risk Scenario not found for ID: ${id}`,
        REQUIRED: 'risk_scenario is required.',
        INVALID_STATUS: 'Invalid value for status.',
        INVALID_PROCESS_MAPPING: 'Invalid Process Risk Mapping',
        MISSING_ATTRIBUTE_FIELD: 'Each attribute must have meta_data_key_id and values.',
        METADATA_NOT_FOUND: (id) => `MetaData not found for ID: ${id}`,
        INVALID_ATTRIBUTE_VALUE: (id) => `Invalid Value For Meta Data: ${id}`,
        NOT_FOUND: (id) => `Risk Scenario not found for ID: ${id}`,
        DELETED: 'Risk Scenario deleted successfully.',
        STATUS_UPDATED: 'Risk Scenario status updated successfully.',
        FAILED_TO_EXPORT_RISK_SCENARIO_CSV:' Failed to download risk scenario CSV',
        FAILED_TO_IMPORT_RISK_SCENARIO_CSV:' Failed to import risk scenario CSV',
        FAILED_TO_DOWNLOAD_RISK_SCENARIO_TEMPLATE_FILE: "Failed to download risk scenario template file"


    },
    ASSET: {
        NOT_FOUND: 'Asset not found.',
        CREATED: 'Asset created successfully.',
        UPDATED: 'Asset updated successfully.',
        DELETED: 'Asset deleted successfully.',
        FETCHED: 'Fetched all assets successfully.',
        FETCHED_BY_ID: 'Fetched asset by ID successfully.',
        APPLICATION_NAME_REQUIRED: 'Application name is required in asset data',
        INVALID_PROCESS_MAPPING: 'Invalid Process Asset Mapping',
        NOT_FOUND: (id) => `Asset not found for ID: ${id}`,
        STATUS_UPDATED: 'Asset Scenario status updated successfully.',
        IMPORTED_SUCCESSFULLY: "Assets imported successfully",
        INVALID_HOSTING_VALUE: 'Invalid value for hosting in assets',
        INVALID_HOSTING_FACILITY_VALUE: 'Invalid value for hosting facility in assets',
        INVALID_CLOUD_SERVICE_PROVIDER: 'Invalid value for cloud service provider',
        INVALID_ASSET_CATEGORY: 'Invalid value for asset category',
        FAILED_TO_EXPORT_ASSET_CSV:' Failed to download asset CSV',
        FAILED_TO_IMPORT_ASSET_CSV:' Failed to import asset CSV',
        FAILED_TO_DOWNLOAD_ASSET_TEMPLATE_FILE: "Failed to download asset template file"
        
    },
    MITRE_THREAT_CONTROL: {
        CREATED: 'Mitre ThreatControl Record created successfully.',
        UPDATED: 'Mitre ThreatControl Record updated successfully.',
        DELETED: 'Mitre ThreatControl Record deleted successfully.',
        FETCHED: 'Fetched all Mitre ThreatControl Record successfully.',
        FETCHED_BY_ID: 'Fetched Mitre ThreatControl Record by ID successfully.',
        IMPORTED_SUCCESSFULLY: "Mitre ThreatControl imported successfully",
        NOT_FOUND: 'Mitre threat control record not found.',
        INVALID_PlATFORMS: "Invalid value for platforms",
        INVALID_CIA_MAPPING: "Invalid CIA Mapping",
        FAILED_TO_EXPORT_CSV:' Failed to download Mitre ThreatControl Record CSV',
        FAILED_TO_IMPORT_CSV:' Failed to import Mitre ThreatControl Record CSV',
        FAILED_TO_DOWNLOAD_TEMPLATE_FILE: "Failed to download Mitre ThreatControl Record template file"

    }
};