new Vue({
    el: "#app",
    data() {
      return {
        queues: Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          correctOrdinal: null,
          assignedOrdinal: null,
        })),
        ordinalNumbers: ["1st", "2nd", "3rd", "4th"],
        draggedOrdinal: null,
        finishOrder: [], // Track the order in which customers finish
        feedbackMessage: '',
        feedbackClass: '',
      };
    },
    mounted() {
      this.resetCustomers();
      setTimeout(() => this.startRace(), 100);
    },
    methods: {
      resetCustomers() {
        this.queues.forEach((queue) => {
          const customer = document.getElementById(`customer-${queue.id - 1}`);
          customer.style.transition = "none";
          customer.style.left = "5px";
          customer.offsetHeight; // Force reflow
          customer.style.transition = "left 3s linear";
        });
      },
      startRace() {
        const shuffledQueues = [...this.queues].sort(() => Math.random() - 0.5);
        let cumulativeDelay = 0;
  
        shuffledQueues.forEach((queue) => {
          const customer = document.getElementById(`customer-${queue.id - 1}`);
          const finishPosition = 90;
  
          setTimeout(() => {
            customer.style.left = `${finishPosition}%`;
  
            setTimeout(() => {
              this.finishOrder.push(queue.id - 1);
              this.assignCorrectOrdinals();
            }, 3000);
          }, cumulativeDelay);
  
          cumulativeDelay += Math.random() * 800 + 200;
        });
      },
      assignCorrectOrdinals() {
        if (this.finishOrder.length === this.queues.length) {
          this.finishOrder.forEach((queueIndex, position) => {
            const ordinals = ["1st", "2nd", "3rd", "4th"];
            this.queues[queueIndex].correctOrdinal = ordinals[position];
          });
        }
      },
      dragStart(event, number) {
        this.draggedOrdinal = number;
      },
      allowDrop(event) {
        event.preventDefault();
      },
      drop(event, index) {
        if (this.draggedOrdinal) {
          this.queues[index].assignedOrdinal = this.draggedOrdinal;
          this.draggedOrdinal = null;
        }
      },
      checkAnswer() {
        let allCorrect = true;
  
        this.queues.forEach((queue) => {
          const customer = document.getElementById(`customer-${queue.id - 1}`);
          if (queue.correctOrdinal === queue.assignedOrdinal) {
            customer.classList.add("correct");
          } else {
            allCorrect = false;
          }
        });
  
        if (allCorrect) {
          this.feedbackMessage = 'Correct! 🎉';
          this.feedbackClass = 'text-success';
          this.animateObjects();
        } else {
          this.feedbackMessage = 'Try Again! ❌';
          this.feedbackClass = 'text-danger';
        }
      },
      animateObjects() {
        this.queues.forEach((queue) => {
          const customer = document.getElementById(`customer-${queue.id - 1}`);
          if (queue.correctOrdinal === queue.assignedOrdinal) {
            customer.classList.add("correct");
          }
        });
  
        setTimeout(() => {
          this.queues.forEach((queue) => {
            const customer = document.getElementById(`customer-${queue.id - 1}`);
            customer.classList.remove("correct");
          });
        }, 1000);
      },
    },
  });