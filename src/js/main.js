import 'core-js/es/promise';
import 'regenerator-runtime/runtime';

import { toggleDropdown } from './dropdown';
import { controlForm } from './form-tabs';
import { signIn } from './sign-in';

signIn();
controlForm();
toggleDropdown();
