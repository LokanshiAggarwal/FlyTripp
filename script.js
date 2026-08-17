/* =========================================================
   FLYTRIPP
   CINEMATIC TRAVEL ENGINE
========================================================= */


/* =========================================================
   VIDEOS
========================================================= */

const videos = [

    document.querySelector("#video1"),

    document.querySelector("#video2"),

    document.querySelector("#video3"),

    document.querySelector("#video4"),

    document.querySelector("#video5"),

    document.querySelector("#video6"),

    document.querySelector("#video7")

].filter(Boolean);



/* =========================================================
   SCENE DATA
========================================================= */

const sceneData = [

    {
        title: "MANALI",
        category: "HIMACHAL PRADESH"
    },

    {
        title: "UDAIPUR",
        category: "RAJASTHAN · CITY OF LAKES"
    },

    {
        title: "UDAIPUR",
        category: "BEAUTIFUL CITY & CULTURE OF RAJASTHAN"
    },

    {
        title: "LADAKH",
        category: "THE LAND OF HIGH PASSES"
    },

    {
        title: "LADAKH",
        category: "HIMALAYAS"
    },

    {
        title: "LADAKH",
        category: "MOUNTAINS · ROADS · ADVENTURE"
    },

    {
        title: "GOA",
        category: "BEACHES · SUNSETS · FREEDOM"
    }

];



/* =========================================================
   DOM ELEMENTS
========================================================= */

const journey =
    document.querySelector(
        ".cinematic-section"
    );


const sceneNumber =
    document.querySelector(
        "#sceneNumber"
    );


const sceneTitle =
    document.querySelector(
        "#sceneTitle"
    );


const sceneCategory =
    document.querySelector(
        "#sceneCategory"
    );


const hudProgress =
    document.querySelector(
        "#hudProgress"
    );


const heroCopy =
    document.querySelector(
        ".hero-copy"
    );


/* =========================================================
   DESTINATION HUD
========================================================= */

const destinationHud =
    document.querySelector(
        ".destination-hud"
    );


const loader =
    document.querySelector(
        "#loader"
    );


const loaderProgress =
    document.querySelector(
        "#loaderProgress"
    );



/* =========================================================
   STATE
========================================================= */

let targetProgress = 0;

let currentProgress = 0;

let currentVideo = 0;

let ticking = false;



/* =========================================================
   VIDEO INITIALIZATION
========================================================= */

videos.forEach(
    (video, index) => {

        if (!video) return;


        video.muted = true;

        video.playsInline = true;

        video.loop = true;

        video.preload =
            "metadata";


        /*
            First video is active.
        */

        if (index === 0) {

            video.classList.add(
                "active"
            );


            video.play()
                .catch(
                    () => {}
                );

        }

        else {

            video.pause();

        }

    }
);



/* =========================================================
   CALCULATE SCROLL PROGRESS
========================================================= */

function calculateProgress() {

    if (!journey) return;


    const rect =
        journey.getBoundingClientRect();


    const total =
        journey.offsetHeight -
        window.innerHeight;


    const travelled =
        -rect.top;


    if (total <= 0) {

        targetProgress = 0;

        return;

    }


    targetProgress =

        Math.max(
            0,
            Math.min(
                1,
                travelled / total
            )
        );

}



/* =========================================================
   SCROLL EVENT
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        calculateProgress();


        /*
            Update HUD visibility immediately
            when scrolling between sections.
        */

        updateHUDVisibility();


        if (!ticking) {

            requestAnimationFrame(
                animate
            );

            ticking = true;

        }

    },
    {
        passive: true
    }
);



/* =========================================================
   GET CURRENT SCENE
========================================================= */

function getScene(
    progress
) {

    const total =
        videos.length;


    if (total === 0) {

        return {

            index: 0,

            local: 0

        };

    }


    const raw =
        progress * total;


    let index =
        Math.floor(raw);


    index =
        Math.min(
            index,
            total - 1
        );


    let local;


    if (
        index === total - 1
    ) {

        local = 1;

    }

    else {

        local =
            raw - index;

    }


    return {

        index,

        local

    };

}



