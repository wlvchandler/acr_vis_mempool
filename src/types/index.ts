export interface Block {
    address: number;
    elements: string[];
    isFree: boolean;
}

export interface MemoryStats {
    totalMemory: number;
    usedMemory: number;
    freeMemory: number;
}

// export interface AllocatorState {
//     blocks: Block[];
// }


export interface ElementProps {
    value: string;
    address: number;
    isNew: boolean;
    isFreed: boolean;
}

export interface BlockProps {
    children: React.ReactNode;
    address: number;
    isNew: boolean;
    isCurrent: boolean;
    isFree: boolean;
}

export interface CodeBlockProps {
    code: string;
    highlightedLine: number;
}

export interface ExplanationProps {
    text: string;
}

export interface MemoryStatsProps {
    totalMemory: number;
    usedMemory: number;
    freeMemory: number;
}
