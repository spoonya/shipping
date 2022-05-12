import 'core-js/es/promise';
import 'regenerator-runtime/runtime';

import { toggleDropdown } from './dropdown';
import { controlTabs, signIn } from './tabs';

signIn();
controlTabs();
toggleDropdown();
