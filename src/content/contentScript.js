import { ReviewObserver } from './reviewObserver.js';
import { MessageTypes } from '../utils/constants.js';

const reviewObserver = new ReviewObserver();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case MessageTypes.START_ANALYSIS:
      reviewObserver.start();
      break;
    case MessageTypes.STOP_ANALYSIS:
      reviewObserver.stop();
      break;
  }
});