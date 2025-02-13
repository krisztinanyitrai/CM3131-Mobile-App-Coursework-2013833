// Tabs navigation

    const homeNav = document.querySelector('#home-nav');
    const homePage = document.querySelector('#home-page');
    homeNav.root = homePage;

    const newsNav = document.querySelector('#news-nav');
    const newsPage = document.querySelector('#news-page');
    newsNav.root = newsPage;

    const ideasNav = document.querySelector('#ideas-nav');
    const ideasPage = document.querySelector('#ideas-page');
    ideasNav.root = ideasPage;

// Day display

    const day = new Date();
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const dayOfWeek = daysOfWeek[day.getDay()];
    document.getElementById("day").innerHTML = dayOfWeek + ",";

// Date display

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth();
    let dd = today.getDate();

    var monthNames = [        
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var month = monthNames[mm];

    const formattedToday = dd + ' ' + month + ' ' + yyyy;

    document.getElementById('date').innerHTML = formattedToday;



// Points counter

  addPoints();

  function addPoints() {
      const items = document.querySelectorAll('#good-deed-card ion-item');

      items.forEach((item) => {
        item.addEventListener('click', () => {
          const icon = item.querySelector('ion-icon');
          const label = item.querySelector('ion-label');
          
          // change checkmark icon on click
          if (icon.getAttribute('name') === 'checkmark-circle') {
            icon.setAttribute('name', 'checkmark-circle-outline');
            // remove the additional label if it exists
            const pointsLabel = item.querySelector('.points-label');
            if (pointsLabel) {
              pointsLabel.remove();
            }
          } else {
            icon.setAttribute('name', 'checkmark-circle');
            // add the additional label
            label.insertAdjacentHTML('afterend', '<ion-label class="points-label">+1</ion-label>');
          }
        });
      });
    }

    // Add points to total
      const addPointsBtn = document.getElementById('add-points-btn');
      const pointsTotal = document.getElementById('points-total');

      addPointsBtn.addEventListener('click', AddPointsToTotal);
      
      function AddPointsToTotal() {

          const pointsCount = document.querySelectorAll('.points-label');
          const currentPoints = parseInt(pointsTotal.textContent);
          const newPoints = currentPoints + pointsCount.length;

          pointsTotal.textContent = newPoints;

          // set labels to original state
          const items = document.querySelectorAll('#good-deed-card ion-item');
      
          items.forEach((item) => {
              const icon = item.querySelector('ion-icon[name="checkmark-circle"]');

              // restore original checkmark circle icon
              if (icon) {
              icon.setAttribute('name', 'checkmark-circle-outline');}
              // remove the additional label
              const pointsLabel = item.querySelector('.points-label');
              if (pointsLabel) {
                  pointsLabel.remove();
              }
              
          });
          };


// Local storage of points

    const PointsTotal = document.getElementById("points-total");
    const SaveBtn = document.getElementById("add-points-btn");

    const saveToLocalStorage = () => {
        localStorage.setItem('textinput', PointsTotal.textContent);
        //console.log("Saved to Local Storage");
    }

    const getLocalStorage = () => {
        const pointsNumber = localStorage.getItem('textinput');
        console.log("Total points in local storage: ", pointsNumber);

    }

    SaveBtn.addEventListener('click', saveToLocalStorage);
    SaveBtn.addEventListener('click', getLocalStorage);

    const pointsNumber = localStorage.getItem('textinput');
      if (pointsNumber > 0) {
        PointsTotal.textContent = pointsNumber;
      };
    


// News API

    const newsImage = document.getElementById("news-image");
    const newsTitle = document.getElementById("news-title");
    const newsSourceDate = document.getElementById("source-and-date");
    
    // Get articles from API
    const url = 'https://newsapi.org/v2/everything?' +
          'q=(uplifting AND (charity OR inspirational OR sustainability OR ethical OR "positive news" OR uplifting OR nonprofit OR volunteerring OR fundraising OR "humanitarian aid" OR "community development"))&' +
          'sortBy=publishedAt&' +
          'apiKey=6400460033fb46179b5edf2c0cbaecad';

    const req = new Request(url);

    fetch(req)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        UpdateDisplay(data);
        })
    .catch(error => console.log(error));

    const newsContainer = document.getElementById("news-container");
    
    // Add data to News tab using cards
    function UpdateDisplay(data) {
        let ArticlesArray = data.articles;

        let cardsHtml = "";

        for (let i = 0; i < 10; i++) {
            let article = ArticlesArray[i];
            
            let cardHtml = `
            
            <ion-card>
                <ion-item lines="none">
                <ion-thumbnail slot="start">
                    <img id="news-image" alt="News Article Image" src="${article.urlToImage || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'}" />
                </ion-thumbnail>
                <ion-label onclick="window.open('${article.url}', '_blank')">
                    <h2 id="news-title" class="ion-text-wrap">${article.title}</h2>
                    <p id="source-and-date">${article.source.Name} | ${new Date(article.publishedAt).toLocaleDateString()}</p>
                </ion-label>
                <ion-icon name="heart-outline" onclick="ToggleHeart(this)"></ion-icon>
                </ion-item>
            </ion-card>
            
            `;
            
            cardsHtml += cardHtml;
        }
        
        newsContainer.innerHTML = cardsHtml;
    }


// Make hearts clickable
        
    function ToggleHeart(icon) {
        if (icon.name === 'heart-outline') {
          icon.name = 'heart';
        } else {
          icon.name = 'heart-outline';
        }
      };


// Blogs displayed on new pages

  //Get blog data from cards
  document.querySelectorAll('ion-card ion-label').forEach(label => {
    label.addEventListener('click', () => {
        const card = label.closest('ion-card');
        const blogTitle = card.dataset.title;
        const blogImg = card.dataset.img;
        const blogImgSrc = card.dataset.src;
        const unformattedText = card.dataset.txt;
        const blogTxt = unformattedText.replace(/\#/g, "<br>");
        openBlog(blogTitle, blogImg, blogImgSrc, blogTxt);
    });
  });

  //Store original Ideas page in a constant
  const originalHTML = document.getElementById("ideas-page").innerHTML;

  //Change innerHTML of Ideas page
  function openBlog(blogTitle, blogImg, blogImgSrc, blogTxt) {
    const ideasPage = document.getElementById("ideas-page");
    ideasPage.innerHTML = `
    <ion-content>
        <ion-button class="ion-padding" color="none" style="--color:black" onclick='restoreOriginal()'><ion-icon slot="icon-only" name="arrow-back"></ion-icon></ion-button>
        <ion-card>
            <img style="object-fit:cover;width:100%;height:200px;" alt="Inspiring image" src="${blogImg}" />
            <p style="padding-left:15px">${blogImgSrc}</p>
            <h2 class="ion-padding" style="margin:0;">${blogTitle}</h2>
            <p class="ion-padding" style="margin:0;">${blogTxt}</p>
        </ion-card>
    </ion-content>
    `;
  };

  //Restore original Ideas page
  function restoreOriginal() {
    document.getElementById("ideas-page").innerHTML = originalHTML;
  };
