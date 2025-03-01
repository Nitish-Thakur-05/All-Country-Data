// getting data from url
const queryData = new URLSearchParams(window.location.search).get('name')

const countryName = document.querySelector('.country-name')
const flag = document.querySelector('.flag-img')
const nativeName = document.querySelector('.native-name')
const population = document.querySelector('.population')
const region = document.querySelector('.region')
const subRegion = document.querySelector('.sub-region')
const capital = document.querySelector('.capital')
const domain = document.querySelector('.domain')
const currency = document.querySelector('.currency')
const languages = document.querySelector('.languages')
const border = document.querySelector('.border')
const backButton = document.querySelector('.back-btn')
const spinnerContainer = document.querySelector('.spinner-container')
const spinnerText = document.querySelector('.spinner-container h2')
const spinner = document.querySelector('.spinner')
const dataContainer = document.querySelector('.container')

setTimeout(() => {
    fetch(`https://restcountries.com/v3.1/name/${queryData}`).then((countryData)=> {
        if(countryData.status != 200) {
            throw new Error(`ERROR CODE ${countryData.status}`)
        }
        return countryData.json()
    }).then(([fetchedData])=> {
        spinnerContainer.style.display = 'none'
        spinner.remove()
        dataContainer.style.display = 'flex'
    
        flag.src = fetchedData.flags.svg || fetchedData.flags.png
        countryName.textContent = fetchedData.name.common
        nativeName.innerHTML = `
                                    <b>Native Name: </b> ${fetchedData.name.nativeName ? Object.values(fetchedData.name.nativeName)[0]?.common : 'N/A'}
        `
        population.innerHTML = `
                                <b>Population: </b> ${fetchedData.population.toLocaleString('en-IN')}
        `
        region.innerHTML = `
                                <b>Region: </b> ${fetchedData.region}
        `
        subRegion.innerHTML = `
                                <b>Sub Region: </b> ${fetchedData.subregion || "N/A"}  
        `
        capital.innerHTML = `
                                <b>capital: </b> ${fetchedData.capital || "N/A"}
        `
        domain.innerHTML = `
                                <b>Top Level Domain: </b> ${fetchedData.tld}
        `
        currency.innerHTML = `
                                <b>currencies: </b> ${Object.values(fetchedData.currencies)[0].name}
        `
        languages.innerHTML = `
                                <b>languages: </b> ${Object.values(fetchedData.languages)}
    
        `
      // for border countries 
      if(fetchedData.borders) {
        const countryByCode = fetchedData.borders.map((curr) => {
            return fetch(`https://restcountries.com/v3.1/alpha/${curr}`).then((data) => {
                if (!data.ok) {
                    throw new Error(`Failed to fetch country: ${curr}`);
                }
                 return data.json()
             }).catch((err) => {
                console.error(`Error fetching ${curr}:`, err);
                return null; 
            });
         })
         
         Promise.all(countryByCode).then((data) => {
             const fregment = document.createDocumentFragment()   
             data.forEach(([curr]) => {
                 if(curr) {
                    const linkTag = document.createElement('a')
                    linkTag.href = `country.html?name=${curr.name.common}`
                    linkTag.innerHTML = `${curr.name.common}`
                    fregment.appendChild(linkTag)
                 }
             });
             border.appendChild(fregment)
         }).catch((err) => {
             spinner.remove()
             spinnerText.textContent = 'An Error Occured Unable to Fetch Data.....'
         })
    } else {
        let borderHTML = `<b>Border Countries: &nbsp;</b><span>N/A</span>`
        border.innerHTML = borderHTML
    }

    }).catch((err)=> {
        spinner.remove()
        spinnerText.textContent = 'An Error Occured Unable to Fetch Data.....'
    })
}, 2000);

backButton.addEventListener('click', () => {
    history.back()
})

// night mode
const nightBtn = document.querySelector('.night-btn')
const dayBtn = document.querySelector('.day-btn')
const themeBtn = document.querySelector('.theme-btn')

themeBtn.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn')) {
        toggleTheme()
    }
})

function toggleTheme() {
    document.querySelector('body').classList.toggle('dark')
    nightBtn.classList.toggle('hide')
    dayBtn.classList.toggle('hide')

    if(dayBtn.classList.contains('hide')) {
        localStorage.setItem('theme', 'light')
    } else {
        localStorage.setItem('theme', 'dark')
    }
}

function collectingTheme() {
    if(localStorage.theme === 'dark') {
        document.querySelector('body').classList.add('dark')
        nightBtn.classList.add('hide')
        dayBtn.classList.remove('hide')
    } else {
        document.querySelector('body').classList.remove('dark')
        nightBtn.classList.remove('hide')
        dayBtn.classList.add('hide')
    }
}
collectingTheme()