/* =========================================================
   SWITCH VIDEO
========================================================= */

function switchVideo(
    newIndex
) {

    if (
        newIndex === currentVideo
    ) {

        return;

    }


    const oldVideo =
        videos[
            currentVideo
        ];


    const newVideo =
        videos[
            newIndex
        ];


    if (!newVideo) {

        return;

    }


    /*
        Stop old video.
    */

    if (oldVideo) {

        oldVideo.pause();


        oldVideo.classList.remove(
            "active"
        );

    }


    /*
        Activate new video.
    */

    newVideo.classList.add(
        "active"
    );


    /*
        Start new video
        from the beginning.
    */

    try {

        newVideo.currentTime = 0;

    }

    catch (error) {

        console.warn(
            "Could not reset video",
            error
        );

    }


    /*
        Play.
    */

    newVideo.play()
        .catch(
            () => {}
        );


    currentVideo =
        newIndex;

}



/* =========================================================
   VIDEO PLAYBACK
========================================================= */

function updateVideoPlayback() {

    const scene =
        getScene(
            currentProgress
        );


    const activeVideo =
        videos[
            scene.index
        ];


    if (!activeVideo) {

        return;

    }


    videos.forEach(
        (video, index) => {

            if (
                index === scene.index
            ) {

                if (
                    video.paused
                ) {

                    video.play()
                        .catch(
                            () => {}
                        );

                }

            }

            else {

                if (
                    !video.paused
                ) {

                    video.pause();

                }

            }

        }
    );

}



/* =========================================================
   UPDATE DESTINATION HUD
========================================================= */

function updateHUD() {

    const scene =
        getScene(
            currentProgress
        );


    const data =
        sceneData[
            scene.index
        ];


    if (!data) {

        return;

    }


    /*
        Number
    */

    if (sceneNumber) {

        sceneNumber.textContent =

            String(
                scene.index + 1
            ).padStart(
                2,
                "0"
            );

    }


    /*
        Category
    */

    if (sceneCategory) {

        sceneCategory.textContent =
            data.category;

    }


    /*
        Title
    */

    if (sceneTitle) {

        sceneTitle.textContent =
            data.title;

    }


    /*
        Progress
    */

    if (hudProgress) {

        hudProgress.style.width =

            `${scene.local * 100}%`;

    }

}



/* =========================================================
   SHOW / HIDE DESTINATION HUD
========================================================= */

function updateHUDVisibility() {

    if (!destinationHud || !journey) {

        return;

    }


    const rect =
        journey.getBoundingClientRect();


    /*
        HUD is visible only while
        cinematic section is on screen.
    */

    if (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    ) {

        destinationHud.classList.remove(
            "hud-hidden"
        );

    }

    /*
        Hide HUD after leaving
        cinematic section.
    */

    else {

        destinationHud.classList.add(
            "hud-hidden"
        );

    }

}



/* =========================================================
   HERO MOTION
========================================================= */

function updateHeroMotion() {

    if (!heroCopy) {

        return;

    }


    /*
        Fade hero as user
        starts travelling.
    */

    const fade =

        Math.max(
            0,
            1 -
            currentProgress * 5
        );


    heroCopy.style.opacity =
        fade;


    /*
        Slight vertical movement.
    */

    const movement =

        currentProgress * -80;


    heroCopy.style.transform =

        `translateY(${movement}px)`;

}



/* =========================================================
   MAIN ANIMATION
========================================================= */

