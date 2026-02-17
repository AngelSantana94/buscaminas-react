import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { shuffle, calculateRadar } from './utils';
import type { ICell } from './Board';

// 1. TEST DE UTILIDADES (Lógica pura)
describe('Minesweeper Core Utilities', () => {
  
  it('Fisher-Yates (shuffle) should randomize the array of cells', () => {
  // Creamos un array de objetos ICell de prueba
  const input: ICell[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    index: i,
    hasMine: false,
    isOpen: false,
    hasFlag: false,
    minesNearby: 0,
  }));

  // Hacemos una copia profunda para comparar después
  const originalOrder = [...input.map(c => c.id)];
  
  const shuffled = shuffle([...input]);
  const shuffledOrder = shuffled.map(c => c.id);
  
  expect(shuffled).toHaveLength(input.length);
  // Verificamos que los IDs ya no estén en el mismo orden 0, 1, 2...
  expect(shuffledOrder).not.toEqual(originalOrder);
});

  it('calculateRadar should return correct numbers', () => {
    const mockCells: ICell[] = Array.from({ length: 9 }, (_, i) => ({
      id: i, index: i, hasMine: i === 4, isOpen: false, hasFlag: false, minesNearby: 0
    }));

    const result = calculateRadar(mockCells, 3, 3);

    expect(result[0].minesNearby).toBe(1);
    expect(result[1].minesNearby).toBe(1);
    expect(result[2].minesNearby).toBe(1);
    expect(result[3].minesNearby).toBe(1);
    expect(result[5].minesNearby).toBe(1);
    expect(result[6].minesNearby).toBe(1);
    expect(result[7].minesNearby).toBe(1);
    expect(result[8].minesNearby).toBe(1);
  });
});

describe('Board Component Rendering', () => {
  it('should render the correct number of cells', () => {
    const rows = 5;
    const cols = 5;
    
    render(
      <Board 
        rows={rows} 
        cols={cols} 
        level={1} 
        onGameOver={() => {}} 
        onWin={() => {}} 
        resetKey={0} 
      />
    );

    const cells = screen.getAllByRole('img');
    expect(cells.length).toBe(rows * cols);
  });

  it('should show the correct level in the header', () => {
    render(
      <Board rows={5} cols={5} level={2} onGameOver={() => {}} onWin={() => {}} resetKey={0} />
    );
    expect(screen.getByText(/NIVEL 2/i)).toBeDefined();
  });
});