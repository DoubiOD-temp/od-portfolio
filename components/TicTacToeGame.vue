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
            @click="handleCellClick($event, index)"
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

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';

// Define emitted events
const emit = defineEmits(['win', 'loseOrDraw', 'end']); // Added loseOrDraw and end

// --- Game State ---
const board = ref<(null | 'X' | 'O')[]>(Array(9).fill(null));
const currentPlayer = ref<'X' | 'O'>('X');
const winner = ref<null | 'X' | 'O' | 'Draw'>(null);
const winningLine = ref<number[] | null>(null);
const isAITurn = ref(false);
const isGameOver = ref(false); // Flag to prevent clicks during reset animation

// --- DOM Reference for GSAP ---
const boardElement = ref<HTMLElement | null>(null);

// --- Winning Combinations ---
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- Methods ---
const handleCellClick = (event: MouseEvent, index: number) => {
  if (isGameOver.value || winner.value !== null || isAITurn.value || board.value[index] !== null) {
    // Optional: Subtle shake for invalid click
    if (event.target) {
      gsap.to(event.target as HTMLElement, { x: -3, repeat: 3, yoyo: true, duration: 0.08, ease: "power1.inOut" });
      gsap.to(event.target as HTMLElement, { x: 0, duration: 0.08, delay: 0.24 });
    }
    return;
  }

  board.value[index] = currentPlayer.value;

  if (checkWin()) {
    winner.value = currentPlayer.value;
  } else if (checkDraw()) {
    winner.value = 'Draw';
  } else {
    currentPlayer.value = 'O';
    isAITurn.value = true;
    setTimeout(makeAIMove, 700);
  }
};

const makeAIMove = () => {
  if (winner.value !== null) {
    isAITurn.value = false;
    return;
  }

  const emptyIndices = board.value
    .map((cell, index) => (cell === null ? index : null))
    .filter((index): index is number => index !== null);

  if (emptyIndices.length > 0) {
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board.value[randomIndex] = currentPlayer.value; // AI is 'O'

    if (checkWin()) {
      winner.value = currentPlayer.value;
    } else if (checkDraw()) {
      winner.value = 'Draw';
    } else {
      currentPlayer.value = 'X';
    }
  }
  isAITurn.value = false;
};


const checkWin = (): boolean => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      board.value[a] !== null &&
      board.value[a] === board.value[b] &&
      board.value[a] === board.value[c]
    ) {
      winningLine.value = combination;
      return true;
    }
  }
  winningLine.value = null;
  return false;
};

const checkDraw = (): boolean => {
  return board.value.every(cell => cell !== null);
};

const resetGame = () => {
  isGameOver.value = true; // Prevent clicks during reset
  const cellsWithMarks = boardElement.value ? gsap.utils.toArray(boardElement.value.querySelectorAll('.cell-minimal span')) : [];

  gsap.to(cellsWithMarks, {
    opacity: 0,
    scale: 0.3,
    duration: 0.3,
    stagger: 0.03,
    ease: "power2.in",
    onComplete: () => {
      board.value = Array(9).fill(null);
      currentPlayer.value = 'X';
      winner.value = null; // Important: Reset winner AFTER animation check
      winningLine.value = null;
      isAITurn.value = false;
      isGameOver.value = false; // Allow clicks again

      nextTick(() => { // Ensure DOM is updated before animating board in
          if (boardElement.value) {
             gsap.fromTo(boardElement.value,
                { opacity: 0.7, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
            );
          }
      });
    }
  });
};

// --- Animations ---
const onEnterMark = (el: Element, done: () => void) => {
  gsap.from(el, {
    scale: 0.6,
    opacity: 0,
    rotation: 0,
    duration: 0.5,
    ease: "back(2.5)",
    onComplete: done
  });
};

// --- Watchers ---
watch(winner, (newValue) => {
  if (newValue) { // Game has ended
    isGameOver.value = true; // Prevent interaction immediately

    // Emit end event regardless of outcome
    emit('end', newValue);

    // Win/Draw Animations
    if (newValue !== 'Draw' && winningLine.value && boardElement.value) {
        // Win Animation
        const winningCells = winningLine.value.map(index =>
            boardElement.value!.querySelector(`.cell-minimal[data-index='${index}']`)
        ).filter((el): el is Element => el !== null);

        gsap.to(winningCells, {
            backgroundColor: '#e0e0e0',
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            ease: "power1.inOut",
            overwrite: true
        });
        gsap.to(winningCells, {
            scale: 1.03,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            ease: "power1.inOut",
            overwrite: true
        });
    } else if (newValue === 'Draw' && boardElement.value) {
        // Draw Animation
        const allCells = gsap.utils.toArray(boardElement.value.querySelectorAll('.cell-minimal'));
        gsap.to(allCells, {
            borderColor: '#888',
            repeat: 1,
            yoyo: true,
            duration: 0.5,
            ease: "power1.inOut",
            overwrite: true
        });
    }

    // Status Text Animation
    nextTick(() => { // Wait for status text to update in DOM
        const statusEl = document.querySelector('.game-status-minimal span');
        if (statusEl) {
            gsap.fromTo(statusEl,
                { opacity: 0, y: -15 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.1 } // Small delay
            );
        }
    });

    // Handle Game Outcome
    if (newValue === 'X') {
      console.log('Emitting win event');
      emit('win');
      // No automatic reset on win, wait for parent component
    } else { // 'O' (Loss) or 'Draw'
      console.log('Emitting loseOrDraw event');
      emit('loseOrDraw');
      // Reset game after a delay for loss or draw
      setTimeout(resetGame, 2000); // 2-second delay before resetting
    }
  } else {
      // If winner becomes null (e.g., during reset), ensure game is playable
       isGameOver.value = false;
  }
});


// --- Lifecycle Hooks ---
onMounted(() => {
  if (boardElement.value) {
    // Animate lines in
    gsap.from(".board-line", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back(1.7)"
    });

    // Animate grid cells in (fade)
    gsap.from(boardElement.value.children, {
        opacity: 0,
        delay: 0.3,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
    });

    // Animate status in
    gsap.from(".game-status-minimal", { opacity: 0, y: -20, duration: 0.5, delay: 0.6 });
  }
});

