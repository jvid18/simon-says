const gameElement = document.getElementById('game');

const red = document.getElementById('red');
const blue = document.getElementById('blue');
const green = document.getElementById('green');
const yellow = document.getElementById('yellow');

const btnStartGame = document.getElementById('btnStartGame');
const LAST_LEVEL = 10;
const TIME_BETWEEN_COLORS = 1000;

class Game {
  constructor() {
    this.init = this.init.bind(this);
    this.addClickEvents = this.addClickEvents.bind(this);
    this.chooseColor = this.chooseColor.bind(this);
    this.nextLevel = this.nextLevel.bind(this);

    this.init();
    this.generateSequence();
    setTimeout(this.nextLevel, 500);
  }

  init() {
    this.toggleElements();
    this.levelElement = document.getElementById('currentLevel');

    this.level = 1;
    this.colors = {
      red, blue, green, yellow
    };
  }

  toggleElements() {
    gameElement.classList.toggle('is-started');
    btnStartGame.classList.toggle('is-hide');
  }

  generateSequence() {
    this.sequence = new Array(LAST_LEVEL)
      .fill(0)
      .map(n => Math.floor(Math.random() * 4));
  }

  nextLevel() {
    this.levelElement.innerHTML = this.level;
    this.sublevel = 0;
    this.illuminateSequence();

    const time = TIME_BETWEEN_COLORS * this.level;
    setTimeout(() => {
      this.addClickEvents();
      this.termSequence();
    }, time);
  }

  transformNumberToColor(num) {
    switch (num) {
      case 0:
        return 'red';
      case 1:
        return 'blue';
      case 2:
        return 'green';
      case 3:
        return 'yellow';
    }
  }

  transformColorToNumber(color) {
    switch (color) {
      case 'red':
        return 0;
      case 'blue':
        return 1;
      case 'green':
        return 2;
      case 'yellow':
        return 3;
    }
  }

  illuminateSequence() {
    gameElement.classList.remove('is-waiting-for-user');
    gameElement.classList.add('is-showing-sequence');

    for (let i = 0; i < this.level; i++) {
      const color = this.transformNumberToColor(this.sequence[i]);
      setTimeout(() => this.illuminateColor(color), TIME_BETWEEN_COLORS * i);
    }
  }

  illuminateColor(color) {
    this.colors[color].classList.add('is-active');
    setTimeout(() => this.turnOffColor(color), 300);
  }

  turnOffColor(color) {
    this.colors[color].classList.remove('is-active');
  }

  termSequence() {
    gameElement.classList.remove('is-showing-sequence');
    gameElement.classList.add('is-waiting-for-user');
  }

  addClickEvents() {
    this.colors.red.addEventListener('click', this.chooseColor);
    this.colors.blue.addEventListener('click', this.chooseColor);
    this.colors.green.addEventListener('click', this.chooseColor);
    this.colors.yellow.addEventListener('click', this.chooseColor);
  }

  removeClickEvents() {
    this.colors.red.removeEventListener('click', this.chooseColor);
    this.colors.blue.removeEventListener('click', this.chooseColor);
    this.colors.green.removeEventListener('click', this.chooseColor);
    this.colors.yellow.removeEventListener('click', this.chooseColor);
  }

  chooseColor(ev) {
    const colorName = ev.target.dataset.color;
    const numColor = this.transformColorToNumber(colorName);

    this.illuminateColor(colorName);

    if (numColor === this.sequence[this.sublevel]) {
      this.sublevel++;

      if (this.sublevel === this.level) {
        this.level++;

        this.removeClickEvents();
        if (this.level === (LAST_LEVEL + 1)) {
          // Win
          this.gameWin();
        } else {
          setTimeout(this.nextLevel, 1500);
        }
      }
    } else {
      // Lose
      this.gameLose();
    }
  }

  gameWin() {
    swal({
      icon: 'success',
      title: 'You Win. :)',
      text: ''
    })
    .then(this.init);
  }

  gameLose() {
    swal({
      icon: 'error',
      title: 'You lose. :(',
      text: 'But you can try it again, don\'t give up!'
    })
    .then(() => {
      this.removeClickEvents();
      this.init();
    });
  }
}

const startGame = () => {
  console.log('El juego comenzo');

  window.game = new Game();
};

btnStartGame.addEventListener('click', startGame);