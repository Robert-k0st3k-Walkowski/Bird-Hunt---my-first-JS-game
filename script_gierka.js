const canvas = document.getElementById("pole");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const start = document.getElementById("start");
const controls = document.getElementById("controls");
const controlLeft = document.getElementById("controlLeft");
const controlRight = document.getElementById("controlRight");
const controlSpace = document.getElementById("controlSpace");
const back = document.getElementById("back");
const menu = document.getElementById("menu");
const body = document.body

canvas.style.display = "none";

//Powyżej zsotały zdefiniowane wszystkie zmienne dotyczące
//"canvas", czyli jedynego elementu HTML w moim pliku.
//Poza tym zostały powyżej zdefiniowane zmienne, dotyczące
//przycisków w menu głównym całej gry oraz opisy sterowania.
//Dodatkowo jest napisana komenda do wyłączenia canvasa,
//by menu przed rozpoczęciem gry wyświetlało się prawidłowo.

start.addEventListener("click", () => {

    menu.style.display = "none";
    canvas.style.display = "block";    
    body.style.backgroundImage = "url(background_plantation_game.png)";
    body.style.backgroundSize = "100% 131%";

    startGame();

});

//Powyższa instrukcja "start.addEventListener" sprawia, że kiedy
//w menu początkowym gry klikniemy przycisk "START GAME", to
//automatycznie usuwa nam się menu i rozpoczyna się gra!

controls.addEventListener("click", () => {

    start.style.display = "none";
    controls.style.display = "none";
    body.style.backgroundSize = "100% 165%";
    controlLeft.style.display = "block";
    controlRight.style.display = "block";
    controlSpace.style.display = "block";

});

//Powyższa instrukcja "controls.addEventListener" sprawia, że kiedy
//w menu początkowym gry klikniemy przycisk "CONTROLS", to
//automatycznie usuwają się wszystkie przyciski poza przyciskiem
//"BACK" i pokazuje się sterowanie w grze.

back.addEventListener("click", () => {

    start.style.display = "block";
    controls.style.display = "block";
    body.style.backgroundSize = "100% 155%";
    controlLeft.style.display = "none";
    controlRight.style.display = "none";
    controlSpace.style.display = "none";

});

//Powyższa instrukcja "back.addEventListener" sprawia, że kiedy
//klikniemy przycisk "BACK", to sprawia, że np. gdy jesteśmy
//w sekcji "CONTROLS", to powraca nam do głównego menu, żeby
//móc kliknąć "START GAME" i rozpocząć obronę naszej farmy.

const barrel = {x:750, y:615, width: 15, height: 65, vx: 7};
const side1 = {x:745, y:630, width: 5, height: 50, vx: 7};
const side2 = {x:765, y:630, width: 5, height: 50, vx: 7};

//Powyżej zostały zdefiniowane 3 stałe objekty, które razem
//tworzą strzeblę w grze. Ustawiona jest tutaj pozycja "x" i "y"
//lufy oraz boków broni, ich szerokości i wysokości oraz
//przyspieszenie, z jakim mają się one poruszać wzdłuż osi "x"

const bullets = [];
const birds = [];
const keys = [];

//Powyżej są zdefioniowane 3 tablice, które służą do przechowywania
//generowanych rzeczy, takich jak (od góry): pociski, ptaki czy klawisze.

let lives = 5;
let score = 0;

//Powyżej zdefioniowane są 3 zmienne za pomocą słowa "let", które odnoszą
//się do (od góry): ilości żyć gracza oraz wyniku. 

let music = new Audio("Old MacDonald (Instrumental).mp3");
music.loop = true;
music.volume = 0.2;


let hit = new Audio("Something being hit - Sound Effect.mp3");
hit.volume = 0.1;

let shoutgun = new Audio("Doom Shotgun Sound Effect.mp3");
shoutgun.volume = 0.1;

let win = new Audio("Victory Sound Effect.mp3");
win.volume = 0.1;

let lose = new Audio("Game Over Sound Effect.mp3");
lose.volume = 0.1;

