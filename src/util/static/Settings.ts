
export type ListenerCallback = (value: string | boolean | number) => void;

export default abstract class Settings {
  private static defaultSettings: Record<string, any>;
  private static listeners: Record<string, ListenerCallback[] | undefined> = {};

  public static init (defaultSettings: Record<string, any>) {
    Settings.defaultSettings = {
      ...defaultSettings,
      wereUsed: true
    };

    Settings.setDefaultIfUnset();
  }

  public static setDefault() {
    if (!Settings.defaultSettings) return;
    
    Object.entries(Settings.defaultSettings).forEach(([key, value]) => 
    localStorage.setItem(key, value.toString()));
  }

  private static setDefaultIfUnset () {
    if (Settings.get("wereUsed") !== true) {
      Settings.setDefault();
    }
  }

  public static set(setting: string, value: string) {
    localStorage.setItem(setting, value);
    Settings.listeners[setting]
      && Settings.listeners[setting].length
      && Settings.listeners[setting].forEach(listener => listener(Settings.get(setting)));
  }

  public static get(setting: string): string | boolean | number {
    const value = localStorage.getItem(setting)!;

    if (value === "true" || value === "false")
      return value === "true";
    else if (!Number.isNaN(parseFloat(value)))
      return parseFloat(value);
    else return value;
  }

  public static addListener(setting: string, callback: ListenerCallback) {
    if (!this.listeners[setting])
      this.listeners[setting] = [];
    this.listeners[setting].push(callback);
  }
}