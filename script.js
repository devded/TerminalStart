// TerminalStart Simple Logic File

document.addEventListener("DOMContentLoaded", () => {
  // Clock Logic
  function updateClock() {
    const now = new Date();
    const clockTime = document.getElementById("clock-time");
    const clockAmPm = document.getElementById("clock-ampm");
    const clockDate = document.getElementById("clock-date");

    if (clockTime && clockAmPm && clockDate) {
      const timeStringFull = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const parts = timeStringFull.split(" ");

      clockTime.textContent = parts[0];
      clockAmPm.textContent = parts[1];

      const dateOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      };
      clockDate.textContent = now
        .toLocaleDateString("en-US", dateOptions)
        .toLowerCase();
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  // Setup properly sized glowing borders for widgets
  function updateGlowBorders() {
    const widgets = document.querySelectorAll(".widget-glow");
    widgets.forEach((widget) => {
      const path = widget.querySelector(".widget-glow-border");
      if (path) {
        const w = widget.offsetWidth;
        const h = widget.offsetHeight;

        // Create SVG path around the widget
        // To simulate the title gap, we start the path slightly to the right of the top-left
        const titleBar = widget.querySelector(".widget-title");
        const titleWidth = titleBar ? titleBar.offsetWidth + 24 : 100;

        const sx = Math.max(titleWidth, 10);

        // Construct a simple rectangular path that starts after the title
        const d = `M${sx},0.5 L${w - 0.5},0.5 L${w - 0.5},${h - 0.5} L0.5,${h - 0.5} L0.5,0.5 L${sx},0.5`;
        path.setAttribute("d", d);

        // SVG Path Perimeter
        const perimeter = 2 * w + 2 * h;
        path.setAttribute("stroke-dasharray", perimeter);
        path.style.setProperty("--perimeter", perimeter);

        // Update svg parent
        const svg = widget.querySelector("svg");
        if (svg) {
          svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        }
      }
    });
  }

  window.addEventListener("resize", updateGlowBorders);

  // Call once to initialize and wait a bit for initial layout
  setTimeout(updateGlowBorders, 100);

  // --- Search input handler (Engine Cycler) ---
  const ENGINES = [
    { id: 'google', label: 'google', url: 'https://www.google.com/search?q=' },
    { id: 'chatgpt', label: 'chatgpt', url: 'https://chatgpt.com/?q=' },
    { id: 'gemini', label: 'gemini', url: 'https://gemini.google.com/app?q=' },
    { id: 'perplexity', label: 'perplexity', url: 'https://www.perplexity.ai/search?q=' },
    { id: 'claude', label: 'claude', url: 'https://claude.ai/new?q=' },
    { id: 'youtube', label: 'youtube', url: 'https://www.youtube.com/results?search_query=' },
    { id: 'reddit', label: 'reddit', url: 'https://www.reddit.com/search/?q=' },
    { id: 'github', label: 'github', url: 'https://github.com/search?q=' },
  ];

  let currentEngineIndex = 0;

  const searchForm = document.getElementById("search-form");
  const searchEngineBtn = document.getElementById("search-engine-btn");
  const searchInput = document.getElementById("search-input");

  if (searchForm && searchEngineBtn && searchInput) {
    // 1. Restore saved engine
    const savedEngine = localStorage.getItem('tui-search-engine');
    if (savedEngine) {
      const index = ENGINES.findIndex(e => e.id === savedEngine);
      if (index !== -1) {
        currentEngineIndex = index;
        searchEngineBtn.textContent = `[${ENGINES[currentEngineIndex].label}]`;
      }
    }

    // 2. Cycle engine on click
    searchEngineBtn.addEventListener("click", () => {
      currentEngineIndex = (currentEngineIndex + 1) % ENGINES.length;
      const currentEngine = ENGINES[currentEngineIndex];
      searchEngineBtn.textContent = `[${currentEngine.label}]`;
      localStorage.setItem('tui-search-engine', currentEngine.id);
      searchInput.focus();
    });

    // 3. Handle submit
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query !== "") {
        const currentEngine = ENGINES[currentEngineIndex];
        window.open(currentEngine.url + encodeURIComponent(query), "_blank", "noopener,noreferrer");
        searchInput.value = "";
        searchInput.blur();
      }
    });
  }

  // Interactive Todo (Simple mock)
  const todoForm = document.getElementById("todo-form");
  if (todoForm) {
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("todo-input");
      const list = document.getElementById("todo-list");

      if (input && input.value.trim() !== "" && list) {
        const newTask = document.createElement("div");
        newTask.className =
          "flex items-start gap-2 group p-1 hover:bg-[var(--color-border)] hover:bg-opacity-30 rounded transition-colors cursor-pointer";
        newTask.innerHTML = `
                    <div class="mt-0.5 w-3 h-3 border border-[var(--color-muted)] flex-shrink-0 cursor-pointer flex items-center justify-center widget-rounded hover:border-[var(--color-accent)] transition-colors"></div>
                    <span class="text-[var(--color-fg)] flex-1 text-sm break-words">${input.value}</span>
                `;

        // Add click to toggle
        newTask.addEventListener("click", function () {
          const isDone = this.classList.contains("opacity-50");
          if (isDone) {
            this.classList.remove("opacity-50");
            this.querySelector("div").className =
              "mt-0.5 w-3 h-3 border border-[var(--color-muted)] flex-shrink-0 cursor-pointer flex items-center justify-center widget-rounded hover:border-[var(--color-accent)] transition-colors";
            this.querySelector("div").innerHTML = "";
            this.querySelector("span").classList.remove("line-through");
          } else {
            this.classList.add("opacity-50");
            this.querySelector("div").className =
              "mt-0.5 w-3 h-3 border border-[var(--color-accent)] flex-shrink-0 cursor-pointer flex items-center justify-center widget-rounded";
            this.querySelector("div").innerHTML =
              `<span class="text-[var(--color-accent)] leading-none text-xs">x</span>`;
            this.querySelector("span").classList.add("line-through");
          }
        });

        list.insertBefore(newTask, list.firstChild);
        input.value = "";
      }
    });

    // Add listeners to existing tasks
    const existingTasks = document.querySelectorAll("#todo-list > div");
    existingTasks.forEach((task) => {
      task.addEventListener("click", function () {
        const isDone = this.classList.contains("opacity-50");
        if (isDone) {
          this.classList.remove("opacity-50");
          this.querySelector("div").className =
            "mt-0.5 w-3 h-3 border border-[var(--color-muted)] flex-shrink-0 cursor-pointer flex items-center justify-center widget-rounded hover:border-[var(--color-accent)] transition-colors";
          this.querySelector("div").innerHTML = "";
          this.querySelector("span").classList.remove("line-through");
        } else {
          this.classList.add("opacity-50");
          this.querySelector("div").className =
            "mt-0.5 w-3 h-3 border border-[var(--color-accent)] flex-shrink-0 cursor-pointer flex items-center justify-center widget-rounded";
          this.querySelector("div").innerHTML =
            `<span class="text-[var(--color-accent)] leading-none text-xs">x</span>`;
          this.querySelector("span").classList.add("line-through");
        }
      });
    });
  }

  // Attribution Glitch Effect
  const attribution = document.getElementById("attribution");
  const attrText = document.getElementById("attribution-text");
  if (attribution && attrText) {
    const LABEL = "~/CSir.info";
    const GLITCH_CHARS = "!@#$%^&*_+-=[]{}|;:<>?/~";
    let glitchTimer = null;
    let isHovering = false;

    attribution.addEventListener("mouseenter", () => {
      isHovering = true;
      let tick = 0;
      const run = () => {
        if (!isHovering || tick >= 6) {
          attrText.textContent = LABEL;
          return;
        }
        tick++;
        attrText.textContent = LABEL.split("")
          .map((ch, i) =>
            i < tick
              ? ch
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
          )
          .join("");
        glitchTimer = setTimeout(run, 50);
      };
      run();
    });

    attribution.addEventListener("mouseleave", () => {
      isHovering = false;
      if (glitchTimer) clearTimeout(glitchTimer);
      attrText.textContent = LABEL;
    });
  }

  // --- Weather Fetching Logic ---
  const weatherTemp = document.getElementById("weather-temp");
  const weatherCondition = document.getElementById("weather-condition");
  const weatherHumidity = document.getElementById("weather-humidity");
  const weatherWind = document.getElementById("weather-wind");
  const weatherPrecip = document.getElementById("weather-precip");
  const weatherFeels = document.getElementById("weather-feels");
  const weatherLocation = document.getElementById("weather-location");
  const weatherUv = document.getElementById("weather-uv");
  const weatherVisibility = document.getElementById("weather-visibility");
  const weatherPressure = document.getElementById("weather-pressure");
  const dailyForecastContainer = document.getElementById("weather-daily-forecast");

  // Map WMO Weather Codes to text conditions
  function getWeatherConditionText(code, isDay = 1) {
    if (code === 0) return isDay ? "Sunny" : "Clear Sky";
    if (code === 1) return isDay ? "Mainly Sunny" : "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code === 56 || code === 57) return "Freezing Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code === 66 || code === 67) return "Freezing Rain";
    if (code >= 71 && code <= 75) return "Snow";
    if (code === 77) return "Snow Grains";
    if (code >= 80 && code <= 82) return "Showers";
    if (code === 85 || code === 86) return "Snow Showers";
    if (code === 95) return "Thunderstorm";
    if (code === 96 || code === 99) return "Thunderstorm with Hail";
    return "Unknown";
  }

  function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code === 1) return "🌤️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "🌨️";
    if (code >= 80 && code <= 86) return "🌦️";
    if (code >= 95) return "⛈️";
    return "❓";
  }

  async function fetchWeather() {
    try {
      // 1. Get approximate IP location
      const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
      const geoData = await geoRes.json();
      const lat = parseFloat(geoData.latitude);
      const lon = parseFloat(geoData.longitude);
      const city = geoData.city || "--";

      if (weatherLocation) weatherLocation.textContent = city;

      if (isNaN(lat) || isNaN(lon)) throw new Error("Location not found");

      // 2. Fetch Open-Meteo data (Celsius) - expanded to include daily forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,visibility,pressure_msl,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

      const weatherRes = await fetch(weatherUrl);
      const data = await weatherRes.json();

      // 3. Process current data
      const currentTemp = Math.round(data.current.temperature_2m);
      const conditionText = getWeatherConditionText(
        data.current.weather_code,
        data.current.is_day
      );
      const humidityText = data.current.relative_humidity_2m + "%";
      const windText = Math.round(data.current.wind_speed_10m) + " km/h";
      const feelsLike = Math.round(data.current.apparent_temperature) + "°";
      const uvIndex = Math.round(data.current.uv_index) || 0;
      const visibility = Math.round(data.current.visibility / 1000) + " km";
      const pressure = Math.round(data.current.pressure_msl) + " hPa";

      const currentHourIso = new Date().toISOString().substring(0, 13);
      let precipProb = "0%";
      if (data.hourly && data.hourly.time && data.hourly.precipitation_probability) {
        const hourIndex = data.hourly.time.findIndex(t => t.startsWith(currentHourIso));
        if (hourIndex !== -1) {
          precipProb = data.hourly.precipitation_probability[hourIndex] + "%";
        }
      }

      // Update UI
      if (weatherTemp) weatherTemp.textContent = currentTemp + "°";
      if (weatherCondition) weatherCondition.textContent = conditionText;
      if (weatherHumidity) weatherHumidity.textContent = humidityText;
      if (weatherWind) weatherWind.textContent = windText;
      if (weatherPrecip) weatherPrecip.textContent = precipProb;
      if (weatherFeels) weatherFeels.textContent = "feels " + feelsLike;
      if (weatherUv) weatherUv.textContent = uvIndex;
      if (weatherVisibility) weatherVisibility.textContent = visibility;
      if (weatherPressure) weatherPressure.textContent = pressure;

      // 4. Process daily forecast (next 7 days)
      if (data.daily && data.daily.time && dailyForecastContainer) {
        let dailyHtml = "";
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
          const dateObj = new Date(data.daily.time[i]);
          const dayName = i === 0 ? "Today" : days[dateObj.getDay()];
          const highTemp = Math.round(data.daily.temperature_2m_max[i]);
          const lowTemp = Math.round(data.daily.temperature_2m_min[i]);
          const condition = getWeatherConditionText(data.daily.weather_code[i], 1).toLowerCase();
          const icon = getWeatherIcon(data.daily.weather_code[i]);
          const maxUv = Math.round(data.daily.uv_index_max[i]) || 0;
          const maxPrecip = data.daily.precipitation_probability_max[i] || 0;

          dailyHtml += `
<div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
        <span class="text-[var(--color-fg)] w-12">${dayName}</span>
        <span class="text-base">${icon}</span>
        <span class="text-[var(--color-muted)] text-[10px] truncate max-w-[80px] lowercase">${condition}</span>
    </div>
    <div class="flex items-center gap-3">
        <span class="text-[var(--color-muted)] text-[10px]">uv ${maxUv}</span>
        <span class="text-[var(--color-muted)] text-[10px] w-8 text-right">${maxPrecip}%</span>
        <span class="text-[var(--color-fg)] font-medium">${highTemp}°</span>
        <span class="text-[var(--color-muted)] opacity-60">${lowTemp}°</span>
    </div>
</div>`;
        }

        dailyForecastContainer.innerHTML = dailyHtml;
      }
    } catch (e) {
      console.error("Error fetching weather:", e);
      if (weatherCondition) weatherCondition.textContent = "fetch error";
    }
  }

  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);

  // --- Status Widget Logic ---
  const statusIndicator = document.getElementById("status-indicator");
  const statusText = document.getElementById("status-text");
  const statusPing = document.getElementById("status-ping");
  const statusUptime = document.getElementById("status-uptime");

  let isOnline = navigator.onLine;
  const mountTime = Date.now();
  let pingHistory = [];

  function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateStatusDisplay() {
    if (!statusIndicator || !statusText) return;
    if (isOnline) {
      statusIndicator.className = "w-2 h-2 rounded-full bg-green-500";
      statusText.textContent = "Active";
    } else {
      statusIndicator.className = "w-2 h-2 rounded-full bg-red-500";
      statusText.textContent = "Offline";
      if (statusPing) {
        statusPing.textContent = "---";
      }
    }
  }

  window.addEventListener("online", () => {
    isOnline = true;
    updateStatusDisplay();
  });
  window.addEventListener("offline", () => {
    isOnline = false;
    updateStatusDisplay();
  });
  updateStatusDisplay();

  // Measure Ping using DNS-over-HTTPS endpoint (more reliable for CORS)
  async function measurePing() {
    if (!isOnline || !statusPing) return;
    
    const urls = [
      "https://dns.google.com/resolve?name=google.com",
      "https://cloudflare-dns.com/dns-query?name=google.com"
    ];
    
    const results = [];
    
    for (const url of urls) {
      try {
        const start = performance.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          signal: controller.signal,
        });
        
        clearTimeout(timeout);
        const end = performance.now();
        results.push(end - start);
      } catch {
        // Skip failed attempts
      }
    }
    
    if (results.length > 0) {
      // Calculate average and add to history
      const avgPing = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
      pingHistory.push(avgPing);
      
      // Keep last 5 measurements for smoothing
      if (pingHistory.length > 5) pingHistory.shift();
      
      // Display smoothed average
      const smoothed = Math.round(pingHistory.reduce((a, b) => a + b, 0) / pingHistory.length);
      statusPing.textContent = smoothed;
    } else {
      statusPing.textContent = "---";
    }
  }

  measurePing();
  setInterval(measurePing, 3000); // Ping every 3 seconds

  // Update Uptime
  setInterval(() => {
    if (statusUptime) {
      statusUptime.textContent = formatUptime(Date.now() - mountTime);
    }
  }, 1000);

  // --- Links Fetching Logic ---
  async function loadLinks() {
    const container = document.getElementById("links-container");
    if (!container) return;

    try {
      // If viewing as a local file without a server, this fetch will throw CORS errors.
      const res = await fetch("links.json");
      if (!res.ok) throw new Error("Failed to load links");
      const data = await res.json();

      let html = "";
      data.forEach(group => {
        // Create the Category text with --char-index for the typing animation
        let catHTML = group.category.toUpperCase().split("").map((c, i) =>
          `<span class="category-char" style="--char-index: ${i}">${c}</span>`
        ).join("");

        html += `
        <div class="link-group flex flex-col gap-2 min-w-0">
          <h4 class="text-xs font-bold uppercase mb-2 flex items-center gap-1.5">
            <span class="category-prefix text-[var(--color-accent)] opacity-60">//</span>
            <span class="category-text text-[var(--color-muted)]">${catHTML}</span>
          </h4>
        `;

        // Append each link inside the group
        group.links.forEach(link => {
          let domain = "";
          try {
            domain = new URL(link.url).hostname;
          } catch (e) { }

          html += `
          <a href="${link.url}" class="group text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-all duration-200 flex items-center gap-2">
            <span class="link-arrow text-[var(--color-border)] group-hover:text-[var(--color-accent)] leading-none">&#x203a;</span>
            <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" alt="" class="w-4 h-4 shrink-0 object-contain" loading="lazy">
            <span class="truncate">${link.label}</span>
          </a>`;
        });

        html += `</div>`;
      });

      container.innerHTML = html;

    } catch (e) {
      console.error("Error loading links:", e);
      container.innerHTML = `
        <div class="col-span-4 text-[var(--color-muted)] opacity-50 text-xs text-center border border-[var(--color-border)] border-dashed p-4">
          Could not load links.json.<br/>
          (Ensure you are running a local web server to avoid CORS block on file://)
        </div>`;
    }
  }

  loadLinks();

  // --- The Hacker News Feed (thehackernews.com) ---
  const THN_RSS = 'https://feeds.feedburner.com/TheHackersNews';
  const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

  function thnTimeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  async function fetchHNStories() {
    const feed = document.getElementById('hn-feed');
    if (!feed) return;

    feed.innerHTML = `<div class="hn-loading"><span class="hn-loading-text">fetching stories...</span></div>`;

    try {
      const res = await fetch(CORS_PROXY + encodeURIComponent(THN_RSS));
      if (!res.ok) throw new Error('Feed fetch failed');
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'text/xml');

      // Check for parser errors
      const parseError = xml.querySelector('parsererror');
      if (parseError) throw new Error('XML parse error');

      const items = xml.querySelectorAll('item');
      if (!items || items.length === 0) throw new Error('No items in feed');

      const stories = [];
      items.forEach((item, idx) => {
        if (idx >= 15) return; // limit to 15 stories
        const title = item.querySelector('title')?.textContent ?? 'untitled';
        const link = item.querySelector('link')?.textContent ?? 'https://thehackernews.com';
        const pubDate = item.querySelector('pubDate')?.textContent ?? new Date().toISOString();
        const categories = Array.from(item.querySelectorAll('category')).map(c => c.textContent).filter(Boolean).slice(0, 2);

        stories.push({ title, link, pubDate, categories, idx });
      });

      const html = stories.map(({ idx, title, link, pubDate, categories }) => {
        const num = String(idx + 1).padStart(2, '0');
        const ago = thnTimeAgo(pubDate);
        const catHtml = categories.map(c =>
          `<span class="hn-tag">${c.toLowerCase()}</span>`
        ).join('');

        return `
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="hn-story">
          <div class="hn-score">
            <span class="hn-score-num">${num}</span>
            <div class="hn-score-dot"></div>
          </div>
          <div>
            <div class="hn-title">${title}</div>
            <div class="hn-meta">
              ${catHtml}
            </div>
          </div>
          <div class="hn-meta" style="white-space: nowrap;">${ago}</div>
        </a>`;
      }).join('');

      feed.innerHTML = html;

    } catch (err) {
      console.error('THN feed error:', err);
      feed.innerHTML = `<div class="hn-error">// could not fetch feed.<br/>check console for details.</div>`;
    }
  }

  // Initial fetch + auto-refresh every 15 minutes
  fetchHNStories();
  setInterval(fetchHNStories, 15 * 60 * 1000);

});
