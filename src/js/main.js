import 'core-js/es/promise';
import 'regenerator-runtime/runtime';

import { toggleDropdown } from './dropdown';
import { toggleTabs, signIn } from './tabs';

signIn();
toggleTabs();
toggleDropdown();
