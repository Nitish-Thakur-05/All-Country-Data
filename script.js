const cardContainer = document.querySelector('.card-container')
const hideSkeleton = () => {
    document.querySelectorAll('.skeleton-card').forEach((curr) => {
        curr.remove()
    })
}

const showErrorMsg = () => {
    const errmsg = document.createElement('h2')
    errmsg.classList.add('errmsg')
    errmsg.textContent = 'Unable To Fetch Data.....'

    cardContainer.appendChild(errmsg)
}

function addingskeleton() {
    const fragment = document.createDocumentFragment()
    for(let i=0; i<=9; i++)  {
        const skeletonCard = document.createElement('div')
        skeletonCard.classList.add('skeleton-card')
        skeletonCard.innerHTML = `
            <div class="skeleton flag"></div>
            <div class="skeleton text title"></div>
            <div class="skeleton text"></div>
            <div class="skeleton text"></div>
            <div class="skeleton text"></div>
        `;
        fragment.appendChild(skeletonCard)
    }
    cardContainer.innerHTML = ''
    cardContainer.appendChild(fragment)
}

const renderdata = (mydata) => {
    hideSkeleton()
    const fragment = document.createDocumentFragment()
    mydata.forEach((country) => {
        // console.log(country.continents);
        const card = document.createElement('a')
        card.classList.add('card')
        card.href = `./country.html?name=${country.name.common}`
        // card.target = `_blank`
        card.dataset.continent = country.continents;
    
    
        const cardDataHtml = `
            <img src="${country.flags?.svg}" alt="flag-img">
            <div class="card-text">
                <h3>${country.name.common}</h3>
                <p><b>Population:</b> ${country.population.toLocaleString('en-IN')}</p>
                <p><b>Region:</b> ${country.region}</p>
                <p><b>Capital:</b> ${(country.capital) ? country.capital : 'N/A'}</p>
            </div>
            `
            card.innerHTML = cardDataHtml
            fragment.appendChild(card)
        })
        cardContainer.appendChild(fragment)
}

let allCountriesData
document.querySelector('body').style.overflow = 'hidden'
function showingData() {
    setTimeout(() => {
        fetch('https://restcountries.com/v3.1/all').then((data) => {
            if(data.status != 200) {
                hideSkeleton()
                throw new Error (`ERROR CODE: ${data.status}`)
            }
            return data.json()
        }).then((mydata) => {
            document.querySelector('body').style.overflow = 'auto'
            renderdata(mydata)
            allCountriesData = mydata
    
        }). catch((err)=> {
            hideSkeleton()
            showErrorMsg()
        })
    }, 1000);
}
showingData()

// search
const searchbar = document.querySelector('.search-bar')
searchbar.addEventListener('input', (e) => {
    const filteredCountry = allCountriesData.filter((country) => {
       return country.name.common.toLowerCase().includes(e.target.value.trim().toLowerCase())
    })
    cardContainer.innerHTML = ''
    renderdata(filteredCountry)
    
    if(filteredCountry.length === 0) {
        cardContainer.innerHTML = 'No Country Found'

    }
})

// filtering by region
document.querySelector('select').addEventListener('change', (e) => {
    addingskeleton()
    setTimeout(() => {
        fetch(`https://restcountries.com/v3.1/region/${e.target.value}`).then((data) => {
            if(data.status != 200) {
                hideSkeleton()
                throw new Error (`ERROR CODE: ${data.status}`)
            }
            return data.json()
        }).then((mydata) => {
            // console.log(mydata);
            renderdata(mydata)
            
        }). catch((err)=> {
            cardContainer.innerHTML = ''
            hideSkeleton()
            showErrorMsg()
        })
    }, 1000)
})



//night mode
const nightBtn = document.querySelector('.night-btn')
const dayBtn = document.querySelector('.day-btn')
const theme = document.querySelector('.theme-btn')
const body = document.querySelector('body')
theme.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn')) {
        toogleTheme()
    }

})

function toogleTheme() {
    body.classList.toggle('dark')
    dayBtn.classList.toggle('hide')
    nightBtn.classList.toggle('hide')
    
    if(body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark')
    } else {
        localStorage.setItem('theme', 'light')
    }
}

function collectingTheme() {
    if(!localStorage.theme) {
        localStorage.setItem('theme', 'light')
    }

    if(localStorage.theme === 'dark') {
        body.classList.add('dark')
        nightBtn.classList.add('hide')
        dayBtn.classList.remove('hide')
        // localStorage.setItem('theme', 'dark')
    } else {
        body.classList.remove('dark')
        dayBtn.classList.add('hide')
        nightBtn.classList.remove('hide')
        // localStorage.setItem('theme', 'light')
    }
}
collectingTheme()
