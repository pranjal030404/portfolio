import './style.css';
import { initTheme, initNav, initScrollSpy, initReveal, initMessageForm } from './ui';
import { initLab } from './lab';

/**
 * Progressive enhancement only. Every piece of content is already in
 * index.html — nothing here renders the page, it only makes it interactive.
 */
initTheme();
initNav();
initScrollSpy();
initReveal();
initMessageForm();
initLab();
