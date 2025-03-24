import { createRouter, createWebHistory } from 'vue-router';
import StartPage from '@/views/StartPage.vue';
import EquipmentPage from '@/views/EquipmentPage.vue';
import CameraPage from '@/views/CameraPage.vue';
import FocusPage from '@/views/FocusPage.vue';
import MountPage from '@/views/MountPage.vue';
import GuidingPage from '@/views/GuidingPage.vue';
import LastLogs from '@/components/LastLogs.vue';
import SequencePage from '@/views/SequencePage.vue';
import DomePage from '@/views/DomePage.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import FlatdevicePage from '@/views/FlatdevicePage.vue';
import SequenceMonitoring from '@/views/SequenceMonitoring.vue';
import SetupPage from '@/views/SetupPage.vue';
import SwitchPage from '@/views/SwitchPage.vue';
import Flatassistant from '@/views/FlatassistantPage.vue';
import StellariumView from '@/views/StellariumView.vue';
import { useSettingsStore } from '@/store/settingsStore';
import VncClient from '@/views/VncClient.vue';

const routes = [
  {
    path: '/',
    component: StartPage,
    meta: { requiresSetup: true },
  },
  {
    path: '/setup',
    component: SetupPage,
    meta: { requiresSetup: false },
  },
  { path: '/equipment', component: EquipmentPage, meta: { requiresSetup: true } },
  { path: '/camera', component: CameraPage, meta: { requiresSetup: true } },
  { path: '/autofocus', component: FocusPage, meta: { requiresSetup: true } },
  { path: '/mount', component: MountPage, meta: { requiresSetup: true } },
  { path: '/guider', component: GuidingPage, meta: { requiresSetup: true } },
  { path: '/logs', component: LastLogs, meta: { requiresSetup: true } },
  { path: '/sequence', component: SequencePage, meta: { requiresSetup: true } },
  { path: '/dome', component: DomePage, meta: { requiresSetup: true } },
  { path: '/settings', component: SettingsPage, meta: { requiresSetup: true } },
  { path: '/flat', component: FlatdevicePage, meta: { requiresSetup: true } },
  { path: '/seq-mon', component: SequenceMonitoring, meta: { requiresSetup: true } },
  { path: '/switch', component: SwitchPage, meta: { requiresSetup: true } },
  { path: '/flats', component: Flatassistant, meta: { requiresSetup: true } },
  { path: '/stellarium', component: StellariumView, meta: { requiresSetup: true } },
  { path: '/vnc', component: VncClient, meta: { requiresSetup: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const settingsStore = useSettingsStore();

  if (to.meta.requiresSetup && !settingsStore.isSetupComplete()) {
    next('/setup');
  } else if (to.path === '/setup' && settingsStore.isSetupComplete()) {
    next('/');
  } else {
    next();
  }
});

export default router;
