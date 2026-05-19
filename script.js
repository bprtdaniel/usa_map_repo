let timelineCounters = [];
let swallowCounters = [];

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors"
      }
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm",
        paint: {
          "raster-opacity": 0.14
        }
      }
    ]
  },
  center: [-98, 39],
  zoom: 3.1
});

// Disable map interactions so scrolling controls the story
map.scrollZoom.disable();
map.dragPan.disable();
map.dragRotate.disable();
map.doubleClickZoom.disable();
map.touchZoomRotate.disable();
map.keyboard.disable();
map.boxZoom.disable();

map.on("load", async () => {
  timelineCounters = await fetch("data/timeline_counters_clean.json")
    .then(response => response.json());

  swallowCounters = await fetch("data/swallow_counters_by_step.json")
    .then(response => response.json());

  map.addSource("us-territory", {
    type: "geojson",
    data: "data/us_territory_snapshots_by_step_simplified.geojson"
  });

  map.addSource("full-cession-footprint", {
    type: "geojson",
    data: "data/ioa_full_cession_footprint.geojson"
  });

  map.addSource("current-reservations", {
    type: "geojson",
    data: "data/ioa_current_reservations_final_step_simplified.geojson"
  });

  map.addSource("trail-of-tears", {
    type: "geojson",
    data: "data/trail_of_tears.json"
  });

  map.addSource("lewis-clark-sites", {
    type: "geojson",
    data: "data/lewis_clark_points.json"
  });

  map.addSource("eastern-states", {
    type: "geojson",
    data: "data/eastern_states.geojson"
  });

  map.addSource("wayne", {
    type: "geojson",
    data: "data/wayne.geojson"
  });

  map.addSource("miami", {
    type: "geojson",
    data: "data/miami.geojson"
  });

  addLayers();

  updateStep("blank");

  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.15
    })
    .onStepEnter(response => {
      const step = response.element.dataset.step;
      updateStep(step);
    });

  window.addEventListener("resize", scroller.resize);
});

