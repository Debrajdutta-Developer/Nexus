export async function dispatchDeviceCommand(text: string): Promise<boolean> {
  try {
    const response = await fetch('/api/assistant/command', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }), signal: AbortSignal.timeout(2500)
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data?.handled === true;
  } catch {
    return false;
  }
}
