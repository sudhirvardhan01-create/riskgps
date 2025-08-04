export interface MetaData {
    id?: number; //option if the Meta data is not yet created yet
    name: string;
    label: string;
    input_type?: string;
    supported_values: string[];
    applies_to?: string[];
    description?: string;
}