function addLayers() {
  map.addLayer({
    id: "full-cession-footprint-fill",
    type: "fill",
    source: "full-cession-footprint",
    paint: {
      "fill-color": "#8fb8a0",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "full-cession-footprint-outline",
    type: "line",
    source: "full-cession-footprint",
    paint: {
      "line-color": "#4f7a62",
      "line-width": 1,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "us-territory-fill",
    type: "fill",
    source: "us-territory",
    paint: {
      "fill-color": "#9b4f3f",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "us-territory-outline",
    type: "line",
    source: "us-territory",
    paint: {
      "line-color": "#5a1e16",
      "line-width": 1.2,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "eastern-states-fill",
    type: "fill",
    source: "eastern-states",
    paint: {
      "fill-color": "#7b4d83",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "eastern-states-outline",
    type: "line",
    source: "eastern-states",
    paint: {
      "line-color": "#2c1f2e",
      "line-width": 1.2,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "miami-fill",
    type: "fill",
    source: "miami",
    paint: {
      "fill-color": "#3f7f9f",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "miami-outline",
    type: "line",
    source: "miami",
    paint: {
      "line-color": "#17384a",
      "line-width": 1.5,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "wayne-fill",
    type: "fill",
    source: "wayne",
    paint: {
      "fill-color": "#d96b3f",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "wayne-outline",
    type: "line",
    source: "wayne",
    paint: {
      "line-color": "#6b2415",
      "line-width": 1.5,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "trail-of-tears-halo",
    type: "line",
    source: "trail-of-tears",
    paint: {
      "line-color": "#3a241b",
      "line-width": 5.2,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "trail-of-tears-line",
    type: "line",
    source: "trail-of-tears",
    paint: {
      "line-color": "#e8c878",
      "line-width": 2.6,
      "line-opacity": 0
    }
  });

  map.addLayer({
    id: "lewis-clark-sites-circle",
    type: "circle",
    source: "lewis-clark-sites",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        4,
        4.5,
        5.5,
        6,
        7
      ],
      "circle-color": "#d98b45",
      "circle-opacity": 0,
      "circle-stroke-color": "#fff7e6",
      "circle-stroke-width": 1.7,
      "circle-stroke-opacity": 0
    }
  });

  map.addLayer({
    id: "lewis-clark-sites-label",
    type: "symbol",
    source: "lewis-clark-sites",
    minzoom: 3.6,
    layout: {
      "text-field": ["get", "AREANAME"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3.6,
        9,
        5,
        11
      ],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
      "text-allow-overlap": false,
      "text-ignore-placement": false
    },
    paint: {
      "text-color": "#2b2118",
      "text-halo-color": "#fff7e6",
      "text-halo-width": 1.25,
      "text-opacity": 0
    }
  });

  map.addLayer({
    id: "current-reservations-fill",
    type: "fill",
    source: "current-reservations",
    paint: {
      "fill-color": "#2f6f5e",
      "fill-opacity": 0
    }
  });

  map.addLayer({
    id: "current-reservations-outline",
    type: "line",
    source: "current-reservations",
    paint: {
      "line-color": "#1d463b",
      "line-width": 1,
      "line-opacity": 0
    }
  });
}

function updateStep(rawStep) {
  const stringSteps = [
    "hint",
    "blank",
    "base",
    "east-native",
    "lewis-clark",
    "wayne",
    "miami"
  ];

  const step = stringSteps.includes(rawStep)
    ? rawStep
    : Number(rawStep);

  resetLayerVisibility();

  if (step === "hint") {
    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.45);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.8);

    updateBaseCounters();
    flyToStep("blank");
    return;
  }

  if (step === "blank") {
    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.45);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.8);

    updateBaseCounters();
    flyToStep("blank");
    return;
  }

  if (step === "east-native") {
    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.45);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.8);

    map.setPaintProperty("eastern-states-fill", "fill-opacity", 0.55);
    map.setPaintProperty("eastern-states-outline", "line-opacity", 1);

    updateBaseCounters();
    flyToStep("east-native");
    return;
  }

  if (step === "base") {
    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.45);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.8);

    updateBaseCounters();
    flyToStep("base");
    return;
  }

  if (step === "wayne") {
    map.setFilter("us-territory-fill", ["==", ["get", "step"], 2]);
    map.setFilter("us-territory-outline", ["==", ["get", "step"], 2]);

    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.42);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.45);

    map.setPaintProperty("us-territory-fill", "fill-opacity", 0.56);
    map.setPaintProperty("us-territory-outline", "line-opacity", 0.95);

    map.setPaintProperty("wayne-fill", "fill-opacity", 0.68);
    map.setPaintProperty("wayne-outline", "line-opacity", 1);

    updateSwallowCounters(2);
    flyToStep("wayne");
    return;
  }

  if (step === "miami") {
    map.setFilter("us-territory-fill", ["==", ["get", "step"], 2]);
    map.setFilter("us-territory-outline", ["==", ["get", "step"], 2]);

    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.42);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.45);

    map.setPaintProperty("us-territory-fill", "fill-opacity", 0.56);
    map.setPaintProperty("us-territory-outline", "line-opacity", 0.95);

    map.setPaintProperty("wayne-fill", "fill-opacity", 0.68);
    map.setPaintProperty("wayne-outline", "line-opacity", 1);

    map.setPaintProperty("miami-fill", "fill-opacity", 0.46);
    map.setPaintProperty("miami-outline", "line-opacity", 1);

    updateSwallowCounters(2);
    flyToStep("miami");
    return;
  }

  if (step === "lewis-clark") {
    map.setFilter("us-territory-fill", ["==", ["get", "step"], 3]);
    map.setFilter("us-territory-outline", ["==", ["get", "step"], 3]);

    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.42);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.45);

    map.setPaintProperty("us-territory-fill", "fill-opacity", 0.56);
    map.setPaintProperty("us-territory-outline", "line-opacity", 0.95);

    map.setPaintProperty("lewis-clark-sites-circle", "circle-opacity", 0.95);
    map.setPaintProperty("lewis-clark-sites-circle", "circle-stroke-opacity", 1);
    map.setPaintProperty("lewis-clark-sites-label", "text-opacity", 0.95);

    updateLewisClarkCounters();
    flyToStep("lewis-clark");
    return;
  }

  if (step >= 1 && step <= 10) {
    map.setFilter("us-territory-fill", ["==", ["get", "step"], step]);
    map.setFilter("us-territory-outline", ["==", ["get", "step"], step]);

    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.42);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.45);

    map.setPaintProperty("us-territory-fill", "fill-opacity", 0.56);
    map.setPaintProperty("us-territory-outline", "line-opacity", 0.95);

    if (step >= 7 && step <= 10) {
      map.setPaintProperty("trail-of-tears-halo", "line-opacity", 0.75);
      map.setPaintProperty("trail-of-tears-line", "line-opacity", 0.95);
    }

    updateSwallowCounters(step);
    flyToStep(step);
    return;
  }

  if (step === 11) {
    map.setPaintProperty("full-cession-footprint-fill", "fill-opacity", 0.12);
    map.setPaintProperty("full-cession-footprint-outline", "line-opacity", 0.2);

    map.setPaintProperty("current-reservations-fill", "fill-opacity", 0.5);
    map.setPaintProperty("current-reservations-outline", "line-opacity", 1);

    updateCurrentReservationCounters(step);
    flyToStep(step);
  }
}

