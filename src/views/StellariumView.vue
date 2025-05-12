<template>
  <div class="stellarium-container">
    <!-- Canvas für Stellarium -->
    <canvas ref="stelCanvas" class="stellarium-canvas"></canvas>

    <!-- Button für das Suchfeld (Lupe) -->
    <button
      @click="toggleSearch"
      class="absolute top-3 right-3 p-2 bg-gray-700 border border-cyan-600 rounded-full shadow-md"
    >
      <MagnifyingGlassIcon class="w-6 h-6 text-white" />
    </button>

    <!-- Mount Position Component -->
    <stellariumMount
      v-if="stellariumStore.stel && store.mountInfo.Connected"
      ref="mountComponent"
      :canvasRef="stelCanvas"
      :isSearchVisible="isSearchVisible"
    />

    <!-- Overlay für das Suchfeld -->
    <div
      v-if="isSearchVisible"
      class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg text-white w-80"
    >
      <steallriumSearch ref="searchComponent" />
    </div>

    <!-- Overlay für das ausgewählte Objekt -->
    <SelectedObject
      v-if="selectedObject"
      :selectedObject="selectedObject"
      :selectedObjectRa="selectedObjectRa"
      :selectedObjectDec="selectedObjectDec"
      :selectedObjectRaDeg="selectedObjectRaDeg"
      :selectedObjectDecDeg="selectedObjectDecDeg"
      @setFramingCoordinates="setFramingCoordinates"
    />
    <div class="absolute bottom-3 left-2 flex gap-2 bg-black bg-opacity-90 p-2 rounded-full">
      <stellariumCredits />
      <stellariumSettings />
    </div>
    <!-- Clock -->
    <stellariumClock v-if="stellariumStore.stel" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { degreesToHMS, degreesToDMS, rad2deg } from '@/utils/utils';
import { apiStore } from '@/store/store';
import { useFramingStore } from '@/store/framingStore';
import { useStellariumStore } from '@/store/stellariumStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'vue-router';
import steallriumSearch from '@/components/stellarium/steallriumSearch.vue';
import stellariumMount from '@/components/stellarium/stellariumMount.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import stellariumCredits from '@/components/stellarium/stellariumCredits.vue';
import SelectedObject from '@/components/stellarium/SelectedObject.vue';
import stellariumSettings from '@/components/stellarium/stellariumSettings.vue';
import stellariumClock from '@/components/stellarium/stellariumClock.vue';
import { Capacitor } from '@capacitor/core';

const store = apiStore();
const framingStore = useFramingStore();
const stellariumStore = useStellariumStore();
const settingsStore = useSettingsStore();
const router = useRouter();
const stelCanvas = ref(null);
const selectedObject = ref(null);
const selectedObjectRa = ref(null);
const selectedObjectDec = ref(null);
const selectedObjectRaDeg = ref(null);
const selectedObjectDecDeg = ref(null);
const wasmPath = '/stellarium-js/stellarium-web-engine.wasm';
const isSearchVisible = ref(false);
const searchComponent = ref(null);
const mountComponent = ref(null);
const isIOS = Capacitor.getPlatform() === 'ios';

// Funktion zum Ein-/Ausblenden des Suchfeldes
function toggleSearch() {
  isSearchVisible.value = !isSearchVisible.value;

  if (isSearchVisible.value) {
    selectedObject.value = null;
    nextTick(() => {
      searchComponent.value?.focusSearchInput();
    });
  }
}

// Framing-Koordinaten
function setFramingCoordinates() {
  framingStore.RAangleString = selectedObjectRa.value;
  framingStore.DECangleString = selectedObjectDec.value;
  framingStore.RAangle = selectedObjectRaDeg.value;
  framingStore.DECangle = selectedObjectDecDeg.value;
  framingStore.selectedItem = selectedObject.value;
  console.log('Set Framing Coordinates');
  store.mount.currentTab = 'showSlew';
  console.log('store.mount.currentTab', store.mount.currentTab);
  router.push('/mount');
}

watch(
  () => stellariumStore.search.DECangleString,
  (newValue) => {
    console.log('selectedObject:', newValue);
    stellariumStore.search.DECangleString = '';
  }
);

