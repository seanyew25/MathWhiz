<template>
    <div class="tw-absolute tw-inset-0 tw-top-[var(--navbar-height)]">
        <!-- Heading and Hint Button -->
        <h3 class="tw-text-2xl tw-font-bold tw-mb-6 tw-flex tw-justify-center tw-items-center tw-gap-4">
            Make a total of: {{ targetNumber }}
            <button @click="showHintModal = true" class="tw-px-3 tw-py-1 tw-bg-blue-500 tw-text-white tw-rounded">Hint</button>
        </h3>

        <!-- Timer Bar -->
        <div class="progress-container tw-w-1/2 tw-mx-auto">
            <progress class="nes-progress is-success tw-w-full" :value="timerWidth" :max="100"></progress>
            <p class="nes-text is-primary">{{ Math.round(timerWidth) }}%</p>
        </div>

        <!-- Question and Coins Display -->
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6 tw-text-center">
            Question {{ questionNumber }}/{{ totalQuestions }} - Coins: {{ coins }}
        </h2>

        <!-- Hint Modal -->
        <div v-if="showHintModal" class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-500 tw-bg-opacity-50 tw-z-50">
            <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-text-center">
                <p class="tw-text-lg tw-mb-4">In Hint Mode, click items to preview them in the target box with a counter.<br>Do you want to turn on Hint Mode?</p>
                <button @click="getHint(true)" class="tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded tw-mr-2">Yes</button>
                <button @click="getHint(false)" class="tw-px-4 tw-py-2 tw-bg-red-500 tw-text-white tw-rounded">No</button>
            </div>
        </div>

        <!-- Grids for Selection -->
        <div class="grid-container">
            <div v-for="(grid, index) in grids" :key="index" class="grid-item">
                <div class="object-grid">
                    <div v-for="object in grid" :key="object.id" :class="['object', { 'selected': object.selected }]" @click="toggleSelectById(object.id)" ref="objects" :data-id="object.id" v-bind:style="{ visibility: object.visible ? 'visible' : 'hidden' }">
                        <img :src="object.image" :alt="object.type" class="tw-w-full tw-h-full object-contain" />
                    </div>
                </div>
                <p style="font-size: 22px; margin-top: 15px;" class="tw-text-center">{{ labels[index] }}</p>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="tw-text-center tw-mt-6">
            <button class="nes-btn" @click="submitAnswer" :disabled="loadingNextQuestion">Submit Answer</button>
        </div>

        <!-- Target Boxes for Display -->
        <div class="tw-flex tw-justify-center tw-gap-8 tw-mt-8">
            <div ref="hundredsBox" class="target-box"></div>
            <div ref="tensBox" class="target-box"></div>
            <div ref="onesBox" class="target-box"></div>
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
    name: "MarketCounting",
    setup() {
        // Reactive data
        const targetNumber = ref(0);
        const showHintModal = ref(false);
        const hintMode = ref(false);
        const coins = ref(0);
        const questionNumber = ref(1);
        const totalQuestions = 10;
        const gameOver = ref(false); 
        const completionMessage = ref("Game Over!");
        const loadingNextQuestion = ref(false);
        const isStreak = ref(false);
        const streakCount = ref(0);

        const labels = ["Hundreds", "Tens", "Ones"];
        const grids = ref([]);
        const objects = ref([]);
        const hundredsBox = ref(null);
        const tensBox = ref(null);
        const onesBox = ref(null);
        
        const itemCounts = reactive({ hundreds: 0, tens: 0, ones: 0 });
        const tempCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });
        const ghostCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });


        // Timer-related data
        const timerWidth = ref(100);
        const timerInterval = ref(null);
        const timerFrozen = ref(false);
        // Timer Logic
        const startTimer = () => {
            timerWidth.value = 100;
            timerFrozen.value = false;
            clearInterval(timerInterval.value);

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
            timerFrozen.value = true;
            loadNextQuestion();
        };

        const loadNextQuestion = () => {
            if (questionNumber.value < totalQuestions) {
                questionNumber.value += 1;
                targetNumber.value = getRandomNumber(1, 999);
                resetTimer();
                resetGameObjects();
                clearTargetBoxes();
                loadingNextQuestion.value = false;
            } else {
                gameOver.value = true;
            }
        };

        const router = useRouter();
        const exitGame = () => {
            router.push("/game");
        };

        const restartGame = () => {
            coins.value = 0;
            questionNumber.value = 1;
            targetNumber.value = getRandomNumber(1, 999);
            gameOver.value = false;
            resetTimer();
            resetGameObjects();
            clearTargetBoxes();
        };


        const clearTargetBoxes = () => {
            [hundredsBox, tensBox, onesBox].forEach(box => {
                if (box.value) {
                    box.value.innerHTML = ''; // Clear all items from each target box
                    const countOverlay = box.value.querySelector('.tw-count-overlay');
                    if (countOverlay) countOverlay.remove(); // Remove the item count overlay if it exists
                }
            });
        };

        const resetGameObjects = () => {
            generateObjects();
            generateGrids();
            itemCounts.hundreds = itemCounts.tens = itemCounts.ones = 0;
            tempCounters.hundreds = tempCounters.tens = tempCounters.ones = 0;
            ghostCounters.hundreds = ghostCounters.tens = ghostCounters.ones = 0;
            objects.value.forEach(obj => obj.selected = false);
        };

        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const generateObjects = () => {
            let idCounter = 0;
            objects.value = [
                ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'apple', value: 1, selected: false, visible: true, image: '/assets/MarketImages/apple.png' })),
                ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'basket', value: 10, selected: false, visible: true, image: '/assets/MarketImages/basket.png' })),
                ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'crate', value: 100, selected: false, visible: true, image: '/assets/MarketImages/crate.png' }))
            ];
        };

        const generateGrids = () => {
            grids.value = ['crate', 'basket', 'apple'].map(type => objects.value.filter(obj => obj.type === type));
        };

        const toggleHintMode = () => {
            hintMode.value = true;
            objects.value.forEach(object => {
                if (object.selected) {
                    const boxType = object.value === 100 ? 'hundreds' : object.value === 10 ? 'tens' : 'ones';
                    ghostCounters[boxType]++;
                    addGhostImageToBox(object, boxType, true);
                }
            });
        };

        const toggleSelectById = (id) => {
            const object = objects.value.find(obj => obj.id === id);
            if (object) {
                object.selected = !object.selected;
                const boxType = object.value === 100 ? 'hundreds' : object.value === 10 ? 'tens' : 'ones';

                if (hintMode.value) {
                    object.selected ? addGhostImageToBox(object, boxType) : removeGhostImageFromBox(boxType);
                }
            }
        };

        const addGhostImageToBox = (object, boxType, skipCounter = false) => {
            const box = getTargetBoxByType(boxType);
            const img = document.createElement('img');
            img.src = object.image;
            img.classList.add('tw-box-object', 'tw-opacity-30');
            img.dataset.ghost = true;
            box.appendChild(img);

            if (!skipCounter) {
                ghostCounters[boxType]++;
            }
            showGhostCounterOverlay(box, ghostCounters[boxType]);
        };

        const removeGhostImageFromBox = (boxType) => {
            const box = getTargetBoxByType(boxType);
            const ghosts = box.querySelectorAll('img[data-ghost]');
            if (ghosts.length > 0) {
                ghosts[ghosts.length - 1].remove();
            }
            showGhostCounterOverlay(box, --ghostCounters[boxType]);
        };

        const showGhostCounterOverlay = (box, count) => {
            let overlay = box.querySelector('.tw-ghost-counter-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('tw-ghost-counter-overlay');
                box.appendChild(overlay);
            }
            Object.assign(overlay.style, {
                fontFamily: "'Press Start 2P', sans-serif",
                fontSize: '18px',
                color: 'gray',
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '10'
            });
            overlay.textContent = count;
        };

        const submitAnswer = () => {
            timerFrozen.value = true; // Freeze timer on submit
            loadingNextQuestion.value = true;
            if (hintMode.value) {
                document.querySelectorAll('.tw-ghost-counter-overlay').forEach(el => el.remove());
                document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
                hintMode.value = false;
            }

            const selectedObjects = objects.value.filter(obj => obj.selected && obj.visible);
            itemCounts.hundreds = itemCounts.tens = itemCounts.ones = 0;

            // If no items are selected, show zeros in target boxes sequentially
            if (selectedObjects.length === 0) {
                // Display zeros sequentially
                showItemCountOverlay(onesBox.value, 0);
                setTimeout(() => {
                    showItemCountOverlay(tensBox.value, 0);
                    setTimeout(() => {
                        showItemCountOverlay(hundredsBox.value, 0);
                    }, 200);
                }, 200);
                // Load the next question after displaying zeros
                setTimeout(() => {
                    resetStreak(); // Reset streak on incorrect answer
                    loadNextQuestion();
                }, 1000);
                return;
            }

            const groups = { 
                ones: selectedObjects.filter(obj => obj.type === 'apple'), 
                tens: selectedObjects.filter(obj => obj.type === 'basket'), 
                hundreds: selectedObjects.filter(obj => obj.type === 'crate') 
            };

            if (groups.ones.length > 0) {
                animateItems(groups.ones, 'ones', handleTensAnimationOrZero);
            } else if (groups.tens.length > 0 || groups.hundreds.length > 0) {
                setTimeout(() => showItemCountOverlay(onesBox.value, 0), 100);
                handleTensAnimationOrZero();
            }
        };

        const handleTensAnimationOrZero = () => {
            const tensGroup = objects.value.filter(obj => obj.type === 'basket' && obj.selected);
            const hundredsGroup = objects.value.filter(obj => obj.type === 'crate' && obj.selected);
            if (tensGroup.length > 0) {
                animateItems(tensGroup, 'tens', handleHundredsAnimation);
            } else if (hundredsGroup.length > 0) {
                setTimeout(() => showItemCountOverlay(tensBox.value, 0), 300);
                handleHundredsAnimation();
            } else {
                handleHundredsAnimation();
            }
        };

        const handleHundredsAnimation = () => {
            const hundredsGroup = objects.value.filter(obj => obj.type === 'crate' && obj.selected);
            animateItems(hundredsGroup, 'hundreds', () => {
                const selectedTotal = objects.value.reduce((sum, obj) => obj.selected ? sum + obj.value : sum, 0);
                
                // Check if answer is correct
                if (selectedTotal === targetNumber.value) {
                    streakCount.value += 1;

                    // Check if user is on a streak
                    if (streakCount.value > 5) {
                        isStreak.value = true;
                    }

                    // Double coins if on streak
                    coins.value += isStreak.value ? 20 : 10;
                } else {
                    resetStreak(); // Reset streak if answer is incorrect
                }

                setTimeout(() => loadNextQuestion(), 1000);
            });
        };

        const resetStreak = () => {
            streakCount.value = 0;
            isStreak.value = false;
        };

        const animateItems = (items, boxType, onComplete) => {
            if (!items.length) return onComplete();
        
            const targetBox = getTargetBoxByType(boxType);
            items.forEach((object, index) => {
                setTimeout(() => {
                    animateFlyingObject(object, () => {
                        tempCounters[boxType] = ++itemCounts[boxType];
                        showTempCounterOverlay(targetBox, tempCounters[boxType]);

                        if (index + 1 === items.length) {
                            showItemCountOverlay(targetBox, itemCounts[boxType]);
                            hideTempCounterOverlay(targetBox);
                            onComplete();
                        }
                    });
                }, index * 500);
            });
        };

        const showTempCounterOverlay = (box, count) => {
            let tempCounter = box.querySelector('.tw-temp-counter-overlay');
            if (!tempCounter) {
                tempCounter = document.createElement('div');
                tempCounter.classList.add('tw-temp-counter-overlay');
                box.appendChild(tempCounter);
            }
            Object.assign(tempCounter.style, {
                fontFamily: "'Press Start 2P', sans-serif",
                fontSize: '18px',
                color: 'black',
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '10'
            });
            tempCounter.textContent = count;
        };

        const hideTempCounterOverlay = (box) => {
            const tempCounter = box.querySelector('.tw-temp-counter-overlay');
            if (tempCounter) tempCounter.remove();
            box.querySelectorAll('.tw-box-object').forEach(item => item.classList.remove('tw-blurred-item'));
        };
        
        const animateFlyingObject = (object, onComplete) => {
            const objectElement = getObjectElementById(object.id);
            if (!objectElement) return onComplete();

            const targetBox = getTargetBox(object.value);
            const objectRect = objectElement.getBoundingClientRect();
            const targetRect = targetBox.getBoundingClientRect();

            const newTop = targetRect.top + window.scrollY + targetRect.height / 2 - objectRect.height / 2;
            const newLeft = targetRect.left + window.scrollX + targetRect.width / 2 - objectRect.width / 2;

            const clonedElement = objectElement.cloneNode(true);
            clonedElement.style.position = 'absolute';
            clonedElement.style.top = `${objectRect.top + window.scrollY}px`;
            clonedElement.style.left = `${objectRect.left + window.scrollX}px`;
            clonedElement.style.width = `${objectRect.width}px`;
            clonedElement.style.height = `${objectRect.height}px`;
            clonedElement.style.transition = 'none';
            document.body.appendChild(clonedElement);

            clonedElement.getBoundingClientRect();
            clonedElement.style.transition = 'top 0.3s ease-in-out, left 0.3s ease-in-out';

            requestAnimationFrame(() => {
                clonedElement.style.top = `${newTop}px`;
                clonedElement.style.left = `${newLeft}px`;

                clonedElement.addEventListener('transitionend', () => {
                    clonedElement.remove();
                    moveObjectToBox(object);
                    object.visible = false;
                    onComplete();
                }, { once: true });
            });

            objectElement.style.visibility = 'hidden';
        };

        const getObjectElementById = (id) => {
            return [...document.querySelectorAll('[data-id]')].find(el => el.dataset.id == id && el.style.visibility !== 'hidden');
        };

        const moveObjectToBox = (object) => {
            const box = getTargetBox(object.value);
            const imgElement = document.createElement('img');
            imgElement.src = object.image;
            imgElement.className = 'tw-box-object';
            box.appendChild(imgElement);
        };

        const getTargetBox = (value) => {
            return value === 100 ? hundredsBox.value 
                : value === 10 ? tensBox.value 
                : onesBox.value;
        };
        
        const getTargetBoxByType = (boxType) => {
            return boxType === 'hundreds' ? hundredsBox.value 
                : boxType === 'tens' ? tensBox.value 
                : onesBox.value;
        };

        const showItemCountOverlay = (box, count) => {
            if (!box || typeof box.querySelector !== 'function') return;

            let overlay = box.querySelector('.tw-count-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('tw-count-overlay');
                box.appendChild(overlay);
            }
            Object.assign(overlay.style, {
                fontFamily: "'Press Start 2P', sans-serif",
                fontSize: '200px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '10'
            });
            overlay.textContent = count;

            box.querySelectorAll('.tw-box-object').forEach(item => item.classList.add('tw-blurred-item'));
        };

        const getHint = (answer) => {
            showHintModal.value = false;
            if (!answer && hintMode.value) {
                hintMode.value = false;
                clearGhostElements();
            } else {
                toggleHintMode();
            }
        };

        const clearGhostElements = () => {
            document.querySelectorAll('.tw-ghost-counter-overlay').forEach(el => el.remove());
            document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
            ghostCounters.hundreds = ghostCounters.tens = ghostCounters.ones = 0;
        };

        onMounted(() => {
            targetNumber.value = getRandomNumber(1, 999);
            generateObjects();
            generateGrids();
            startTimer(); // Start the timer on mount
        });

        return {
            targetNumber,
            showHintModal,
            hintMode,
            labels,
            grids,
            objects,
            hundredsBox,
            tensBox,
            onesBox,
            timerWidth,
            toggleSelectById,
            submitAnswer,
            getHint,
            toggleHintMode,
            addGhostImageToBox,
            removeGhostImageFromBox,
            showGhostCounterOverlay,
            animateItems,
            handleTensAnimationOrZero,
            handleHundredsAnimation,
            showTempCounterOverlay,
            hideTempCounterOverlay,
            animateFlyingObject,
            getObjectElementById,
            moveObjectToBox,
            getTargetBox,
            getTargetBoxByType,
            showItemCountOverlay,
            clearGhostElements,
            startTimer,
            coins,
            questionNumber,
            totalQuestions,
            gameOver,
            completionMessage,
            router,
            exitGame,
            restartGame,
            loadingNextQuestion,
            isStreak,
            streakCount,
            resetStreak
        };
    }
};
</script>
  
<style scoped>
    /* Counting Styles */
    /* Basic Reset */
    * {
    font-family: 'Press Start 2P', sans-serif;
    }
    
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
        width: 150px; /* Set fixed width to match the width of "Restart" text */
        margin: 0 20px; /* Add spacing between buttons */
    }

    body { margin: 0; }
    .tw-min-h-screen { min-height: 100vh; }

    /* Game Box and Object Grid */
    .target-box {
    width: 300px;
    height: 300px;
    border: 2px solid gray;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 10px;
    overflow: hidden;
    position: relative;
    }

    .grid-container {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    margin-bottom: 20px;
    }

    .object-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    }

    .object {
    width: 80px;
    height: 80px;
    transition: transform 1s ease-in-out, top 1s ease-in-out, left 1s ease-in-out;
    position: relative;
    }

    .tw-box-object { width: 60px; height: 60px; margin: 5px; object-fit: contain; }

    /* Animations */
    .selected { animation: wiggle 0.5s infinite; }
    .tw-blurred-item { filter: blur(6px); }

    /* Wiggle animation */
    @keyframes wiggle {
    0%, 100% { transform: rotate(0); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
    }
    /* Counting Styles */
</style>