function resetLayerVisibility() {
  const paintSettings = [
    ["full-cession-footprint-fill", "fill-opacity", 0],
    ["full-cession-footprint-outline", "line-opacity", 0],
    ["us-territory-fill", "fill-opacity", 0],
    ["us-territory-outline", "line-opacity", 0],
    ["eastern-states-fill", "fill-opacity", 0],
    ["eastern-states-outline", "line-opacity", 0],
    ["wayne-fill", "fill-opacity", 0],
    ["wayne-outline", "line-opacity", 0],
    ["miami-fill", "fill-opacity", 0],
    ["miami-outline", "line-opacity", 0],
    ["trail-of-tears-halo", "line-opacity", 0],
    ["trail-of-tears-line", "line-opacity", 0],
    ["lewis-clark-sites-circle", "circle-opacity", 0],
    ["lewis-clark-sites-circle", "circle-stroke-opacity", 0],
    ["lewis-clark-sites-label", "text-opacity", 0],
    ["current-reservations-fill", "fill-opacity", 0],
    ["current-reservations-outline", "line-opacity", 0]
  ];

  paintSettings.forEach(([layer, property, value]) => {
    if (map.getLayer(layer)) {
      map.setPaintProperty(layer, property, value);
    }
  });
}

function updateBlankCounters() {
  document.getElementById("counter-year").textContent = "—";
  document.getElementById("counter-us-area").textContent = "—";
  document.getElementById("counter-cessions").textContent = "—";
  document.getElementById("counter-cession-area").textContent = "—";
}

function updateBaseCounters() {
  const row = swallowCounters[0];

  document.getElementById("counter-year").textContent = "Before U.S. timeline";
  document.getElementById("counter-us-area").textContent = "0 sq mi shown";
  document.getElementById("counter-cessions").textContent = "0 sq mi overlapped";
  document.getElementById("counter-cession-area").textContent =
    formatNumber(row.full_cession_footprint_area_sqmi) + " sq mi footprint";
}

function updateSwallowCounters(step) {
  const row = swallowCounters.find(d => Number(d.step) === step);
  const timelineRow = timelineCounters.find(d => Number(d.step) === step);

  if (!row || !timelineRow) return;

  document.getElementById("counter-year").textContent = row.year;

  document.getElementById("counter-us-area").textContent =
    formatNumber(timelineRow.area_sqmi_total) + " sq mi";

  document.getElementById("counter-cessions").textContent =
    formatNumber(row.swallowed_by_us_area_sqmi) + " sq mi overlapped";

  document.getElementById("counter-cession-area").textContent =
    formatNumber(row.remaining_outside_us_area_sqmi) + " sq mi outside U.S. claim";
}

function updateLewisClarkCounters() {
  const row = swallowCounters.find(d => Number(d.step) === 3);
  const timelineRow = timelineCounters.find(d => Number(d.step) === 3);

  document.getElementById("counter-year").textContent = "1804–1806";

  if (!row || !timelineRow) return;

  document.getElementById("counter-us-area").textContent =
    formatNumber(timelineRow.area_sqmi_total) + " sq mi";

  document.getElementById("counter-cessions").textContent =
    formatNumber(row.swallowed_by_us_area_sqmi) + " sq mi overlapped";

  document.getElementById("counter-cession-area").textContent =
    "Louisiana claim / expedition route";
}

function updateCurrentReservationCounters(step) {
  const row = timelineCounters.find(d => Number(d.step) === step);

  if (!row) return;

  document.getElementById("counter-year").textContent = "Present day";

  document.getElementById("counter-us-area").textContent =
    formatNumber(row.area_sqmi_total) + " sq mi";

  document.getElementById("counter-cessions").textContent =
    formatNumber(row.current_reservation_features) + " current reservation records";

  document.getElementById("counter-cession-area").textContent =
    "shown separately";
}

function flyToStep(step) {
  const views = {
    blank: { center: [-98, 39], zoom: 3.1 },
    base: { center: [-98, 39], zoom: 3.1 },
    "east-native": { center: [-82, 38], zoom: 4.1 },
    "lewis-clark": { center: [-106.5, 45.5], zoom: 3.65 },
    wayne: { center: [-84, 41], zoom: 4.2 },
    miami: { center: [-84, 41], zoom: 4.2 },
    1: { center: [-82, 39], zoom: 4 },
    2: { center: [-84, 41], zoom: 4.2 },
    3: { center: [-94, 39], zoom: 3.4 },
    4: { center: [-88, 35], zoom: 4.2 },
    5: { center: [-88, 35], zoom: 4.2 },
    6: { center: [-87, 34], zoom: 4.4 },
    7: { center: [-88, 36], zoom: 4.4 },
    8: { center: [-105, 38], zoom: 3.5 },
    9: { center: [-98, 38], zoom: 3.6 },
    10: { center: [-101, 39], zoom: 3.4 },
    11: { center: [-98, 39], zoom: 3.3 }
  };

  const view = views[step] || views.blank;

  map.flyTo({
    center: view.center,
    zoom: view.zoom,
    duration: 1000
  });
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return Math.round(Number(value)).toLocaleString("en-US");
}