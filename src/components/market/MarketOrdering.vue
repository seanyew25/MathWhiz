<template>
    <div class="md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]">

        <!-- Game Container -->
        <div class="nes-container is-rounded is-centered with-title" style="background-color: rgba(255, 245, 205, 1); width: 768px;">
            <p class="title" style="background-color: rgba(255, 245, 205, 1);">Ordering</p>
            <div class="tw-max-w-3xl tw-flex tw-flex-col tw-items-center tw-justify-center">

                <!-- Instructions -->
                <h2 class="tw-text-2xl tw-mb-2 tw-text-center">Label the items in order!</h2>

                <!-- Timer Bar Logic -->
                <div class="progress-container tw-w-full">
                    <progress class="nes-progress is-success tw-w-full" :value="timerWidth" :max="20"></progress>
                    <p class="nes-text is-primary timer-text">{{ timerWidth.toFixed(1) }}s</p>
                </div>  

                <!-- Streak Message -->
                <transition name="fade">
                <div v-if="streakCount >= 5" class="streak-banner text-center my-2 tw-flex tw-items-center tw-justify-center">
                    <i class="nes-icon trophy is-large"></i>
                    <p class="tw-mx-6">On a streak! x2 coins enabled!</p>
                    <i class="nes-icon trophy is-large"></i>
                </div>
                </transition>

                <!-- Conveyor Belts and Groceries -->
                <div>
                    <div
                        v-for="(conveyor, index) in conveyors"
                        :key="index"
                        class="tw-conveyor tw-scale-75"
                        @dragover="allowDrop"
                        @drop="drop($event, index)"
                        @click="resetLabel(index)"
                    >   
                        <div class="tw-conveyor conveyor-start">
                        <img src="/assets/marketassets/conveyor start.png">
                        </div>

                        <img src="/assets/marketassets/conveyor middle.png" alt="Conveyor Middle" v-for="n in 9" />

                        <div class="tw-conveyor conveyor-end">
                        <img src="/assets/marketassets/conveyor end.png"/>
                        </div>
                        
                        <div class="tw-grocery-container" :id="'grocery-' + index">
                            <img :src="conveyor.image" class="tw-grocery" :alt="'Basket ' + index" />
                            <div v-if="!conveyor.showCross && conveyor.assignedOrdinal" 
                                :class="['tw-label-circle', conveyor.labelClass]" 
                                @click="resetLabel(index)">
                                {{ conveyor.assignedOrdinal }}
                            </div>
                            <span v-else-if="submitted && (!conveyor.assignedOrdinal || conveyor.showCross)" 
                                class="tw-text-red-500 tw-text-5xl tw-font-bold tw-absolute" style="top: 20px;" @click="resetLabel(index)">❌</span>
                        </div>
                    </div>
                </div>

                <!-- Ordinal Labels to Drag -->
                <div class="tw-flex tw-justify-center tw-mb-4 tw-gap-10">
                    <div
                        v-for="(label, index) in ordinalNumbers"
                        :key="index"
                        v-show="!label.hidden"
                        class="tw-draggable nes-btn tw-font-bold"
                        :class="[label.disabled ? 'is error' : 'is-primary']"
                        :draggable="!label.disabled"
                        @dragstart="!label.disabled && dragStart($event, label.text)"
                    >
                        {{ label.text }}
                    </div>
                </div>

                <div class="tw-text-center">
                    <button class="nes-btn" @click="checkAnswer" :disabled="loadingNextQuestion">Submit Answer</button>
                </div>
            </div>

            <!-- Question Count and Coins Display -->
            <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mt-4">
            Question {{ questionCount }}/10
            </h2>
            <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mb-0">
                Coins: {{ coins }}<i class="nes-icon coin is-small"></i>
            </h2>
        </div>

        <!-- Game Over Modal -->
        <div v-if="gameOver" class="game-over-overlay">
                <div class="game-over-content">
                    <h2>{{ completionMessage }}</h2>
                    <p>Total Coins Earned: {{ coins }}</p>
                    <div class="button-container">
                        <button @click="exitGame" class="nes-btn is-primary">
                            Exit Game
                        </button>
                        <button @click="restartGame" class="nes-btn is-success">
                            Restart Game
                        </button>
                    </div>
                </div>
            </div>

        <!-- Tutorial Modal-->
        <dialog class="nes-dialog" id="tutorial">
          <form method="dialog">
            <h5 class="title tw-mb-4" style="text-align:center;">Welcome to the Ordering Game!</h5>
            <p style="text-align: center;">
                The grocery baskets will start moving at different times.<br><br>
                Drag the labels onto the conveyor belts to show <br>which basket goes 1st, 2nd, 3rd, and 4th.<br><br> 
                Good luck!
            </p>
            <menu class="dialog-menu tw-mb-0 tw-px-0">
              <button class="nes-btn is-primary" style="text-align:center;" @click="startGame">Start Game</button>
            </menu>
          </form>
        </dialog>
    </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import confetti from "canvas-confetti";
