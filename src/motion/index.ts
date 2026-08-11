import { initMotionSwitch } from './prefs';
import { initCurtain } from './curtain';
import { initCursor } from './cursor';
import { initMagnetic } from './magnetic';
import { initTilt } from './tilt';
import { initParticles, initAurora } from './backdrop';
import { initHeroText, initTypewriter, initCounters, splitOnView } from './text';
import { initParallax, initRail, initGallery, initReadout, initInView } from './scroll';
import { initMasthead, initNavIndicator, initMenuStagger, initJump } from './nav';
import { initMarquee, initCloud, initLevels, initStaggerIndices } from './content';
import { initCopy, initSheet, initSendTick } from './micro';

/**
 * Starts the motion layer.
 *
 * Order matters in two places: the switch has to be read before anything
 * asks whether it may run, and the curtain has to be raised before the
 * hero's entrance is triggered, or the entrance plays behind it.
 *
 * Everything below is optional. Each piece looks for its own markup and
 * returns quietly when it is not there, so removing a section from the page
 * never breaks the script.
 */
export function initMotion(): void {
  initMotionSwitch();
  initCurtain();

  // backdrop
  initParticles();
  initAurora();

  // masthead
  initMasthead();
  initNavIndicator();
  initMenuStagger();
  initJump();
  initReadout();

  // type
  initHeroText();
  initTypewriter();
  initCounters();

  document.querySelectorAll<HTMLElement>('[data-split]').forEach(el => {
    splitOnView(el, el.dataset.split === 'char' ? 'char' : 'word');
  });

  // scroll
  initParallax();
  initRail();
  initGallery();
  initInView('.flow li, .record, .shot');

  // pointer
  initCursor();
  initMagnetic();
  initTilt();

  // arranged content
  initMarquee();
  initCloud();
  initLevels();
  initStaggerIndices();

  // the small ones
  initCopy();
  initSheet();
  initSendTick();
}