function animate() {


    /*
        Smooth scroll interpolation.
    */

    currentProgress +=

        (
            targetProgress -
            currentProgress
        ) * 0.075;


    /*
        Prevent tiny floating.
    */

    if (

        Math.abs(
            targetProgress -
            currentProgress
        ) < 0.0001

    ) {

        currentProgress =
            targetProgress;

    }


    /*
        Current scene.
    */

    const scene =
        getScene(
            currentProgress
        );


    /*
        Change video.
    */

    switchVideo(
        scene.index
    );


    /*
        Keep active video playing.
    */

    updateVideoPlayback();


    /*
        Update HUD.
    */

    updateHUD();

    updateHUDVisibility();


    /*
        Hero animation.
    */

    updateHeroMotion();


    /*
        Hide loader.
    */

    if (

        loader &&
        currentProgress > 0.005

    ) {

        loader.classList.add(
            "done"
        );

    }


    ticking = false;


    /*
        Continue animation while
        smooth scrolling is happening.
    */

    if (

        Math.abs(
            targetProgress -
            currentProgress
        ) > 0.0001

    ) {

        requestAnimationFrame(
            animate
        );

        ticking = true;

    }

}



/* =========================================================
   INITIAL STATE
========================================================= */

calculateProgress();


currentProgress =
    targetProgress;


currentVideo = 0;


if (
    videos.length > 0
) {

    videos[0].classList.add(
        "active"
    );

}


updateHUD();

updateHUDVisibility();

updateHeroMotion();



/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.querySelector(
        "#menuButton"
    );


const mainNav =
    document.querySelector(
        "#mainNav"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            if (mainNav) {

                mainNav.classList.toggle(
                    "open"
                );

            }

        }
    );

}



/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

if (mainNav) {

    const links =
        mainNav.querySelectorAll(
            "a"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove(
                        "open"
                    );

                }
            );

        }
    );

}



/* =========================================================
   TRIP FORM
========================================================= */

const form =
    document.querySelector(
        "#tripForm"
    );


const formMessage =
    document.querySelector(
        "#formMessage"
    );


if (form) {

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const data =
                new FormData(
                    form
                );


            const name =
                data.get(
                    "name"
                );


            const phone =
                data.get(
                    "phone"
                );


            const destination =
                data.get(
                    "destination"
                );


            const message =
                data.get(
                    "message"
                );


            /*
                WhatsApp message.
            */

            const whatsappMessage =

                `Hello FlyTripp!\n\n` +

                `Name: ${name}\n` +

                `Phone: ${phone}\n` +

                `Destination: ${destination}\n` +

                `Message: ${
                    message ||
                    "Not specified"
                }`;


            const whatsappURL =

                "https://wa.me/919217029779?text=" +

                encodeURIComponent(
                    whatsappMessage
                );




            if (formMessage) {

                formMessage.textContent =
                    "Opening WhatsApp...";

            }


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}



/* =========================================================
   LOADER
========================================================= */

let fakeProgress = 0;


const loaderTimer =

    setInterval(
        () => {

            fakeProgress +=
                Math.random() * 10;


            if (
                fakeProgress >= 100
            ) {

                fakeProgress = 100;


                clearInterval(
                    loaderTimer
                );

            }


            if (
                loaderProgress
            ) {

                loaderProgress.style.width =

                    `${fakeProgress}%`;

            }

        },
        100
    );



/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                if (loader) {

                    loader.classList.add(
                        "done"
                    );

                }

            },
            1400
        );

    }
);



/* =========================================================
   TAB VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            videos.forEach(
                video => {

                    video.pause();

                }
            );

        }

        else {

            const activeVideo =
                videos[
                    currentVideo
                ];


            if (activeVideo) {

                activeVideo.play()
                    .catch(
                        () => {}
                    );

            }

        }

    }
);



/* =========================================================
   SAVE DATA / SLOW CONNECTION
========================================================= */

if (
    "connection" in navigator
) {

    const connection =
        navigator.connection;


    if (
        connection.saveData
    ) {

        videos.forEach(
            video => {

                video.preload =
                    "none";

            }
        );

    }

}



/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        calculateProgress();

        updateHUDVisibility();

    }
);



/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "✈️ FlyTripp cinematic engine loaded."
);


console.log(
    `🎥 ${videos.length} travel videos detected.`
);



/* =========================================================
   DESTINATION CAROUSEL
========================================================= */

