// Simulated WebSocket service for real-time memory updates
export interface MemoryEvent {
  id: string;
  type: 'store' | 'retrieve' | 'clear' | 'session_start' | 'session_end';
  userId: string;
  sessionId?: string;
  content?: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

class MemoryStreamService {
  private listeners: Set<(event: MemoryEvent) => void> = new Set();
  private intervalId: number | null = null;
  private isRunning = false;

  private userIds = ['user_12345', 'user_67890', 'user_54321', 'user_98765', 'user_11111', 'user_22222'];
  private sessionIds = ['sess_abc', 'sess_xyz', 'sess_def', 'sess_ghi', 'sess_jkl'];
  private contentSamples = [
    'User preferences updated',
    'API integration completed',
    'Search query executed',
    'Authentication successful',
    'Data export requested',
    'Settings modified',
    'Profile picture changed',
    'Email notification sent',
    'Password reset initiated',
    'Two-factor auth enabled',
    'Theme preference changed to dark mode',
    'Language set to English',
    'Timezone updated',
    'Payment method added',
    'Subscription upgraded',
  ];

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('[MemoryStream] Starting real-time memory stream...');
    
    // Emit events at random intervals between 2-8 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 6000 + 2000; // 2-8 seconds
      this.intervalId = window.setTimeout(() => {
        if (this.isRunning) {
          this.emitRandomEvent();
          scheduleNext();
        }
      }, delay);
    };
    
    scheduleNext();
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    console.log('[MemoryStream] Stopped real-time memory stream');
  }

  subscribe(callback: (event: MemoryEvent) => void) {
    this.listeners.add(callback);
    console.log(`[MemoryStream] Subscriber added. Total: ${this.listeners.size}`);
    
    return () => {
      this.listeners.delete(callback);
      console.log(`[MemoryStream] Subscriber removed. Total: ${this.listeners.size}`);
    };
  }

  private emitRandomEvent() {
    const types: MemoryEvent['type'][] = ['store', 'retrieve', 'session_start'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const event: MemoryEvent = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId: this.userIds[Math.floor(Math.random() * this.userIds.length)],
      sessionId: this.sessionIds[Math.floor(Math.random() * this.sessionIds.length)],
      content: this.contentSamples[Math.floor(Math.random() * this.contentSamples.length)],
      timestamp: new Date(),
      status: Math.random() > 0.9 ? 'warning' : 'success',
    };

    console.log('[MemoryStream] Emitting event:', event.type, event.id);
    this.listeners.forEach(callback => callback(event));
  }

  // Manual emit for testing
  emit(event: MemoryEvent) {
    console.log('[MemoryStream] Manual emit:', event.type, event.id);
    this.listeners.forEach(callback => callback(event));
  }
}

// Singleton instance
export const memoryStream = new MemoryStreamService();
