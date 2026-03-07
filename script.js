// TerminalStart Simple Logic File

const PROXY = "https://cors-proxy-server-zeta.vercel.app";

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

      // 2. Fetch Open-Meteo data (Celsius)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,visibility,pressure_msl,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

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

    } catch (e) {
      console.error("Error fetching weather:", e);
      if (weatherCondition) weatherCondition.textContent = "fetch error";
    }
  }

  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);

  // --- Status Widget Logic (World Clock) ---
  const timeBd = document.getElementById("time-bd");
  const timeDe = document.getElementById("time-de");
  const timeCa = document.getElementById("time-ca");

  function updateWorldClocks() {
    const now = new Date();

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    if (timeBd) {
      timeBd.textContent = new Intl.DateTimeFormat('en-GB', {
        ...options,
        timeZone: 'Asia/Dhaka'
      }).format(now);
    }

    if (timeDe) {
      timeDe.textContent = new Intl.DateTimeFormat('en-GB', {
        ...options,
        timeZone: 'Europe/Berlin'
      }).format(now);
    }

    if (timeCa) {
      timeCa.textContent = new Intl.DateTimeFormat('en-GB', {
        ...options,
        timeZone: 'America/Toronto'
      }).format(now);
    }
  }

  setInterval(updateWorldClocks, 1000);
  updateWorldClocks();

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

  // --- News Feed ---
  const FEED_SOURCES = {
    hn: { type: 'json', url: 'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15' },
    security: { type: 'rss', url: 'https://www.bleepingcomputer.com/feed/', label: 'bleepingcomputer' },
    tech: { type: 'rss', url: 'https://feeds.arstechnica.com/arstechnica/index', label: 'arstechnica' },
  };

  let currentFeedTab = 'hn';
  const feedCache = {};

  function feedTimeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function renderFeedStory(idx, title, link, meta, ago) {
    const num = String(idx + 1).padStart(2, '0');
    return `
      <a href="${link}" target="_blank" rel="noopener noreferrer" class="hn-story">
        <div class="hn-score">
          <span class="hn-score-num">${num}</span>
          <div class="hn-score-dot"></div>
        </div>
        <div style="flex:1;min-width:0">
          <div class="hn-title">${title}</div>
          <div class="hn-meta">${meta}</div>
        </div>
        <div class="hn-meta" style="white-space:nowrap">${ago}</div>
      </a>`;
  }

  async function loadFeedTab(tab) {
    const feed = document.getElementById('hn-feed');
    if (!feed) return;
    feed.innerHTML = `<div class="hn-loading"><span class="hn-loading-text">fetching ${tab}...</span></div>`;

    if (feedCache[tab]) { feed.innerHTML = feedCache[tab]; return; }

    const src = FEED_SOURCES[tab];
    try {
      if (src.type === 'json') {
        const res = await fetch(src.url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        feedCache[tab] = (data.hits ?? []).map((hit, idx) => renderFeedStory(
          idx,
          hit.title ?? 'untitled',
          hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
          `<span class="hn-tag">${hit.points ?? 0}pts</span><span class="hn-tag">${hit.num_comments ?? 0} comments</span>`,
          feedTimeAgo(hit.created_at)
        )).join('');

      } else {
        const res = await fetch(`${PROXY}/?url=${encodeURIComponent(src.url)}`);
        if (!res.ok) throw new Error();
        const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
        if (xml.querySelector('parsererror')) throw new Error('parse error');
        const items = Array.from(xml.querySelectorAll('item')).slice(0, 15);
        feedCache[tab] = items.map((item, idx) => {
          const title = item.querySelector('title')?.textContent ?? 'untitled';
          const linkEl = item.querySelector('link');
          const link = linkEl?.getAttribute('href') || linkEl?.nextSibling?.textContent?.trim() || linkEl?.textContent?.trim() || '#';
          const pubDate = item.querySelector('pubDate')?.textContent ?? '';
          return renderFeedStory(idx, title, link, `<span class="hn-tag">${src.label}</span>`, pubDate ? feedTimeAgo(pubDate) : '');
        }).join('');
      }

      feed.innerHTML = feedCache[tab];
    } catch (err) {
      feed.innerHTML = `<div class="hn-error">// could not fetch ${tab} feed.</div>`;
    }
  }

  window.switchFeedTab = function(tab) {
    currentFeedTab = tab;
    document.querySelectorAll('.feed-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`feed-tab-${tab}`)?.classList.add('active');
    loadFeedTab(tab);
  };

  // Initial load + auto-refresh every 15 min (clears cache to refetch)
  loadFeedTab('hn');
  setInterval(() => { Object.keys(feedCache).forEach(k => delete feedCache[k]); loadFeedTab(currentFeedTab); }, 15 * 60 * 1000);

  // --- Routine Now Strip ---
  const ROUTINE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function routineTimeToMin(str) {
    const [h, m] = str.split(':').map(Number);
    return h < 10 ? h * 60 + m + 1440 : h * 60 + m;
  }

  function routineNowMin() {
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    return now.getHours() < 10 ? m + 1440 : m;
  }

  async function loadRoutineNow() {
    const strip = document.getElementById('routine-now-strip');
    if (!strip) return;
    try {
      const res = await fetch('routine.json');
      if (!res.ok) return;
      const data = await res.json();

      function render() {
        const dayIdx = new Date().getDay();
        const today = ROUTINE_DAYS[dayIdx === 0 ? 6 : dayIdx - 1];
        const blocks = data.routine[today];
        if (!blocks) return;
        const nowM = routineNowMin();
        const idx = blocks.findIndex(b => {
          const [s, e] = b.time.split('–').map(t => routineTimeToMin(t.trim()));
          return nowM >= s && nowM < e;
        });
        if (idx === -1) { strip.style.display = 'none'; return; }

        const block = blocks[idx];
        document.getElementById('routine-now-icon').textContent = block.icon;
        document.getElementById('routine-now-block').textContent = block.block;
        document.getElementById('routine-now-time').textContent = block.time;
        document.getElementById('routine-now-task').textContent = '> ' + block.a.task;

        const next = blocks[idx + 1] || null;
        const divider = document.getElementById('routine-next-divider');
        const nextWrap = document.getElementById('routine-next-wrap');
        if (next) {
          document.getElementById('routine-next-icon').textContent = next.icon;
          document.getElementById('routine-next-block').textContent = next.block;
          document.getElementById('routine-next-time').textContent = next.time;
          document.getElementById('routine-next-task').textContent = '> ' + next.a.task;
          divider.style.display = '';
          nextWrap.style.display = 'flex';
        } else {
          divider.style.display = 'none';
          nextWrap.style.display = 'none';
        }

        strip.style.display = 'flex';

        // Upcoming strip (bottom widget) — blocks after "next"
        const upcomingStrip = document.getElementById('routine-upcoming-strip');
        const upcomingBlocks = document.getElementById('routine-upcoming-blocks');
        if (upcomingStrip && upcomingBlocks) {
          const future = blocks.slice(idx + 2, idx + 6); // up to 4 upcoming
          if (future.length) {
            upcomingBlocks.innerHTML = future.map((b, i) => `
              <div class="flex items-center gap-2 px-3 py-1.5 min-w-0 flex-1" style="${i > 0 ? 'border-left: 1px solid var(--color-border)' : ''}">
                <span class="text-sm leading-none shrink-0 opacity-50">${b.icon}</span>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[var(--color-muted)] font-mono font-bold text-[10px] uppercase tracking-wide truncate opacity-70">${b.block}</span>
                  </div>
                  <span class="text-[var(--color-muted)] font-mono text-[9px] opacity-40">${b.time}</span>
                </div>
              </div>
            `).join('');
            upcomingStrip.style.display = 'flex';
          } else {
            upcomingStrip.style.display = 'none';
          }
        }
      }

      render();
      setInterval(render, 60000);
    } catch (e) {
      // silently fail — strip stays hidden
    }
  }

  loadRoutineNow();

  // --- Market FX Widget ---
  // --- Market FX Widget ---
  // Pairs: [label, frankfurter-base, frankfurter-quote] — BDT handled separately via open.er-api
  const FX_PAIRS = [
    { label: 'USD / BDT', base: 'USD', quote: 'BDT', bdt: true },
    { label: 'USD / TRY', base: 'USD', quote: 'TRY' },
    { label: 'GBP / TRY', base: 'GBP', quote: 'TRY' },
    { label: 'GBP / USD', base: 'GBP', quote: 'USD' },
    { label: 'USD / EUR', base: 'USD', quote: 'EUR' },
    { label: 'CAD / EUR', base: 'CAD', quote: 'EUR' },
  ];



  function fxSparkline(values, color) {
    if (values.length < 2) return '';
    const W = 52, H = 18, pad = 1;
    const min = Math.min(...values), max = Math.max(...values);
    const range = max - min || 1;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const last = pts.split(' ').at(-1).split(',');
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;overflow:visible">
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity="0.8"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="1.8" fill="${color}"/>
    </svg>`;
  }

  function fxFmt(n) {
    return n >= 100 ? n.toFixed(2) : n >= 10 ? n.toFixed(3) : n.toFixed(4);
  }

  function fxRow(label, series, current) {
    const first = series[0] ?? current;
    const pct = ((current - first) / first) * 100;
    const up = pct >= 0;
    const color = up ? '#4ade80' : '#f87171';
    const pctStr = (up ? '+' : '') + pct.toFixed(2) + '%';
    const spark = fxSparkline(series, color);
    return `<div class="flex items-center gap-2 font-mono">
      <span class="text-[var(--color-muted)] text-[10px] uppercase tracking-wide w-[72px] shrink-0">${label}</span>
      <span class="text-[var(--color-fg)] font-bold text-[12px] w-[52px] text-right shrink-0">${fxFmt(current)}</span>
      <span class="text-[10px] w-[42px] text-right shrink-0" style="color:${color}">${pctStr}</span>
      <span class="shrink-0">${spark}</span>
    </div>`;
  }

  async function loadFXRates() {
    const container = document.getElementById('fx-container');
    if (!container) return;
    try {
      // 1. Current rates for all currencies (includes BDT) — open.er-api.com, free, no key, CORS-enabled
      const currentRes = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!currentRes.ok) throw new Error('current rates failed');
      const currentData = await currentRes.json();
      const rates = currentData.rates; // { BDT, TRY, GBP, EUR, CAD, ... }

      // 2. 7-day history for non-BDT pairs — api.frankfurter.app, free, CORS-enabled
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = new Date().toISOString().split('T')[0];
      const histUrl = `https://api.frankfurter.app/${startStr}..${endStr}?from=USD&to=EUR,TRY,GBP,CAD`;
      const histRes = await fetch(histUrl);
      if (!histRes.ok) throw new Error('history failed');
      const histData = await histRes.json();
      // histData.rates = { "2024-03-01": { EUR, TRY, GBP, CAD }, ... }
      const days = Object.keys(histData.rates).sort();
      const usdDayRates = days.map(d => histData.rates[d]); // array of { EUR, TRY, GBP, CAD }

      // cross rate from USD-base day snapshot
      function crossSeries(base, quote) {
        return usdDayRates.map(dr => {
          if (base === 'USD') return dr[quote];
          if (quote === 'USD') return dr[base] ? 1 / dr[base] : null;
          return (dr[base] && dr[quote]) ? dr[quote] / dr[base] : null;
        }).filter(v => v !== null);
      }

      // 3. BDT history from localStorage (accumulates over visits)
      const todayKey = endStr;
      const bdtStore = JSON.parse(localStorage.getItem('fx_bdt') || '{}');
      bdtStore[todayKey] = rates['BDT'];
      // prune to last 30 days
      const pruned = {};
      Object.keys(bdtStore).sort().slice(-30).forEach(k => pruned[k] = bdtStore[k]);
      localStorage.setItem('fx_bdt', JSON.stringify(pruned));
      const bdtSeries = Object.keys(pruned).sort().slice(-7).map(k => pruned[k]);

      container.innerHTML = FX_PAIRS.map(p => {
        if (p.bdt) {
          return fxRow(p.label, bdtSeries, rates['BDT']);
        }
        const series = crossSeries(p.base, p.quote);
        const current = (() => {
          if (p.base === 'USD') return rates[p.quote];
          if (p.quote === 'USD') return rates[p.base] ? 1 / rates[p.base] : 0;
          return (rates[p.base] && rates[p.quote]) ? rates[p.quote] / rates[p.base] : 0;
        })();
        return fxRow(p.label, series, current);
      }).join('') +
        `<div class="text-[9px] text-[var(--color-muted)] opacity-30 mt-1 font-mono">7d · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;

    } catch (e) {
      const c = document.getElementById('fx-container');
      if (c) c.innerHTML = `<div class="text-[var(--color-muted)] text-[10px] font-mono opacity-40">// could not fetch rates</div>`;
    }
  }

  loadFXRates();
  setInterval(loadFXRates, 5 * 60 * 1000);

  // --- Todo Widget ---
  const todoInput = document.getElementById('todo-input');
  const todoList  = document.getElementById('todo-list');

  if (todoInput && todoList) {
    let todos = JSON.parse(localStorage.getItem('tui-todos') || '[]');

    function saveTodos() {
      localStorage.setItem('tui-todos', JSON.stringify(todos));
    }

    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function renderTodos() {
      if (!todos.length) {
        todoList.innerHTML = '<div class="todo-empty">// no tasks yet</div>';
        return;
      }
      todoList.innerHTML = todos.map(t => `
        <div class="todo-item${t.done ? ' todo-done' : ''}" data-id="${t.id}">
          <span class="todo-check">${t.done ? '[x]' : '[ ]'}</span>
          <span class="todo-text">${escHtml(t.text)}</span>
          <button class="todo-del" data-id="${t.id}" title="delete">×</button>
        </div>`).join('');

      todoList.querySelectorAll('.todo-item').forEach(el => {
        el.addEventListener('click', e => {
          if (e.target.classList.contains('todo-del')) return;
          const t = todos.find(t => t.id === el.dataset.id);
          if (t) { t.done = !t.done; saveTodos(); renderTodos(); }
        });
      });

      todoList.querySelectorAll('.todo-del').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          todos = todos.filter(t => t.id !== btn.dataset.id);
          saveTodos(); renderTodos();
        });
      });
    }

    todoInput.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const text = todoInput.value.trim();
      if (!text) return;
      todos.unshift({ id: Date.now().toString(), text, done: false });
      saveTodos(); renderTodos();
      todoInput.value = '';
    });

    renderTodos();
  }

});