const destinationTrack =
    document.querySelector(
        "#destinationTrack"
    );


const destinationPrev =
    document.querySelector(
        "#destinationPrev"
    );


const destinationNext =
    document.querySelector(
        "#destinationNext"
    );


let destinationIndex = 0;



function getDestinationStep() {

    const card =
        destinationTrack?.querySelector(
            ".destination-card"
        );


    if (!card) return 0;


    const gap =
        parseFloat(
            getComputedStyle(
                destinationTrack
            ).gap
        ) || 0;


    return (
        card.offsetWidth +
        gap
    );

}



function getVisibleCards() {

    const carousel =
        document.querySelector(
            ".destination-carousel"
        );


    const card =
        destinationTrack?.querySelector(
            ".destination-card"
        );


    if (!carousel || !card) {

        return 1;

    }


    return Math.max(
        1,
        Math.floor(
            carousel.clientWidth /
            getDestinationStep()
        )
    );

}



function updateDestinationCarousel() {

    if (!destinationTrack) return;


    const cards =
        destinationTrack.querySelectorAll(
            ".destination-card"
        );


    const visible =
        getVisibleCards();


    const maxIndex =
        Math.max(
            0,
            cards.length - visible
        );


    destinationIndex =
        Math.max(
            0,
            Math.min(
                destinationIndex,
                maxIndex
            )
        );


    const distance =
        destinationIndex *
        getDestinationStep();


    destinationTrack.style.transform =

        `translate3d(
            -${distance}px,
            0,
            0
        )`;


    if (destinationPrev) {

        destinationPrev.disabled =
            destinationIndex <= 0;

    }


    if (destinationNext) {

        destinationNext.disabled =
            destinationIndex >= maxIndex;

    }

}



/* =========================================================
   NEXT
========================================================= */

if (destinationNext) {

    destinationNext.addEventListener(
        "click",
        () => {

            destinationIndex++;

            updateDestinationCarousel();

        }
    );

}



/* =========================================================
   PREVIOUS
========================================================= */

if (destinationPrev) {

    destinationPrev.addEventListener(
        "click",
        () => {

            destinationIndex--;

            updateDestinationCarousel();

        }
    );

}



/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


if (destinationTrack) {

    destinationTrack.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    destinationTrack.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchStartX -
                touchEndX;


            if (
                Math.abs(difference) < 45
            ) {

                return;

            }


            if (
                difference > 0
            ) {

                destinationIndex++;

            }

            else {

                destinationIndex--;

            }


            updateDestinationCarousel();

        },
        {
            passive: true
        }
    );

}



/* =========================================================
   MOUSE WHEEL HORIZONTAL CONTROL
========================================================= */

const destinationCarousel =
    document.querySelector(
        ".destination-carousel"
    );


if (destinationCarousel) {

    destinationCarousel.addEventListener(
        "wheel",
        event => {

            /*
                Only react to strong
                horizontal scrolling.
            */

            if (
                Math.abs(
                    event.deltaX
                ) >
                Math.abs(
                    event.deltaY
                )
            ) {

                event.preventDefault();


                if (
                    event.deltaX > 0
                ) {

                    destinationIndex++;

                }

                else {

                    destinationIndex--;

                }


                updateDestinationCarousel();

            }

        },
        {
            passive: false
        }
    );

}



/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateDestinationCarousel();

    }
);



/* =========================================================
   INITIALIZE DESTINATION CAROUSEL
========================================================= */

setTimeout(
    () => {

        updateDestinationCarousel();

    },
    100
);


/* =========================================================
   FLOATING WHATSAPP
========================================================= */

const whatsappButton =
    document.querySelector(".floating-whatsapp");

if (whatsappButton) {

    whatsappButton.style.opacity = "0";
    whatsappButton.style.transform = "scale(0.5)";

    setTimeout(() => {

        whatsappButton.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        whatsappButton.style.opacity = "1";
        whatsappButton.style.transform = "scale(1)";

    }, 1200);

}