import { useRouter } from 'vue-router';

export default {
    name: "MarketOrdering",
    setup() {
        const conveyors = reactive(Array.from({ length: 4 }, (_, i) => ({
            id: i,
            correctOrdinal: null,
            assignedOrdinal: null,
            image: '',
            labelClass: '',
            showCross: false,
        })));

        const ordinalNumbers = ref([
            { text: "1st", disabled: false, hidden: false },
            { text: "2nd", disabled: false, hidden: false },
            { text: "3rd", disabled: false, hidden: false },
            { text: "4th", disabled: false, hidden: false },
        ]);

        const draggedOrdinal = ref(null);
        const submitted = ref(false);
        const basketImages = Array.from({ length: 8 }, (_, i) => `/assets/marketassets/basket${i + 1}.png`);
        const coins = ref(0); 
        const questionCount = ref(1);
        const totalQuestions = 10;
        const timerFrozen = ref(false);
        const gameOver = ref(false);
        const completionMessage = ref("Game Over! You've answered 10 questions.")
        const loadingNextQuestion = ref(true);
        const streakCount = ref(0);

        const assignRandomImages = () => {
            let availableImages = [...basketImages];
            conveyors.forEach(conveyor => {
                const randomIndex = Math.floor(Math.random() * availableImages.length);
                conveyor.image = availableImages.splice(randomIndex, 1)[0];
            });
        };

        const resetGroceries = () => {
            conveyors.forEach((conveyor, index) => {
                const grocery = document.getElementById(`grocery-${conveyor.id}`);

                if (grocery) {
                    // No animation
                    grocery.style.transition = "none";

                    // Start position
                    grocery.style.left = `20px`;

                    // Force reflow to apply the positioning immediately
                    grocery.offsetHeight;
                }
            });
        };

        const startRace = () => {
            const shuffledConveyors = [...conveyors].sort(() => Math.random() - 0.5);
            const ordinals = ["1st", "2nd", "3rd", "4th"];
            shuffledConveyors.forEach((conveyor, position) => {
                conveyor.correctOrdinal = ordinals[position];
            });

            let cumulativeDelay = 0;
            shuffledConveyors.forEach((conveyor, index) => {
                const grocery = document.getElementById(`grocery-${conveyor.id}`);

                // Animation
                grocery.style.transition = "left 4s linear";

                setTimeout(() => {
                    // End position
                    grocery.style.left = `735px`;
                }, cumulativeDelay);

                cumulativeDelay += Math.random() * 800 + 300; // Introduce random delays for each item
            });
        };

        const dragStart = (event, number) => {
            draggedOrdinal.value = number;
        };

        const resetLabel = (index) => {
            const previousLabel = conveyors[index].assignedOrdinal;
            if (previousLabel) {
                ordinalNumbers.value = ordinalNumbers.value.map(label =>
                    label.text === previousLabel ? { ...label, disabled: false, hidden: false } : label
                );
                conveyors[index].assignedOrdinal = null;
            }
        };

        const allowDrop = (event) => {
            event.preventDefault();
        };

        const drop = (event, index) => {
            event.preventDefault(); // Prevent default behavior

            if (draggedOrdinal.value) {
                if (conveyors[index].assignedOrdinal) {
                    resetLabel(index); // Reset the current label if it's already assigned
                }

                // Assign the dragged label to the conveyor
                conveyors[index].assignedOrdinal = draggedOrdinal.value;

                // Update the ordinalNumbers array to mark the dragged label as disabled
                ordinalNumbers.value = ordinalNumbers.value.map(label =>
                    label.text === draggedOrdinal.value ? { ...label, disabled: true, hidden: true } : label
                );

                // Clear the draggedOrdinal after it's assigned
                draggedOrdinal.value = null;
            }
        };


        const checkAnswer = () => {
            submitted.value = true;
            timerFrozen.value = true;
            loadingNextQuestion.value = true;

            let allCorrect = true;
            conveyors.forEach((conveyor) => {
                if (conveyor.assignedOrdinal === conveyor.correctOrdinal) {
                    conveyor.labelClass = 'tw-correct';
                    conveyor.showCross = false;
                } else {
                    conveyor.labelClass = 'tw-incorrect';
                    conveyor.showCross = true;
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                playSound(true);
                streakCount.value += 1;

                if (streakCount.value == 5){
                    triggerConfetti();
                }

                // Check if user is on a streak
                if (streakCount.value > 5) {
                    coins.value += 2;
                } else {
                    coins.value += 1;
                }
            } else {
                console.log("ordering, wrong, playing sound")
                playSound(false);
                resetStreak();
            }

            if (questionCount.value < totalQuestions) {
                setTimeout(loadNextQuestion, 1000);
            } else {
                gameOver.value = true;
            }
        };

        const resetStreak = () => {
            streakCount.value = 0;
        };

        const loadNextQuestion = () => {
            submitted.value = false;
            
            // Ensure all labels are visible and enabled
            ordinalNumbers.value.forEach(label => {
                label.disabled = false;
                label.hidden = false;
            });

            // Reset conveyor belts
            conveyors.forEach(conveyor => {
                conveyor.assignedOrdinal = null;
                conveyor.labelClass = '';
                conveyor.showCross = false;
            });

            questionCount.value += 1;
            assignRandomImages();
            resetGroceries();
            setTimeout(() => {
                startRace();
                resetTimer();
                setTimeout(() => loadingNextQuestion.value = false, 300);
            }, 1000);
        };

        const router = useRouter();
        const exitGame = () => {
            router.push("/game");
        };

        const restartGame = () => {
            gameOver.value = false;
            questionCount.value = 0;
            coins.value = 0;
            resetStreak();
            loadNextQuestion();
        };

        const timerWidth = ref(20);
        const timerInterval = ref(null);

        const startTimer = () => {
            timerWidth.value = 20;
            timerFrozen.value = false;

            timerInterval.value = setInterval(() => {
                if (!timerFrozen.value) {
                    timerWidth.value = Math.max(0, timerWidth.value - 0.1);

                    if (timerWidth.value == 0) {
                        timerFrozen.value = true;
                        handleTimeOut();
                    }
                }
            }, 100);
        };

        const resetTimer = () => {
            clearInterval(timerInterval.value);
            startTimer();
        };

        const handleTimeOut = () => {
            if (questionCount.value < totalQuestions) {
                playSound(false);
                console.log("handling timeout")
                resetStreak();
                loadNextQuestion();
            } else {
                gameOver.value = true;
            }
        };

        const playSound = (correct) => {
            const audio = new Audio(
                correct
                ? 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'
                : 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
            );
            audio.play();
        };

        const triggerConfetti = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        };

        const showTutorial = () => {
            document.getElementById('tutorial').showModal();
        };

        const startGame = () => {
            document.getElementById('tutorial').close();
            startRace();
            resetTimer();
            setTimeout(() => loadingNextQuestion.value = false, 300);
        };
        onMounted(() => {
            showTutorial();
            assignRandomImages();
            resetGroceries();
        });

        // Add cleanup logic here
        onBeforeUnmount(() => {
            if (timerInterval.value) {
                clearInterval(timerInterval.value);
            }
        });

        return {
            conveyors,
            ordinalNumbers,
            draggedOrdinal,
            submitted,
            assignRandomImages,
            resetGroceries,
            startRace,
            dragStart,
            allowDrop,
            drop,
            checkAnswer,
            timerWidth,
            startTimer,
            questionCount,
            totalQuestions,
            coins,
            timerFrozen,
            gameOver,
            completionMessage,
            startGame,
            exitGame,
            restartGame,
            router,
            loadingNextQuestion,
            streakCount,
            resetStreak,
            resetLabel
        };
    }
};
</script>
  
<style scoped>
    * {
    font-family: 'Press Start 2P', sans-serif;
    }   

    .progress-container {
        position: relative; /* To allow positioning of the child elements absolutely */
    }

    .timer-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .game-over-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .game-over-content {
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
    }

    .button-container button {
        width: 220px;
        margin: 0 30px;
    }

    .tw-conveyor {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100px;
        margin: 0;
    }

    .tw-conveyor img {
        height: 100%;
        width: auto;
    }

    .tw-grocery-container {
        position: absolute;
        top: -20px;
        left: 10px;
        width: 72px;
        height: 120px;
        transition: left 3s linear;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tw-grocery {
        width: 72px !important;
        height: 120px !important;
        user-select: none;
    }

    .tw-label-circle {
        position: absolute;
        width: 55px;
        height: 55px;
        background-color: white;
        color: black;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        top: 25px;
        transition: transform 0.2s, background-color 0.2s;
    }

    .tw-label-circle.tw-correct {
        background-color: green;
        color: white;
        animation: tw-pulse 0.6s ease-in-out infinite; /* Apply pulse animation for correct answers */
    }

    @keyframes tw-pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }

    .tw-label-circle.tw-incorrect {
        background-color: red;
        color: white;
    }
    
    .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to {
    opacity: 0;
    }

    .streak-banner {
    background-color: #ffd700;
    color: #000;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
    animation: pulse 1s infinite;
    }
</style>