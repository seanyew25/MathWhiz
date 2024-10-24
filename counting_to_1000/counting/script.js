new Vue({
  el: '#app',
  data: {
    targetNumber: 0, // Random target number
    objects: [
      ...Array.from({ length: 10 }, () => ({ type: 'apple', value: 1, selected: false, animate: false, image: 'images/apple.png' })),
      ...Array.from({ length: 10 }, () => ({ type: 'basket', value: 10, selected: false, animate: false, image: 'images/basket.png' })),
      ...Array.from({ length: 10 }, () => ({ type: 'crate', value: 100, selected: false, animate: false, image: 'images/crate.png'}))
    ],
    rows: [], // 6 rows to be generated dynamically
    feedbackMessage: '',
    feedbackClass: ''
  },
  mounted() {
    this.targetNumber = this.getRandomNumber(1, 1000);
    this.generateRows();
  },
  methods: {
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateRows() {
      let allObjects = [...this.objects];
      while (allObjects.length) {
        // Take 5 objects per row
        this.rows.push(allObjects.splice(0, 5));
      }
    },
    toggleSelect(rowIndex, index) {
      this.rows[rowIndex][index].selected = !this.rows[rowIndex][index].selected;
    },
    submitAnswer() {
      const total = this.rows.flat()
        .filter(obj => obj.selected)
        .reduce((sum, obj) => sum + obj.value, 0);

      if (total === this.targetNumber) {
        this.feedbackMessage = 'Correct! 🎉';
        this.feedbackClass = 'text-success';
        this.animateObjects();
      } else {
        this.feedbackMessage = 'Try Again! ❌';
        this.feedbackClass = 'text-danger';
      }
    },
    animateObjects() {
      this.rows.flat().forEach(obj => {
        if (obj.selected) obj.animate = true;
      });

      setTimeout(() => {
        this.rows.flat().forEach(obj => {
          obj.selected = false;
          obj.animate = false;
        });
      }, 1000);
    }
  }
});