</script>

<style scoped>
/* --- Layout and Basic Styling (Minimal Monochromatic) --- */
.tic-tac-toe-minimal {
  padding: 1rem 0; /* Reduced padding */
  text-align: center;
  background-color: transparent;
}

.game-container-minimal {
  display: inline-flex; /* Make container fit content */
  flex-direction: column;
  align-items: center;
 /* max-width: 300px; /* Let size be determined by content */
  margin: 0 auto;
  padding: 0;
  background-color: transparent;
  box-shadow: none;
  border-radius: 0;
}

.game-status-minimal {
  min-height: 1.5em;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #333;
}

.status-win-minimal { color: #1a1a1a; }
.status-lose-minimal { color: #555; }
.status-draw-minimal { color: #888; }
.status-turn-minimal,
.status-thinking-minimal { color: #666; }

.board-lines-container {
  position: relative;
  width: 246px; /* 3 * 80px cells + 2 * 3px gaps */
  height: 246px;
  margin-bottom: 1rem;
}

.board-line {
  position: absolute;
  background-color: #333;
  z-index: 1;
}

.board-line.vertical { width: 3px; top: 0; bottom: 0; }
.board-line.horizontal { height: 3px; left: 0; right: 0; }

/* Position lines exactly between cells */
.board-line.vertical.line-1 { left: 80px; }
.board-line.vertical.line-2 { left: 163px; /* 80 + 3 + 80 */ }
.board-line.horizontal.line-1 { top: 80px; }
.board-line.horizontal.line-2 { top: 163px; /* 80 + 3 + 80 */}

.game-board-minimal {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  grid-template-rows: repeat(3, 80px);
  gap: 3px; /* Reduced gap */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.cell-minimal {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 3rem;
  font-weight: bold;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: background-color 0.2s ease-in-out;
  box-sizing: border-box; /* Include border in size calculation if you add one */
}

.cell-minimal:hover:not(:has(span)) {
  background-color: #f0f0f0;
}

.mark-x { color: #1a1a1a; }
.mark-o { color: #555; }

.winning-cell-minimal {
  /* GSAP handles background */
}

/* Vue Transition Styles */
.slide-fade-minimal-enter-active,
.slide-fade-minimal-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-minimal-enter-from,
.slide-fade-minimal-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 400px) {
  .board-lines-container { width: 213px; height: 213px; } /* 3*70 + 2*1.5 */
  .game-board-minimal { grid-template-columns: repeat(3, 70px); grid-template-rows: repeat(3, 70px); gap: 1.5px; }
  .cell-minimal { font-size: 2.5rem; }
  .board-line.vertical { width: 1.5px; }
  .board-line.horizontal { height: 1.5px; }
  .board-line.vertical.line-1 { left: 70px; }
  .board-line.vertical.line-2 { left: 141.5px; /* 70 + 1.5 + 70 */ }
  .board-line.horizontal.line-1 { top: 70px; }
  .board-line.horizontal.line-2 { top: 141.5px; }
  .game-status-minimal { font-size: 1rem; margin-bottom: 0.8rem; }
}
</style>