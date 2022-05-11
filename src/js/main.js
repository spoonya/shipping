import 'core-js/es/promise';
import 'regenerator-runtime/runtime';

import { toggleDropdown } from './dropdown';
import { controlTabs } from './tabs';
import { signIn } from './sign-in';

signIn();
controlTabs();
toggleDropdown();
