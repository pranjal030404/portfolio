import './style.css';
import './animations.css';
import { initTheme, initNav, initScrollSpy, initScrollProgress, initReveal, initMessageForm } from './ui';
import { initLab } from './lab';
import { initMotion } from './motion';

/**
 * Progressive enhancement only. Every piece of content is already in
 * index.html — nothing here renders the page, it only makes it interactive.
 *
 * The motion layer goes on top of that and is optional in the same way: with
 * it removed the page still works, it just stops moving.
 */
initTheme();
initNav();
initScrollSpy();
initScrollProgress();
initMotion();
initReveal();
initMessageForm();
initLab();
