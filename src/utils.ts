import type { ICell } from "./Board.tsx"; 

export function shuffle(list: ICell[]): ICell[] {
    let shuffledList: ICell[] = [];
    let originalList = [...list]; 

    while (originalList.length > 0) {
        let position = Math.floor(Math.random() * originalList.length);
        let element = originalList.splice(position, 1)[0];
        shuffledList.unshift(element);
    }

    return shuffledList.map((cell, idx) => ({ ...cell, index: idx }));
}

export function calculateRadar(cells: ICell[], rows: number, cols: number): ICell[] {
    const updatedCells = [...cells];

    updatedCells.forEach((cell) => {
        if (cell.hasMine) {
            const row = Math.floor(cell.index / cols);
            const col = cell.index % cols;

            for (let df = -1; df <= 1; df++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (df === 0 && dc === 0) continue; 

                    const neighborRow = row + df;
                    const neighborCol = col + dc;

                    if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                        const neighborIndex = neighborRow * cols + neighborCol;
                        
                        if (!updatedCells[neighborIndex].hasMine) {
                            updatedCells[neighborIndex] = {
                                ...updatedCells[neighborIndex],
                                minesNearby: updatedCells[neighborIndex].minesNearby + 1
                            };
                        }
                    }
                }
            }
        }
    });

    return updatedCells;
}