onMounted(async () => {
  //NINA vorbereiten
  await store.fetchProfilInfos();

  // iOS-specific optimizations - prepare canvas
  if (isIOS) {
    if (stelCanvas.value) {
      // Set lower resolution or ratio for iOS for better performance
      const scale = 0.8; // Use a slightly reduced size for iOS
      const container = stelCanvas.value.parentElement;
      if (container) {
        stelCanvas.value.width = container.clientWidth * scale;
        stelCanvas.value.height = container.clientHeight * scale;
      }
    }
  }

  // Schritt 1) Stellarium-Web-Engine-Skript dynamisch laden
  const script = document.createElement('script');
  script.src = '/stellarium-js/stellarium-web-engine.js';
  console.log('Stellarium-Web-Engine-Skript wird geladen...');

  script.onload = async () => {
    if (!window.StelWebEngine) {
      console.error('StelWebEngine globales Objekt nicht gefunden!');
      return;
    }

    try {
      const response = await fetch(wasmPath);
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der WASM-Datei: ${response.statusText}`);
      }
      const wasmArrayBuffer = await response.arrayBuffer();
      console.log('WASM-Datei erfolgreich geladen. Größe (Byte):', wasmArrayBuffer.byteLength);

      // Configure WebGL options based on platform
      const webGLOptions = {
        powerPreference: isIOS ? 'low-power' : 'high-performance',
        preserveDrawingBuffer: false,
        antialias: !isIOS, // Disable antialiasing on iOS for better performance
        depth: true,
        failIfMajorPerformanceCaveat: false,
      };

      // Pre-initialize WebGL context with optimized settings for iOS
      if (isIOS && stelCanvas.value) {
        const gl = stelCanvas.value.getContext('webgl', webGLOptions);
        if (gl) {
          // Lower precision for better performance on iOS
          const fragShaderPrecision = gl.getShaderPrecisionFormat(
            gl.FRAGMENT_SHADER,
            gl.MEDIUM_FLOAT
          );
          if (fragShaderPrecision) {
            console.log('Using medium precision for WebGL on iOS');
          }

          // Set texture size limits for iOS
          const maxTextureSize = Math.min(1024, gl.getParameter(gl.MAX_TEXTURE_SIZE));
          console.log('Max texture size for iOS:', maxTextureSize);
        }
      }

      window.StelWebEngine({
        wasmFile: wasmPath,
        canvas: stelCanvas.value,
        onReady(stel) {
          console.log('Stellarium ist bereit!');
          stellariumStore.stel = stel;

          // Beobachter-Standort setzen (Koordinaten müssen in Radian sein):
          stel.core.observer.latitude = store.profileInfo.AstrometrySettings.Latitude * stel.D2R;
          stel.core.observer.longitude = store.profileInfo.AstrometrySettings.Longitude * stel.D2R;
          stel.core.observer.elevation = store.profileInfo.AstrometrySettings.Elevation;

          console.log('zeit', stel.core.observer.utc);
          //stel.core.observer.tt = 0
          console.log('Aktuelle Beobachterposition:');
          console.log(
            'Breitengrad:',
            stel.core.observer.latitude,
            store.profileInfo.AstrometrySettings.Latitude
          );
          console.log(
            'Längengrad:',
            stel.core.observer.longitude,
            store.profileInfo.AstrometrySettings.Longitude
          );
          console.log('Höhe:', stel.core.observer.elevation);

          // Zeitgeschwindigkeit auf 1 setzen
          stel.core.time_speed = 1;

          // Schritt 3) Datenquellen (Kataloge) hinzufügen
          //IP und Port vom Plugin ermitteln
          const protocol = settingsStore.backendProtocol || 'http';
          const host = settingsStore.connection.ip || window.location.hostname;
          const port = settingsStore.connection.port || window.location.port;
          const baseUrl = `${protocol}://${host}:${port}/stellarium-data/`;
          stellariumStore.baseUrl = baseUrl;
          const core = stel.core;

          //Daten hinzufügen
          core.stars.addDataSource({ url: baseUrl + 'stars' });

          // Load fewer resources on iOS for better performance
          if (isIOS) {
            // On iOS, only load essential data sources
            core.planets.addDataSource({ url: baseUrl + 'surveys/sso', key: 'default' });
            core.milkyway.addDataSource({ url: baseUrl + 'surveys/milkyway' });

            // If texture size can be reduced on iOS
            if (core.dss) core.dss.tile_texture_size = 256; // Lower from default 512
            if (core.milkyway) core.milkyway.tile_texture_size = 256;

            // Disable unnecessary features on iOS to save resources
            stellariumStore.stellarium.equatorialLinesVisible = false;
            stellariumStore.stellarium.azimuthalLinesVisible = false;
            stellariumStore.stellarium.eclipticLinesVisible = false;
            stellariumStore.stellarium.meridianLinesVisible = false;
          } else {
            // Load all data sources on other platforms
            core.skycultures.addDataSource({
              url: baseUrl + 'skycultures/western',
              key: 'western',
            });
            core.dsos.addDataSource({ url: baseUrl + 'dso' });
            core.dss.addDataSource({ url: baseUrl + 'surveys/dss' });
            core.milkyway.addDataSource({ url: baseUrl + 'surveys/milkyway' });
            core.minor_planets.addDataSource({ url: baseUrl + 'mpcorb.dat', key: 'mpc_asteroids' });
            core.planets.addDataSource({ url: baseUrl + 'surveys/sso/moon', key: 'moon' });
            core.planets.addDataSource({ url: baseUrl + 'surveys/sso/sun', key: 'sun' });
            core.planets.addDataSource({ url: baseUrl + 'surveys/sso', key: 'default' });
            core.comets.addDataSource({ url: baseUrl + 'CometEls.txt', key: 'mpc_comets' });
          }

          stellariumStore.updateStellariumCore();

          // Schritt 4) Selektion beobachten
          stel.change((obj, attr) => {
            if (attr === 'selection') {
              const selection = core.selection;
              if (!selection) {
                // Abwahl
                selectedObject.value = null;
                console.log('Keine Auswahl (abgewählt).');
                return;
              }
              if (stel.core.selection) {
                isSearchVisible.value = false;
                const selectedDesignations = stel.core.selection.designations();
                selectedObject.value = selectedDesignations;
                console.log('Objekt-Bezeichnungen:', selectedDesignations);
                const info = stel.core.selection;
                //console.log('Objekt-Informationen:', info);

                const raDec = info.getInfo('RADEC');
                console.log(raDec);
                //const cirs = stel.convertFrame(stel.observer, 'ICRF', 'ICRF', raDec);
                const radecCIRS = stel.c2s(raDec);
                console.log('radecCIRS', radecCIRS);
                const ra = stel.anp(radecCIRS[0]); // RA in Radian
                const dec = stel.anpm(radecCIRS[1]); // Dec in Radian

                console.log(ra, dec);

                selectedObjectRa.value = degreesToHMS(rad2deg(ra));
                selectedObjectDec.value = degreesToDMS(rad2deg(dec));
                selectedObjectRaDeg.value = rad2deg(ra);
                selectedObjectDecDeg.value = rad2deg(dec);
              }
            }
          });
        },
      });
    } catch (err) {
      console.error('Fehler bei Fetch oder StelWebEngine:', err);
    }
  };
  document.head.appendChild(script);
});
onBeforeUnmount(() => {
  if (stellariumStore.stel) {
    console.log('Stellarium wird zerstört...');

    // iOS specific cleanup to prevent memory leaks
    if (isIOS) {
      try {
        // Clean up core resources
        if (stellariumStore.stel.core) {
          const core = stellariumStore.stel.core;
          // Stop time animation
          core.time_speed = 0;

          // Clean up data sources
          if (core.stars) core.stars.removeDataSources();
          if (core.planets) core.planets.removeDataSources();
          if (core.milkyway) core.milkyway.removeDataSources();

          // Release references
          core.observer = null;
          core.selection = null;
        }
      } catch (e) {
        console.error('iOS cleanup error:', e);
      }
    }

    // Release WebGL context
    if (stelCanvas.value) {
      try {
        const gl = stelCanvas.value.getContext('webgl');
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context').loseContext();
        }
      } catch (e) {
        console.error('WebGL context release error:', e);
      }

      // Reset canvas dimensions
      stelCanvas.value.width = 0;
      stelCanvas.value.height = 0;
    }

    // Set instance to null
    stellariumStore.stel = null;
    console.log('Stellarium erfolgreich beendet.');
  }
});
</script>

<style scoped>
.stellarium-container {
  position: fixed;
  top: 10;
  left: 0;
  width: 100vw;
  height: calc(100dvh - 120px);
  z-index: 0;
}

.stellarium-canvas {
  width: 100%;
  height: 100%;
}
</style>
