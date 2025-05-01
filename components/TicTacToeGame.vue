<template>
    <section class="tic-tac-toe-minimal">
      <div class="game-container-minimal">
        <div class="game-status-minimal">
          <Transition name="slide-fade-minimal" mode="out-in">
              <span v-if="winner === 'X'" key="win-x" class="status-win-minimal">You Win! ✨</span>
              <span v-else-if="winner === 'O'" key="win-o" class="status-lose-minimal">Machine Wins! 👾</span>
              <span v-else-if="winner === 'Draw'" key="draw" class="status-draw-minimal">Draw! 🤷‍♂️</span>
              <span v-else-if="currentPlayer === 'X'" key="turn-x" class="status-turn-minimal">Your turn</span>
              <span v-else key="turn-o" class="status-thinking-minimal">Machine thinking...</span>
          </Transition>
        </div>
  
        <div class="board-lines-container">
          <div class="board-line vertical line-1"></div>
          <div class="board-line vertical line-2"></div>
          <div class="board-line horizontal line-1"></div>
          <div class="board-line horizontal line-2"></div>
  
          <div ref="boardElement" class="game-board-minimal">
            <div
              v-for="(cell, index) in board"
              :key="index"
              :data-index="index"
              class="cell-minimal"
              :class="{ 'winning-cell-minimal': winningLine && winningLine.includes(index) }"
              @click="handleCellClick(index)"
            >
              <Transition
                :css="false"
                @enter="onEnterMark"
              >
                 <span v-if="cell" :key="cell" :class="{'mark-x': cell === 'X', 'mark-o': cell === 'O'}">{{ cell }}</span>
              </Transition>
            </div>
          </div>
        </div>
  
        </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { gsap } from 'gsap'; // Import GSAP
  
  // --- Game State ---
  const board = ref(Array(9).fill(null)); // 3x3 board represented as a 1D array
  const currentPlayer = ref('X'); // 'X' for human, 'O' for AI
  const winner = ref(null); // null, 'X', 'O', or 'Draw'
  const winningLine = ref(null); // Array of indices [a, b, c] if there's a winner
  const isAITurn = ref(false); // Flag to indicate if AI is thinking/making move
  
  // --- DOM Reference for GSAP ---
  const boardElement = ref(null); // Ref to the game-board element
  
  // --- Winning Combinations ---
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  // --- Methods ---
  const handleCellClick = (index) => {
    // If game is over, AI is thinking, or cell is already filled, do nothing
    if (winner.value !== null || isAITurn.value || board.value[index] !== null) {
       // Optional: Subtle shake for invalid click (monochromatic)
       gsap.to(event.target, { x: -3, repeat: 3, yoyo: true, duration: 0.08, ease: "power1.inOut" });
       gsap.to(event.target, { x: 0, duration: 0.08, delay: 0.24 });
      return;
    }
  
    // Human player makes a move
    board.value[index] = currentPlayer.value;
  
    // The Transition component handles the mark animation via onEnterMark
  
    // Check for win/draw immediately after human move
    if (checkWin()) {
      winner.value = currentPlayer.value;
    } else if (checkDraw()) {
      winner.value = 'Draw';
    } else {
      // Switch to AI's turn and make AI move after a short delay
      currentPlayer.value = 'O';
      isAITurn.value = true;
      setTimeout(makeAIMove, 700); // AI "thinking" delay
    }
  };
  
  const makeAIMove = () => {
    // Check if game ended while waiting for AI (e.g. if watch(winner) reset it)
    if (winner.value !== null) {
        isAITurn.value = false; // Clear AI turn flag
        return;
    }
  
    const emptyIndices = board.value
      .map((cell, index) => (cell === null ? index : null))
      .filter(index => index !== null);
  
    if (emptyIndices.length > 0) {
      // Simple AI: Choose a random empty cell
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  
      // Update board state for AI move
      board.value[randomIndex] = currentPlayer.value;
  
      // The Transition component handles the mark animation via onEnterMark
  
      // Check for win/draw after AI move
      if (checkWin()) {
        winner.value = currentPlayer.value;
      } else if (checkDraw()) {
        winner.value = 'Draw';
      } else {
        // Switch back to Human player's turn
        currentPlayer.value = 'X';
      }
    }
    isAITurn.value = false; // AI turn finished
  };
  
  
  const checkWin = () => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        board.value[a] !== null &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c]
      ) {
        winningLine.value = combination; // Store the winning indices
        return true; // We have a winner!
      }
    }
    winningLine.value = null; // No win yet
    return false;
  };
  
  const checkDraw = () => {
    // Check if the board is full
    return board.value.every(cell => cell !== null);
  };
  
  const resetGame = () => {
     // Animate out the existing marks before clearing the board
    const cellsWithMarks = gsap.utils.toArray(boardElement.value.querySelectorAll('.cell-minimal span'));
  
    gsap.to(cellsWithMarks, {
      opacity: 0,
      scale: 0.3, // Scale down more aggressively
      duration: 0.3,
      stagger: 0.03, // Slightly faster stagger
      ease: "power2.in", // Use a stronger ease for disappearing
      onComplete: () => {
        // Reset state after animation completes
        board.value = Array(9).fill(null);
        currentPlayer.value = 'X'; // Always start with X (human)
        winner.value = null;
        winningLine.value = null;
         isAITurn.value = false; // Ensure this is false on reset
  
        // Optional: Animate the empty board or title back in
        gsap.fromTo(boardElement.value,
          { opacity: 0.7, scale: 0.95 }, // Subtle scale/fade in effect
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  };
  
  // --- Animations (using GSAP and Vue Transitions) ---
  
  // Animation for when an X or O mark enters a cell
  const onEnterMark = (el, done) => {
    gsap.from(el, {
      scale: 0.6, // Start smaller
      opacity: 0, // Start invisible
      rotation: 0, // Start with no rotation
      duration: 0.5, // Animation duration slightly longer
      ease: "back(2.5)", // More pronounced popping ease effect
      onComplete: done // Tell Vue Transition the animation is done
    });
  };
  
  
  // Watch for winner changes to trigger win/draw animations and auto-restart
  watch(winner, (newValue, oldValue) => {
      if (newValue) { // Game has ended (Win or Draw)
          if (newValue !== 'Draw') {
              // Win Animation (Monochromatic)
              const winningCells = winningLine.value.map(index =>
                  boardElement.value.querySelector(`.cell-minimal[data-index='${index}']`)
              );
  
              gsap.to(winningCells, {
                  // Animate background color (subtle light grey flash)
                  backgroundColor: '#e0e0e0', // Light grey highlight
                  repeat: 3, // Pulse a few times
                  yoyo: true,
                  duration: 0.4,
                  ease: "power1.inOut",
                  overwrite: true // Prevent overlapping animations
              });
  
               gsap.to(winningCells, {
                   scale: 1.03, // Subtle scale pop
                   repeat: 3,
                   yoyo: true,
                   duration: 0.4,
                   ease: "power1.inOut",
                   overwrite: true
               });
  
          } else {
              // Draw Animation (Monochromatic) - Maybe a subtle border flash on all cells
              const allCells = gsap.utils.toArray(boardElement.value.querySelectorAll('.cell-minimal'));
               gsap.to(allCells, {
                   borderColor: '#888', // Darker grey border flash
                   repeat: 1,
                   yoyo: true,
                   duration: 0.5,
                   ease: "power1.inOut",
                   overwrite: true
               });
          }
  
          // Auto-restart after a delay
          setTimeout(resetGame, 2500); // 2.5 seconds delay before restart
  
          // Add a slight animation to the status text itself
           const statusEl = document.querySelector('.game-status-minimal span'); // Assuming only one status span is visible
           if(statusEl) {
              gsap.fromTo(statusEl,
                  { opacity: 0, y: -15 },
                  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
              );
           }
      }
  });
  
  
  // Initial load animation (adjusting targets and colors for minimal design)
  onMounted(() => {
       // Animate the lines in
       gsap.from(".board-line", {
           scale: 0,
           opacity: 0,
           duration: 0.6,
           stagger: 0.1,
           ease: "back(1.7)"
       });
  
      // Animate the grid cells (invisible areas) in
      gsap.from(boardElement.value.children, {
          opacity: 0, // Keep opacity 0 as cells are transparent
          delay: 0.3, // Start slightly after lines
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out"
      });
       gsap.from(".game-status-minimal", { opacity: 0, y: -20, duration: 0.5, delay: 0.6 });
  });
  
  </script>
  
  <style scoped>
  /* --- Layout and Basic Styling (Minimal Monochromatic) --- */
  .tic-tac-toe-minimal {
    margin-top: 0; /* Removed top margin */
    margin-bottom: 0; /* Removed bottom margin */
    padding: 2rem 0; /* Add some padding if needed, or adjust the surrounding container */
    text-align: center;
    background-color: transparent; /* Ensure no section background */
  }
  
  /* Removed section heading style */
  
  .game-container-minimal {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 300px; /* Adjusted max width for a tighter feel */
    margin: 0 auto;
    padding: 0; /* Removed padding */
    background-color: transparent; /* Removed background */
    box-shadow: none; /* Removed shadow */
    border-radius: 0; /* Removed border radius */
  }
  
  .game-status-minimal {
    min-height: 1.5em; /* Reserve space */
    font-size: 1.1rem; /* Slightly smaller status font */
    font-weight: 500; /* Lighter weight */
    margin-bottom: 1rem; /* Reduced space below status */
    color: #333; /* Dark grey status text */
  }
  
  /* Monochromatic Status Colors */
  .status-win-minimal {
      color: #1a1a1a; /* Very dark grey */
  }
  .status-lose-minimal {
      color: #555; /* Medium grey */
  }
  .status-draw-minimal {
      color: #888; /* Lighter grey */
  }
  .status-turn-minimal,
  .status-thinking-minimal {
      color: #666; /* Standard turn text grey */
  }
  
  
  /* Container for lines and the board grid */
  .board-lines-container {
      position: relative; /* Needed for absolute positioning of lines */
      width: 248px; /* Size matching the grid + gap (3 * 80 + 2 * 8) */
      height: 248px;
      margin-bottom: 1rem; /* Space below the board */
  }
  
  /* Styles for the minimalistic lines */
  .board-line {
      position: absolute;
      background-color: #333; /* Monochromatic line color */
      z-index: 1; /* Ensure lines are above the grid cells */
  }
  
  .board-line.vertical {
      width: 3px;
      top: 0;
      bottom: 0;
  }
  
  .board-line.horizontal {
      height: 3px;
      left: 0;
      right: 0;
  }
  
  /* Positioning the lines */
  .board-line.vertical.line-1 { left: calc(80px + 8px/2); } /* After first cell + half gap */
  .board-line.vertical.line-2 { left: calc(2 * 80px + 8px + 8px/2); } /* After second cell + full gap + half gap */
  .board-line.horizontal.line-1 { top: calc(80px + 8px/2); } /* After first row + half gap */
  .board-line.horizontal.line-2 { top: calc(2 * 80px + 8px + 8px/2); } /* After second row + full gap + half gap */
  
  
  /* The grid for clickable areas and mark positioning */
  .game-board-minimal {
    display: grid;
    grid-template-columns: repeat(3, 80px); /* Fixed size cells */
    grid-template-rows: repeat(3, 80px);
    gap: 8px; /* Space between cells */
    position: absolute; /* Position over the lines */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2; /* Ensure cells are clickable above lines */
  }
  
  .cell-minimal {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent; /* Transparent background */
    border: none; /* Removed border */
    border-radius: 0; /* Removed border radius */
    cursor: pointer;
    font-size: 3rem;
    font-weight: bold;
    user-select: none; /* Prevent selecting the X/O text */
    position: relative; /* Needed for absolute positioning of marks */
    overflow: hidden; /* Hide potential overflow during scale animation */
     /* GSAP will animate background-color for winning-cell-minimal */
      transition: background-color 0.2s ease-in-out; /* Keep transition for the win highlight */
  }
  
  .cell-minimal:hover:not(:has(span)) { /* Only hover on empty cells */
       background-color: #f0f0f0; /* Very subtle light grey on hover */
  }
  
  
  /* Monochromatic Colors for X and O marks */
  .mark-x {
      color: #1a1a1a; /* Darkest grey/black */
  }
  .mark-o {
      color: #555; /* Medium grey */
  }
  
  /* Winning cell highlight (GSAP animates the background) */
  .winning-cell-minimal {
      /* The background animation is handled by GSAP */
  }
  
  /* Removed Reset Button styles */
  
  /* Vue Transition Styles for status text (monochromatic) */
  .slide-fade-minimal-enter-active,
  .slide-fade-minimal-leave-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-fade-minimal-enter-from,
  .slide-fade-minimal-leave-to {
    transform: translateY(10px);
    opacity: 0;
  }
  
  /* Removed Vue Transition Styles for reset button text */
  
  
  /* --- Responsive Adjustments --- */
  @media (max-width: 400px) {
      .board-lines-container {
          width: 218px; /* Adjusted size (3 * 68 + 2 * 7) */
          height: 218px;
           gap: 7px; /* Adjusted gap */
      }
    .game-board-minimal {
      grid-template-columns: repeat(3, 68px); /* Smaller cells on smaller screens */
      grid-template-rows: repeat(3, 68px);
      gap: 7px; /* Adjusted gap */
    }
    .cell-minimal {
      font-size: 2.5rem; /* Smaller font size for marks */
    }
  
     /* Positioning lines based on new cell/gap size */
      .board-line.vertical.line-1 { left: calc(68px + 7px/2); }
      .board-line.vertical.line-2 { left: calc(2 * 68px + 7px + 7px/2); }
      .board-line.horizontal.line-1 { top: calc(68px + 7px/2); }
      .board-line.horizontal.line-2 { top: calc(2 * 68px + 7px + 7px/2); }
  
    .game-status-minimal {
        font-size: 1rem;
        margin-bottom: 0.8rem;
    }
  }
  
  </style>