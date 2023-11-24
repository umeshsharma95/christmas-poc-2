document.addEventListener("DOMContentLoaded", function() {
	const sceneEl = document.querySelector('a-scene');
	let arSystem;
	sceneEl.addEventListener('loaded', function () {
	  arSystem = sceneEl.systems["mindar-image-system"];
	});

  const musicInstance = new Audio('./music.mp3')
  const playMusic = () => {
    musicInstance.play()
  }

  const stopMusic = () => {
    musicInstance.pause()
    musicInstance.load()
  }
  handleTimer()

  if(false) {
    console.log('target lost');
    stopMusic()
    showSnow(false)
  }

  function handleTimer() {
    var counter = 3;
    var timer = setInterval(function() { 
      const countContainer = document.getElementById('countContainer')
      const modelContainer = document.getElementById('modelContainer')
      let countdown = '<span id="countdown">'+counter+'</span>'; 
      countContainer.innerHTML = counter > 0 ? countdown : '' 
      if(counter == 0) {
        playMusic()
        showSnow(true)
        modelContainer.style.display = 'block'
      }    
      setTimeout(() => {
        const countdown = document.getElementById('countdown')
        if (counter >-1) {
          countdown.style.fontSize = '40vw'
          countdown.style.opacity = 0
        } else {
          countdown.style.fontSize = '10vw'
          countdown.style.opacity = 1
        }
      },20);
      counter--;
      if (counter == -1) clearInterval(timer);
    }, 1000);
  }

  let snowflakesCount = 200; // Snowflake count, can be overwritten by attrs
  let baseCSS = ``;

  let bodyHeightPx = null;
  let pageHeightVh = null;

  function setHeightVariables() {
    bodyHeightPx = document.body.offsetHeight;
    pageHeightVh = (100 * bodyHeightPx / window.innerHeight);
  }

  // get params set in snow div
  function getSnowAttributes() {
    const snowWrapper = document.getElementById('snow');
    snowflakesCount = Number(
      snowWrapper?.dataset?.count || snowflakesCount
    );
  }

  // This function allows you to turn on and off the snow
  function showSnow(value) {
    if (value) {
      createSnow()
      document.getElementById('snow').style.display = "block";
    }
    else {
      document.getElementById('snow').style.display = "none";
    }
  }

  // Creating snowflakes
  function generateSnow(snowDensity = 200) {
    snowDensity -= 1;
    const snowWrapper = document.getElementById('snow');
    snowWrapper.innerHTML = '';
    for (let i = 0; i < snowDensity; i++) {
      let board = document.createElement('div');
      board.className = "snowflake";
      snowWrapper.appendChild(board);
    }
  }

  function getOrCreateCSSElement() {
    let cssElement = document.getElementById("psjs-css");
    if (cssElement) return cssElement;

    cssElement = document.createElement('style');
    cssElement.id = 'psjs-css';
    document.head.appendChild(cssElement);
    return cssElement;
  }

  // Append style for each snowflake to the head
  function addCSS(rule) {
    const cssElement = getOrCreateCSSElement();
    cssElement.innerHTML = rule; // safe to use innerHTML
    document.head.appendChild(cssElement);
  }

  // Math
  function randomInt(value = 100) {
    return Math.floor(Math.random() * value) + 1;
  }

  function randomIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Create style for snowflake
  function generateSnowCSS(snowDensity = 200) {
    let snowflakeName = "snowflake";
    let rule = baseCSS;

    for (let i = 1; i < snowDensity; i++) {
      let randomX = Math.random() * 100; // vw
      let randomOffset = Math.random() * 10 // vw;
      let randomXEnd = randomX + randomOffset;
      let randomXEndYoyo = randomX + (randomOffset / 2);
      let randomYoyoTime = getRandomArbitrary(0.3, 0.8);
      let randomYoyoY = randomYoyoTime * pageHeightVh; // vh
      let randomScale = Math.random();
      let fallDuration = randomIntRange(10, pageHeightVh / 10 * 3); // s
      let fallDelay = randomInt(pageHeightVh / 10 * 3) * -1; // s
      let opacity = Math.random();

      rule += `
        .${snowflakeName}:nth-child(${i}) {
          opacity: ${opacity};
          transform: translate(${randomX}vw, -10px) scale(${randomScale});
          animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
        }
        @keyframes fall-${i} {
          ${randomYoyoTime * 100}% {
            transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
          }
          to {
            transform: translate(${randomXEndYoyo}vw, ${pageHeightVh}vh) scale(${randomScale});
          }
        }
      `
    }
    addCSS(rule);
  }

  // Load the rules and execute after the DOM loads
  function createSnow() {
    setHeightVariables();
    getSnowAttributes();
    generateSnowCSS(snowflakesCount);
    generateSnow(snowflakesCount);
  };


  // window.addEventListener('resize', createSnow);

});

