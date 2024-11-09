<template>
    <div class="tw-absolute tw-inset-0 tw-top-[var(--navbar-height)]">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6 tw-text-center">Label the items in order!</h2>

        <!-- Timer Bar Logic -->
        <div class="progress-container tw-w-1/2 tw-mx-auto">
            <progress class="nes-progress is-success tw-w-full" :value="timerWidth" :max="100"></progress>
            <p class="nes-text is-primary">{{ Math.round(timerWidth) }}%</p>
        </div>

        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6 tw-text-center">
          Question {{ questionNumber }}/{{ totalQuestions }} - Coins: {{ coins }}
        </h2>

        <!-- Conveyor Belts and Groceries -->
        <div class="tw-space-y-8 tw-mb-8 tw-px-6">
            <div
                v-for="(conveyor, index) in conveyors"
                :key="index"
                class="tw-conveyor tw-mx-auto"
                @dragover="allowDrop"
                @drop="drop($event, index)"
                @click="resetLabel(index)"
            >
                <img src="/assets/MarketImages/conveyor start.png" alt="Conveyor Start" />
                <img src="/assets/MarketImages/conveyor middle.png" alt="Conveyor Middle" v-for="n in 13" />
                <img src="/assets/MarketImages/conveyor end.png" alt="Conveyor End" />
                
                <div class="tw-grocery-container" :id="'grocery-' + index">
                    <img :src="conveyor.image" class="tw-grocery" :alt="'Basket ' + (index + 1)" />
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
        <div class="tw-flex tw-justify-center tw-space-x-4 tw-mb-4">
            <div
                v-for="(label, index) in ordinalNumbers"
                :key="index"
                class="tw-draggable tw-text-xl tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-cursor-move tw-w-20 tw-h-12 tw-flex tw-items-center tw-justify-center"
                :class="[label.disabled ? 'tw-bg-gray-400 tw-cursor-not-allowed' : 'tw-bg-yellow-400', 'tw-text-black']"
                :draggable="!label.disabled"
                @dragstart="!label.disabled && dragStart($event, label.text)"
            >
                {{ label.text }}
            </div>
        </div>

        <div class="tw-text-center tw-mt-6">
            <button class="nes-btn" @click="checkAnswer" :disabled="loadingNextQuestion">Submit Answer</button>
        </div>
    </div>

    <!-- Game Over Modal -->
    <div v-if="gameOver" class="game-over-overlay">
        <div class="game-over-content">
            <h2>{{ completionMessage }}</h2>
            <p>Coins Earned: {{ coins }}</p>
            <div class="button-container">
                <button @click="exitGame" class="nes-btn is-primary">
                    Exit
                </button>
                <button @click="restartGame" class="nes-btn is-success">
                    Restart
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: "MarketOrdering",
    setup() {
        const conveyors = reactive(Array.from({ length: 4 }, (_, i) => ({
            id: i + 1,
            correctOrdinal: null,
            assignedOrdinal: null,
            image: '',
            labelClass: '',
            showCross: false,
        })));

        const ordinalNumbers = ref([
            { text: "1st", disabled: false },
            { text: "2nd", disabled: false },
            { text: "3rd", disabled: false },
            { text: "4th", disabled: false },
        ]);

        const draggedOrdinal = ref(null);
        const submitted = ref(false);
        const basketImages = Array.from({ length: 8 }, (_, i) => `/assets/MarketImages/basket${i + 1}.png`);
        const coins = ref(0); 
        const questionNumber = ref(1);
        const totalQuestions = 10;
        const timerFrozen = ref(false);
        const gameOver = ref(false);
        const completionMessage = ref("Game Over")
        const loadingNextQuestion = ref(false);
        const isStreak = ref(false);
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
                const grocery = document.getElementById(`grocery-${conveyor.id - 1}`);
                const conveyorStartImage = document.querySelectorAll('.tw-conveyor')[index].querySelector('img');
                grocery.style.transition = "none";
                grocery.style.left = `${conveyorStartImage.getBoundingClientRect().left}px`;
                grocery.offsetHeight;
                grocery.style.transition = "left 3s linear";
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
                const grocery = document.getElementById(`grocery-${conveyor.id - 1}`);
                const conveyorEndImage = document.querySelectorAll('.tw-conveyor')[index].querySelector('img:last-of-type');
                const endPos = conveyorEndImage.getBoundingClientRect().left - 40;

                setTimeout(() => {
                    grocery.style.left = `${endPos}px`;
                }, cumulativeDelay);

                cumulativeDelay += Math.random() * 800 + 200;
            });
        };

        const dragStart = (event, number) => {
            draggedOrdinal.value = number;
        };

        const allowDrop = (event) => {
            event.preventDefault();
        };

        const drop = (event, index) => {
            if (draggedOrdinal.value) {
                if (conveyors[index].assignedOrdinal) {
                    const previousLabel = conveyors[index].assignedOrdinal;
                    ordinalNumbers.value = ordinalNumbers.value.map(label =>
                        label.text === previousLabel ? { ...label, disabled: false } : label
                    );
                }

                conveyors[index].assignedOrdinal = draggedOrdinal.value;
                ordinalNumbers.value = ordinalNumbers.value.map(label =>
                    label.text === draggedOrdinal.value ? { ...label, disabled: true } : label
                );
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
                // Increment streak count on correct answer
                streakCount.value += 1;

                // Enter streak state if correct answers in a row reach 5
                if (streakCount.value > 5) {
                    isStreak.value = true;
                }

                // Double coins if in streak state
                coins.value += isStreak.value ? 20 : 10;
            } else {
                // Reset streak on incorrect answer
                resetStreak();
            }

            if (questionNumber.value < totalQuestions) {
                questionNumber.value += 1;
                setTimeout(loadNextQuestion, 1000);
            } else {
                gameOver.value = true;
            }
        };

        const resetStreak = () => {
            streakCount.value = 0;
            isStreak.value = false;
        };

        const loadNextQuestion = () => {
            submitted.value = false;
            ordinalNumbers.value.forEach(label => (label.disabled = false));
            conveyors.forEach(conveyor => {
                conveyor.assignedOrdinal = null;
                conveyor.labelClass = '';
                conveyor.showCross = false;
            });

            assignRandomImages();
            resetGroceries();
            startRace();
            resetTimer();
            loadingNextQuestion.value = false;
        };

        const router = useRouter();
        const exitGame = () => {
            router.push("/game");
        };

        const restartGame = () => {
            gameOver.value = false;
            questionNumber.value = 1;
            coins.value = 0;
            loadNextQuestion();
        };

        const navbarHeight = ref(0);
        const timerWidth = ref(100);
        const timerInterval = ref(null);

        const startTimer = () => {
            timerWidth.value = 100;
            timerFrozen.value = false;

            timerInterval.value = setInterval(() => {
                if (!timerFrozen.value) {
                    timerWidth.value = Math.max(0, timerWidth.value - 0.5);

                    if (timerWidth.value <= 0) {
                        handleTimeOut();
                    }
                }
            }, 50);
        };

        const resetTimer = () => {
            clearInterval(timerInterval.value);
            startTimer();
        };

        const handleTimeOut = () => {
            if (questionNumber.value < totalQuestions) {
                questionNumber.value += 1;
                loadNextQuestion();
            } else {
                gameOver.value = true;
            }
        };

        onMounted(() => {
            const navbar = document.querySelector(".navbar");
            if (navbar) {
                navbarHeight.value = navbar.offsetHeight;
                document.documentElement.style.setProperty("--navbar-height", `${navbarHeight.value}px`);
            }
            assignRandomImages();
            resetGroceries();
            setTimeout(startRace, 1000);
            startTimer();
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
            navbarHeight,
            timerWidth,
            startTimer,
            questionNumber,
            totalQuestions,
            coins,
            timerFrozen,
            gameOver,
            completionMessage,
            exitGame,
            restartGame,
            router,
            loadingNextQuestion,
            streakCount,
            isStreak,
            resetStreak
        };
    }
};
</script>
  
<style scoped>
    /* Ordering Styles */
    * {
    font-family: 'Press Start 2P', sans-serif;
    }

    /* Add/modify this CSS for styling */
    .game-over-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .game-over-content {
        background: #fff;
        padding: 40px;
        width: 500px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        text-align: center;
    }

    .button-container button {
        width: 150px;
        margin: 0 20px;
    }

    .tw-conveyor {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100px;
        margin: 0 auto;
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
    /* Ordering Styles */
</style>