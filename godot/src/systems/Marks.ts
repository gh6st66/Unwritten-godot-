

export interface MarkDef {
    id: string;
    name: string;
    description: string;
}

// This is a placeholder implementation to fix module resolution errors.
export const getMarkDef = (id: string): MarkDef => {
    // In a real implementation, this would look up mark definitions from a data source.
    return {
        id,
        name: `Mark of ${id.charAt(0).toUpperCase() + id.slice(1)}`,
        description: `This is a placeholder description for the '${id}' mark.`,
    };
};
