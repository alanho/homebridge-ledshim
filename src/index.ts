import {
  API,
  // CharacteristicEventTypes,
  // CharacteristicGetCallback,
  // CharacteristicSetCallback,
  // CharacteristicValue,
  HAP,
  IndependentPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge';


import { PLATFORM_NAME } from './settings';
import ledshim from 'ledshim';

let hap: HAP;
let Accessory: typeof PlatformAccessory;

export = (api: API) => {
  hap = api.hap;
  Accessory = api.platformAccessory;

  api.registerPlatform(PLATFORM_NAME, LEDShimPlatform);
};

class LEDShimPlatform implements IndependentPlatformPlugin {
  private intervalID?: NodeJS.Timeout;

  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log = log;
    this.api = api;

    this.intervalID = undefined;

    log('Finished initializing platform:', this.config.name);

    this.api.on('didFinishLaunching', () => {
      if (this.intervalID) {
        clearInterval(this.intervalID);
      }


      this.intervalID = setInterval(() => {
        this.updateDisplay();
      }, 500);
    });
  }

  updateDisplay(): void {
    for (let i = 0; i < 28; i++) {
      ledshim.setPixel(
        i,
        Math.floor((Math.random() * 255)),
        Math.floor((Math.random() * 255)),
        Math.floor((Math.random() * 255)),
        0.5);  // brightness
    }
    ledshim.show();
  }
}