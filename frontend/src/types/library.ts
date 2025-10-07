export interface Item {
    draft: number;
    not_published: number;
    published: number;
    total_count: number;
}

export interface LibraryData {
    asset: Item;
    mitreControls: Item;
    mitreThreats: Item;
    process: Item;
    riskScenario: Item;
}