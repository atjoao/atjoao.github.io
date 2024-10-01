document.addEventListener('DOMContentLoaded', function() {
    const indicator = document.getElementById('indicator'); 
    const sections = document.querySelectorAll('section[data-title]');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    }

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(entry.target.dataset.title);
                const arr = Array.from(sections);
                const index = arr.indexOf(entry.target);
                const title = entry.target.getAttribute('data-title');
                indicator.innerText = `0${index+1} - ${title}`;
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    fetch("assets/svg/wave.svg")
    .then(response => response.text())
    .then(svg => {
        document.getElementById("wavesvg").insertAdjacentHTML('beforeend', svg);
    });

    fetch("assets/svg/doublearr.svg")
    .then((r) => r.text())
    .then((r) => {
        document.querySelectorAll("#arrowdowndouble").forEach((el) => {
            el.insertAdjacentHTML('beforeend', r);
        });
    });

    document.getElementById("showsMore").addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.createElement("div");
        modal.setAttribute("class", "modal");
    
        const overlay = document.createElement("div");
        overlay.setAttribute("class", "modal-overlay");
    
        fetch("projects.html")
            .then((response) => response.text())
            .then((html) => {
                modal.innerHTML = new DOMParser().parseFromString(html, "text/html").body.innerHTML;
                
                const closeButton = document.createElement("button");
                closeButton.setAttribute("class", "modal-close");
                closeButton.innerHTML = "&times;";
                modal.appendChild(closeButton);
    
                document.body.appendChild(overlay);
                document.body.appendChild(modal);
    
                modal.classList.add("modal-show");
                overlay.classList.add("modal-overlay-show");
                document.body.style.overflow = "hidden";

                closeButton.addEventListener("click", closeModal);
                overlay.addEventListener("click", closeModal);
    
                function closeModal() {
                    document.body.style.overflow = "";
                    modal.remove();
                    overlay.remove();
                }
            })
            .catch((error) => {
                console.error("Error fetching content:", error);
            });
    });

    function promptChangeLang(){
        let userLang = navigator.language || navigator.userLanguage;
        
        if (!userLang.includes("pt")) {
            const lang = confirm("The following website is by default in portuguese. Do you want to change language to English?");
            if (lang) {
                fetch("assets/lang/en.json")
                    .then((r) => r.json())
                    .then((r) => {
                        const keys = Object.keys(r);
                        keys.forEach((key) => {
                            
                            console.log(document.getElementById(key).getAttribute("name"));
                            if (document.getElementById(key).tagName.toLocaleLowerCase() == "section"){
                                document.getElementById(key).dataset.title = r[key];
                                return;
                            }
        
                            if (Array.isArray(r[key])) {
                                let children = document.getElementById(key).children;
                                for (var i = 0; i < children.length; i++) {
                                    children[i].innerText = r[key][i];
                                }
                                return;
                            }

                            document.getElementById(key).innerText = r[key];
                        });
                    });
                        fetch("assets/svg/wave.svg")
                            .then(response => response.text())
                            .then(svg => {
                                document.getElementById("hello").insertAdjacentHTML("afterbegin", `<span><span id=\"wavesvg\">${svg}</span></span>`);

                            });
                return true;
            }

        }
        return false;

    }
    
    setTimeout(() => {
        const change = promptChangeLang();
        if (change) {
            if (window.scrollY == 0){
                indicator.innerText = `01 - Introduction`;
            } 
        }
    }, 100);

    
});