//Powyżej zdefiniowane zostały 4 zmienne, które jako wartość przyjmują
//nową klasę "Audio", które mają za zadanie odtwarzać odpowiednio 4 pliki
//Audio z (od góry): muzyką ogólną, dźwiękiem uderzenia w ptaka, dźwiękiem
//wystrzału z broni, dźwiękiem zwycięstwa oraz dźwiękiem przegranej.

//Poniższa funkcja "startGame" ma za zadanie sprawić, gdy po naciśnięciu
//przycisku "Start Game" w menu gry, rozpoczyna się prawidłowa już
//rozgrywka.

function startGame()
{
    class Bullet
    {
        constructor()
        {
            this.x = barrel.x+7.5;
            this.y = barrel.y;
            this.vx = 0;
            this.vy = -10;
            this.radius = 6;
            this.startAngle = 0;
            this.endAngle = 2 * Math.PI;
        };
    };

    //Powyżej zdefiniowana została klasa "Bullet" i określone jej parametry.
    //Służy ona do generowania pocisku, jego pozycji oraz prędkości.

    class Bird
    {
        constructor()
        {
            this.x = (Math.random() * 1515) + 1;
            this.y = 0;
            this.vx = 0;
            this.vy = 0.5;
            this.radius = 20
            this.startAngle = 0;
            this.endAngle = 2 * Math.PI;
        };
    };

    //Powyżej została zdefioniowana klasa "Bird" i określone jej parametry.
    //Służy ona do generowania ptaka, jego pozycji oraz prędkości i losowości
    //miejsca, w jakim się pojawiają nowe ptaki.

    barrel.draw = function()
    {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    //Powyższa funkcja odpowiada za rysowanie lufy całej broni

    side1.draw = function()
    {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    //Powyższa funkcja odpowiada za rysowanie jednego z boków naszej broni.

    side2.draw = function()
    {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    //Powyższa funkcja odpowiada za rysowanie drugiego z boków naszej broni.

    function drawLives()
    {
        const heartPixels = [
            [0,1,0,0,0,1,0],
            [1,1,1,0,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [0,1,1,1,1,1,0],
            [0,0,1,1,1,0,0],
            [0,0,0,1,0,0,0]
        ];

        const pixelSize = 5;

        for (let z = 0; z < lives; z++)
        {
            for (let y = 0; y < heartPixels.length; y++)
            {
                for (let x = 0; x < heartPixels[y].length; x++)
                {
                    if (heartPixels[y][x] === 1) {
                        ctx.fillStyle = "red";
                        ctx.fillRect(130 + z * 40 + x * pixelSize, 60 + y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
        }
    };

    //Powyższa funkcja służy do rysowania pixelowych serc, jako żyć naszego
    //gracza. Jest zdefiniowana stała tablica "heartPixels", gdzie są same
    //Zera i jedynki i potem mamy 3 zagnieżdżone w sobie pętle "for", które
    //mają za zadanie rysować w miejscu "1" pixelowy, czerwony kwadracik, a gdy
    //jest "0" to nie rysować nic.

    document.addEventListener("keydown", function(e) {
        e.preventDefault();

        keys[e.code] = true;

        if (e.code == "Space")
        {
            const bullet = new Bullet(window.innerWidth / 2, window.innerHeight / 2);
            bullets.push(bullet);

            shoutgun.play();
        }
    });

    //Powyższa funkcja odpowiada za wychwytywanie "Wydarzenia", kiedy została
    //naciśnięta "Spacja" przez gracza na klawiaturze, to ma generować nowy "Bullet"
    //(pocisk) i przy tym odtwarzać dźwięk wystrzału z broni

    document.addEventListener("keyup", function(e)
    {
        e.preventDefault();

        keys[e.code] = false;
    });

    //Powyższa funkcja sprawdza czy klawisz został puszczony i jeżeli tak, to
    //automatycznie przypisuje zmiennej "keys" wartość "false", czyli ustawia,
    //że żaden klawisz nie jest wciśnięty.

    function update()
    {

        ctx.clearRect(0,0, canvas.width, canvas.height);

        ctx.font = "20px Courier New";
        ctx.fontWeight = "bold";
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 50, 50);

    //Powyżej generujemy w "canvasie" napis "Score" i automatycznie jego wartość
    //aktualizuje się, gdy ptaszek zosatnie zabity.

        ctx.font = "20px Courier New";
        ctx.fontWeight = "bold";
        ctx.fillStyle = "black";
        ctx.fillText(`Lives: `, 50, 80);

    //Powyżej generujemy napis "Lives" w "canvasie", gdzie obok niego wyświetlają
    //się pozostałe życia gracza.
    
        barrel.draw();
        side1.draw();
        side2.draw();
        drawLives();

    //Powyżej zostały w funkcji "update" wywołane wszystkie 4 funkcje do rysowania
    //(od góry): lufy i obu boków naszej broni oraz żyć gracza.

        music.play();
    
    //Powyższa instrukcja odpala nam "zapętloną" muzykę, która ogólnie leci w naszej
    //grze oraz menu gry.

      if(keys["ArrowRight"] == true)
        {
            if (side2.x + side2.vx < canvas.width)
            {
                barrel.x += barrel.vx;
                side1.x += side1.vx;
                side2.x += side2.vx;
            }
        }

        if(keys["ArrowLeft"] == true)
        {
            if (side1.x - side1.vx > 0)
            {
                barrel.x -= barrel.vx;
                side1.x -= side1.vx;
                side2.x -= side2.vx;
            }
        }

    //Powyższe warunki "if" sprawdzają, czy zostały wciśnięte odpowiednio przyciski:
    //"ArrowRight" i "ArrowLeft" i jeżeli tak, to zmienia się pozycja całej broni, do
    //momentu, aż nie wpadną na granicę "canvasa".
    
      for (const bullet of bullets)
            {
              bullet.x += bullet.vx;
              bullet.y += bullet.vy;

              ctx.beginPath();
              ctx.fillStyle = "red";
              ctx.arc(bullet.x, bullet.y, bullet.radius, bullet.startAngle, bullet.endAngle);
              ctx.fill();

            }

    //Powyższa pętla "for" zmienia pozycje "x" i "y" dla naszych pocisków, znajdujących się
    //w tablicy "bullets" oraz rysuje ich kształt (czerwona kulka)

            for (const bird of birds)
                {
                        bird.x += bird.vx;
                        bird.y += bird.vy;

                        ctx.beginPath();
                        ctx.moveTo(bird.x - bird.radius + 10, bird.y);
                        ctx.lineTo(bird.x - bird.radius - 10, bird.y - 20);
                        ctx.lineTo(bird.x - bird.radius - 10, bird.y + 20);
                        ctx.fillStyle = "grey";
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(bird.x + bird.radius - 10, bird.y);
                        ctx.lineTo(bird.x + bird.radius + 10, bird.y - 20);
                        ctx.lineTo(bird.x + bird.radius + 10, bird.y + 20);
                        ctx.fillStyle = "grey";
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(bird.x, bird.y, bird.radius, bird.startAngle, bird.endAngle);
                        ctx.fillStyle = "grey";
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(bird.x + 14, bird.y + bird.radius - 3, 5, 0, bird.endAngle);
                        ctx.fillStyle = "white";
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(bird.x + 14, bird.y + bird.radius, 2.5, 0, bird.endAngle);
                        ctx.fillStyle = "black";
                        ctx.closePath();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(bird.x - 14, bird.y + bird.radius - 3, 5, 0, bird.endAngle);
                        ctx.fillStyle = "white";
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(bird.x - 14, bird.y + bird.radius, 2.5, 0, bird.endAngle);
                        ctx.fillStyle = "black";
                        ctx.closePath();
                        ctx.fill();

                        ctx.beginPath();
                        ctx.fillStyle = "orange";
                        ctx.moveTo(bird.x, bird.y + bird.radius + 20);
                        ctx.lineTo(bird.x + bird.radius - 10, bird.y + bird.radius);
                        ctx.lineTo(bird.x - bird.radius + 10, bird.y + bird.radius);
                        ctx.closePath();
                        ctx.fill();

                        ctx.stroke();
                }

    //Powyższa pętla "for" zmienia pozycję "x" i "y" dla ptaków, które znajdują się
    //w tablicy "birds" oraz rysuje ich kształy, według podanych wytycznych.

        for (let i = birds.length - 1; i >= 0; i--) {
        const bird = birds[i];
        
            for (let j = 0; j < bullets.length; j++) {
                const bullet = bullets[j];
            
                const dx = bird.x - bullet.x;
                const dy = bird.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const wingLength = 10;
                const birdRadiusWithWings = bird.radius + wingLength;
            
                if (distance < birdRadiusWithWings + bullet.radius) {
                    birds.splice(i, 1);
                    hit.play();
                    score += 10;
                    break;
                }
            }

    //Powyżej mamy zagnieżdżone w sobie 2 pętle "for", które odpowiadają za sprawdzanie,
    //czy położenie "x" i "y" naszych pocisków, jest aktualnie takie samo, jak położenie
    //"x" i "y" naszych ptaków i jeżeli tak, to usuwa je z tablicy "birds" oraz z naszego
    //ekranu, odtwarza dźwięk uderzenia w ptaka oraz dodaje graczowi 10pkt do jego wyniku.

                    if (bird.y + bird.vy >= canvas.height)
                    {
                        if (!bird.hitBottom)
                        {
                            bird.hitBottom = true;
                            if(lives > 0)
                            {
                                lives--;

                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                drawLives();
                            }
                        }
                    }

    //Powyższy warunek "if" sprawdza, czy pozycja "y" ptaka jest taka sama jak wysokość
    //całego "canvasa". Jeżeli tak, to usuwa graczowi jedno życie
    //(jeżeli jest ich więcej niż 0), usuwa je z ekranu i pokazuje nową ilość żyć, które
    //zostały jeszcze graczowi

                    if(score >= 250 && score < 400)
                        {
                            bird.vy = 1.5;

                        }
                    else if(score >= 400)
                        {
                            bird.vy = 3;
                        }
                    }

    //Powyższe warunki "if" i "else if" sprawdzają dany "wynik" gracza i jeżeli jest on
    //Pomiędzy "250", a "400", to zwiększa prędkość ptaka do  wartości "1.5", a jeżeli jest
    //większy lub równy "400", to zwiększa tę wartość do "3".

                if(score > 500)
                    {   
                        win.play();

                        music.pause();
                        music.volume = 0;
                        music.currentTime = 0;

                        setTimeout( () =>
                        {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            window.alert("Brawo! 👏 Uchroniłeś swoje plony przed napadem złych ptaków! 🏆👨‍🌾 Świetnie, że ci się to udało, ale następnym razem lepiej zabiezpiecz swoje pole 😂");
                        }, "500");
                    }

    //Powyższy warunek "if" sprawdza, czy wynik gracza jest większy od "500" i jeżeli tak,
    //to odtwarza muzyczkę odnośnie wygranej, wycisza muzykę ogólną i wyświetla odpowiednia
    //komunikat o wygranej.

                if(lives == 0)
                    {       
                        lose.play();

                        music.pause();
                        music.volume = 0;
                        music.currentTime = 0;

                        setTimeout( () =>
                        {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            window.alert("Sorki, ale twoja farma nie ma sensu, bo plony zostały zjedzone! 🐦😭 Odpal stronę na nowo, aby raz jeszcze spróbować uchronić swoją farmę przed złymi ptakami. 🔃");
                        }, "500")

                        document.location.reload();
                    }

    //Powyższy warunek "if" sprawdza, czy życia gracza są równe "0" i jeżeli tak,
    //to odtwarza muzyczkę odnośnie przegranej, wycisza muzykę ogólną i wyświetla odpowiednia
    //komunikat o przegranej gracza.

        window.requestAnimationFrame(update);
    };

    update();
    
    setInterval( () =>
    {

        const bird = new Bird;
        birds.push(bird);

    }, "1500");

    //Powyższa instrukcja "setInterval" sprawia, że co 1.5 sekundy pokazuje się nowy
    //ptak i zostaje wrzucany on do tablicy "birds."

}