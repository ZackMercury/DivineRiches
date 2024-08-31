
export default abstract class System {
  public static checkMobile () {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
  }

  public static sleep (ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  } 
}