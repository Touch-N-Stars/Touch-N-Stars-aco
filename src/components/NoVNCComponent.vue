<template>
  <div>
    <div ref="screen" class="vnc-screen"></div>
    <div v-if="debug" class="debug-panel">
      <h3>Debug Info:</h3>
      <div class="debug-controls">
        <button @click="reconnect">Reconnect</button>
        <button @click="sendTestMessage">Send Test Message</button>
      </div>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import RFB from '@novnc/novnc/';

export default {
  name: 'NoVNCComponent',
  props: {
    url: {
      type: String,
      required: true,
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const screen = ref(null);
    const rfb = ref(null);
    const debugInfo = ref({
      status: 'Initializing',
      events: [],
      connectionAttempts: 0,
    });

    const addDebugEvent = (event) => {
      const timestamp = new Date().toLocaleTimeString();
      debugInfo.value.events.unshift({ timestamp, ...event });
      // Keep only the last 10 events
      if (debugInfo.value.events.length > 10) {
        debugInfo.value.events.pop();
      }
      console.log(`[VNC Debug] ${timestamp}:`, event);
    };

    const updateDebugInfo = (info) => {
      debugInfo.value = { ...debugInfo.value, ...info };
      emit('debug-update', debugInfo.value);
    };

    const sendTestMessage = () => {
      if (rfb.value && rfb.value._websocket && rfb.value._websocket.readyState === WebSocket.OPEN) {
        // Send a simple ping message to test the WebSocket connection
        try {
          // This is just for testing the connection, not a standard VNC message
          const testBuffer = new Uint8Array([1, 2, 3, 4]);
          rfb.value._websocket.send(testBuffer);
          addDebugEvent({ type: 'test', message: 'Test message sent', data: [1, 2, 3, 4] });
        } catch (e) {
          addDebugEvent({
            type: 'error',
            message: 'Failed to send test message',
            error: e.toString(),
          });
        }
      } else {
        addDebugEvent({ type: 'error', message: 'WebSocket not ready for test message' });
      }
    };

    const connectVNC = () => {
      if (rfb.value) {
        rfb.value.disconnect();
        rfb.value = null;
      }

      debugInfo.value.connectionAttempts++;
      addDebugEvent({
        type: 'info',
        message: `Connection attempt ${debugInfo.value.connectionAttempts}`,
        url: props.url,
      });

      try {
        updateDebugInfo({ status: 'Connecting...' });

        // Log the URL we're trying to connect to
        console.log(`Attempting to connect to: ${props.url}`);

        // Create RFB object with more debugging options
        rfb.value = new RFB(screen.value, props.url, {
          credentials: { password: '' },
          wsProtocols: ['binary'],
          shared: true,
          repeaterID: '',
          showDotCursor: true,
          debugLevel: props.debug ? 'debug' : 'warn',
        });

        // Add event listeners
        rfb.value.addEventListener('connect', () => {
          addDebugEvent({ type: 'connect', message: 'Connected to VNC' });
          updateDebugInfo({ status: 'Connected' });
        });

        rfb.value.addEventListener('disconnect', (e) => {
          addDebugEvent({
            type: 'disconnect',
            message: 'Disconnected from VNC',
            reason: e.detail?.reason,
          });
          updateDebugInfo({ status: 'Disconnected', reason: e.detail?.reason });
        });

        rfb.value.addEventListener('credentialsrequired', () => {
          addDebugEvent({ type: 'auth', message: 'VNC credentials required' });
          updateDebugInfo({ status: 'Credentials Required' });
        });

        rfb.value.addEventListener('securityfailure', (e) => {
          addDebugEvent({ type: 'error', message: 'VNC security failure', details: e.detail });
          updateDebugInfo({ status: 'Security Failure', details: e.detail });
        });

        // Add more detailed event listeners for debugging
        if (props.debug) {
          rfb.value.addEventListener('bell', () =>
            addDebugEvent({ type: 'bell', message: 'Bell event received' })
          );

          rfb.value.addEventListener('capabilities', (e) =>
            addDebugEvent({
              type: 'capabilities',
              message: 'Capabilities updated',
              data: e.detail.capabilities,
            })
          );

          rfb.value.addEventListener('clipboard', (e) =>
            addDebugEvent({ type: 'clipboard', message: 'Clipboard event', text: e.detail.text })
          );

          // Add desktop size event
          rfb.value.addEventListener('desktopname', (e) =>
            addDebugEvent({
              type: 'desktop',
              message: 'Desktop name received',
              name: e.detail.name,
            })
          );

          // Add resize event
          rfb.value.addEventListener('resize', (e) =>
            addDebugEvent({
              type: 'resize',
              message: 'Resize event',
              width: e.detail.width,
              height: e.detail.height,
            })
          );
        }

        // Monitor WebSocket state
        if (props.debug) {
          const checkWebSocketState = setInterval(() => {
            if (!rfb.value || !rfb.value._websocket) {
              clearInterval(checkWebSocketState);
              return;
            }

            const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
            const state = states[rfb.value._websocket.readyState];

            updateDebugInfo({
              webSocketState: state,
              fbWidth: rfb.value._fbWidth,
              fbHeight: rfb.value._fbHeight,
              viewOnly: rfb.value._viewOnly,
            });
          }, 1000);
        }
      } catch (err) {
        console.error('RFB initialization error:', err);
        addDebugEvent({
          type: 'error',
          message: 'Error initializing RFB',
          error: err.toString(),
          stack: err.stack,
        });
        updateDebugInfo({ status: 'Error', error: err.toString() });
      }
    };

    const reconnect = () => {
      addDebugEvent({ type: 'action', message: 'Manual reconnect triggered' });
      connectVNC();
    };

    onMounted(() => {
      addDebugEvent({ type: 'lifecycle', message: 'Component mounted' });
      connectVNC();
    });

    onBeforeUnmount(() => {
      addDebugEvent({ type: 'lifecycle', message: 'Component unmounting' });
      if (rfb.value) {
        rfb.value.disconnect();
      }
    });

    return { screen, debugInfo, reconnect, sendTestMessage };
  },
};
</script>

<style scoped>
.vnc-screen {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
}
.debug-panel {
  margin-top: 20px;
  padding: 10px;
  background-color: #1d1c1c;
  border: 1px solid #1d1d1c;
  max-height: 300px;
  overflow-y: auto;
  color: white;
}
.debug-controls {
  margin-bottom: 10px;
}
.debug-controls button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: rgb(59, 59, 59);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.debug-controls button:hover {
  background-color: #45a049;
}
</style>
