window.onload = () => {
    var n = 1;
    var heart = document.getElementById('heart');
    var scaleBig = true;
    var m = setInterval(() => {

        if (scaleBig == true) {
            n = n + 0.01;
        }

        if (scaleBig == false) {
            n = n - 0.01;
        }

        if (n >= 1.2) {
            n = n - 0.01;
            scaleBig = false;
        }

        if (n <= 1) {
            scaleBig = true;
        }

        heart.style.transform = 'scale(' + n + ')';

    }, 1000 / 30);

    var m = document.getElementById('m');
    button.onclick = function () {
        m.classList.add("n");
    }


}

