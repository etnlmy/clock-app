function renderClock ({ clockContainer, data, error }) {
  if (error) {
    clockContainer.innerHTML = `<p class="error">${error}</p>`;
    return;
  }
  const icon = data.isDayTime ? 'sun' : 'moon';
  clockContainer.innerHTML = `
    <div class="greeting">
      <img src="assets/desktop/icon-${icon}.svg" 
        width="24" 
        height="24" 
        alt="icon ${icon}" 
        id="day-night-icon">
      <span class="less-big">${data.greeting}</span>
      <span class="less-big currently">, it's currently</span>
    </div>
    <div class="time">
      <h1 id="time" class="huge">${data.time}</h1>
      <span class="timezone">${data.tzOffset}</span>
    </div>
    <div class="location"> 
      <span class="big">in ${data.location}</span>
    </div>
  `;
}

function clock({
  timeZoneElement,
  dayOfTheYearElement,
  dayOfTheWeekElement,
  weekNumberElement,
  clockContainer
}) {

  const TIME_API_URL = "https://timezoneapi.io/api/ip/?token=aGBpamkOwzjCMkOpRmzb";

  function getGreeting(hours) {
    if (hours >= 5 && hours <= 11) return "Good morning";
    else if (hours >= 12 && hours <= 17) return "Good afternoon";
    else return "Good evening";
  }

  function getDayOfTheYear(now) {
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function setTheme(isDayTime) {
    const image = isDayTime ? "daytime" : "nighttime";
    const version = window.matchMedia('(max-width: 600px)').matches ? "mobile" : "desktop";
    const body = document.getElementsByTagName("body")[0];
    body.style.backgroundImage = `url(./assets/${version}/bg-image-${image}.jpg)`;
    if (!isDayTime) document.getElementsByTagName("aside")[0].classList.add("dark");
  }

  const formatHoursAndMinutes = (hours, minutes) => 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  async function fetchTimeAndLocation() {
    const response = await fetch(TIME_API_URL);
    if (!response.ok) throw new Error('Could not fetch the time');
    const { data } = await response.json();
    console.log(data)
    const date = new Date(data.datetime.date_time);
    const hours = date.getHours();
    return {
      timeZone: data.timezone.id,
      dayOfTheYear: getDayOfTheYear(date),
      dayOfTheWeek: date.getDay() + 1,
      weekNumber: data.datetime.week,
      time: formatHoursAndMinutes(hours, date.getMinutes()),
      tzOffset: data.datetime.offset_tzab,
      greeting: getGreeting(hours),
      isDayTime: hours >= 5 && hours <= 17,
      location: `${data.city}, ${data.country}`
    };
  }

  fetchTimeAndLocation()
    .then((data) => {
      setTheme(data.isDayTime);
      renderClock({ clockContainer, data });
      timeZoneElement.textContent = data.timeZone;
      dayOfTheYearElement.textContent = data.dayOfTheYear;
      dayOfTheWeekElement.textContent = data.dayOfTheWeek;
      weekNumberElement.textContent = data.weekNumber;
    })
    .catch(error => renderClock({ clockContainer, error }));

  window.setInterval(() => {
    const now = new Date();
    const timeElt = document.getElementById("time");
    if (timeElt) 
      timeElt.innerText = formatHoursAndMinutes(now.getHours(), now.getMinutes());
  }, 1000);

}

clock({
  clockContainer: document.querySelector("div.clock"),
  timeZoneElement: document.getElementById("time-zone"),
  dayOfTheYearElement: document.getElementById("day-of-year"),
  dayOfTheWeekElement: document.getElementById("day-of-week"),
  weekNumberElement: document.getElementById("week-number")
});
