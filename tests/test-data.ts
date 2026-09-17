/**
 * Test data for Sauce Demo. These credentials are published on the login page
 * of the demo site itself, so they are safe to keep in the repo.
 */
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const INVALID_CREDENTIALS = {
  username: 'standard_user',
  password: 'wrong_password',
} as const;

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

/** Where the reusable signed-in session is stored (git-ignored). */
export const AUTH_FILE = '.auth/user.json';
