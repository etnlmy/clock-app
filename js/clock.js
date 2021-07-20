function renderClock ({ clockContainer, timeData, location, error }) {
  if (error) {
    clockContainer.innerHTML = `<p class="error">${error}</p>`;
    return;
  }
  const icon = timeData.isDayTime ? 'sun' : 'moon';
  clockContainer.innerHTML = `
    <div class="greeting">
      <img src="assets/desktop/icon-${icon}.svg" 
        width="24px" 
        height="24px" 
        alt="icon ${icon}" 
        id="day-night-icon">
      <span class="less-big">${timeData.greeting}, it's currently</span>
      <span class="less-big currently">, it's currently</span>
    </div>
    <div class="time">
      <span id="time" class="huge">${timeData.time}</span>
      <span class="timezone">${timeData.bst ? 'BST' : ''}</span>
    </div>
    <div class="location"> 
      <span class="big">in ${location}</span>
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

  const TIME_API_URL = "http://worldtimeapi.org/api/ip";
  const LOCATION_API_URL = "https://freegeoip.app/json/";

  function getGreeting(hours) {
    if (hours >= 5 && hours <= 11) return "Good morning";
    else if (hours >= 12 && hours <= 17) return "Good afternoon";
    else return "Good evening";
  }

  function setTheme(isDayTime) {
    const image = isDayTime ? "daytime" : "nighttime";
    const version = window.matchMedia('(max-width: 500px)').matches ? "mobile" : "desktop";
    const body = document.getElementsByTagName("body")[0];
    body.style.backgroundImage = `url(./assets/${version}/bg-image-${image}.jpg)`;
    if (!isDayTime) document.getElementsByTagName("aside")[0].classList.add("dark");
  }

  const formatHoursAndMinutes = (hours, minutes) => 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  async function fetchTimeData() {
    const response = await fetch(TIME_API_URL);
    if (!response.ok) throw new Error('Could not fetch the time');
    const data = await response.json();
    const date = new Date(data.datetime);
    const hours = date.getHours();
    return {
      timeZone: data.timezone,
      dayOfTheYear: data.day_of_year,
      dayOfTheWeek: data.day_of_week,
      weekNumber: data.week_number,
      time: formatHoursAndMinutes(hours, date.getMinutes()),
      bst: data.dst,
      greeting: getGreeting(hours),
      isDayTime: hours >= 5 && hours <= 17
    };
  }

  async function fetchLocation() {
    const response = await fetch(LOCATION_API_URL);
    if (!response.ok) throw new Error('Could not get your location');
    const data = await response.json();
    return `${data.city}, ${data.country_name}`;
  }

  Promise
    .all([fetchTimeData(), fetchLocation()])
    .then(([timeData, location]) => {
      setTheme(timeData.isDayTime);
      renderClock({ clockContainer, timeData, location });
      timeZoneElement.textContent = timeData.timeZone;
      dayOfTheYearElement.textContent = timeData.dayOfTheYear;
      dayOfTheWeekElement.textContent = timeData.dayOfTheWeek;
      weekNumberElement.textContent = timeData.weekNumber;
    })
    .catch(error => renderClock({ clockContainer, error }));

  window.setInterval(() => {
    const now = new Date();
    document.getElementById("time").innerText = formatHoursAndMinutes(now.getHours(), now.getMinutes());
  }, 1000);

}

clock({
  clockContainer: document.querySelector("div.clock"),
  timeZoneElement: document.getElementById("time-zone"),
  dayOfTheYearElement: document.getElementById("day-of-year"),
  dayOfTheWeekElement: document.getElementById("day-of-week"),
  weekNumberElement: document.getElementById("week-number")
});
