import { Injectable } from '@angular/core';
import { Direction, KeyboardCode } from './app.model';

@Injectable({
  providedIn: 'root',
})
export class TouchEventHandlerService {
  private defaultTouch = { x: 0, y: 0, time: 0 };

  public getSwipeDirection(event: TouchEvent): KeyboardCode | null {
    let touch = event.touches[0] || event.changedTouches[0];

    // check the events
    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulte a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            return KeyboardCode.RIGHT;
          } else {
            return KeyboardCode.LEFT;
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            return KeyboardCode.DOWN;
          } else {
            return KeyboardCode.UP;
          }
        }
      }
    }
    return null;
  }
}
