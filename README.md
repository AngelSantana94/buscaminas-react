💣 Minesweeper React - Ultra Edition
A modern Minesweeper simulator built with React 19 and TypeScript, focusing on performance, accessibility, and testability. The project features a stylized "Retro-Arcade" aesthetic powered by Tailwind CSS 4 and DaisyUI 5 components.

🛠️ Core Technology Stack React 19: Utilizes advanced hooks and efficient rendering patterns.

TypeScript: Implements strict typing for cell logic and board state management.

Tailwind CSS 4 + DaisyUI 5: Modern utility-first styling with high-performance plugins for a responsive and polished UI.

Vitest + React Testing Library: A comprehensive suite of unit and integration tests to ensure reliable game logic.

🧠 Key Logic Features Fisher-Yates Shuffle Algorithm: Implements a true random shuffle for mine placement, ensuring every game session is unique and fair.

Radar System (Mines Nearby): An optimized 3x3 neighborhood scan logic that instantly calculates proximity indicators for every cell.

State Management: Centralized control of the game lifecycle (Start, Win, Game Over) via reactive states.

🧪 Quality Assurance (Testing) The project includes an automated test suite that validates:

Pure Logic: Verification of array shuffling and mathematical radar calculations.

Component Rendering: Ensures the board generates the exact number of cells based on row/column parameters.

Accessibility (A11y): Usage of dynamic alt attributes to make the game understandable for screen reader users.

🚀 Deployment Configured for seamless deployment on GitHub Pages using relative pathing, ensuring all assets (cells, bombs, and flags) load correctly in subfolder environments.