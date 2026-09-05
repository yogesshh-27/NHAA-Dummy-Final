/**
 * authService.ts — copied from github.com/yogesshh-27/FireAuth/src/services/authService.ts
 * All Firebase auth operations in one place.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from '../lib/firebase'

export class AuthError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

// Map Firebase error codes → friendly messages
function mapFirebaseError(err: unknown): AuthError {
  const code = (err as { code?: string })?.code || ''
  const map: Record<string, string> = {
    'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups for this site and try again.',
    'auth/operation-not-allowed': 'Google Sign-In is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/unauthorized-domain': 'This domain is not in your Firebase Authorized Domains list. Add localhost to Firebase Console → Authentication → Settings → Authorized Domains.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/user-not-found': 'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
    'auth/internal-error': 'An internal error occurred. Please try again.',
  }
  return new AuthError(code, map[code] || `Authentication failed: ${code}`)
}

/**
 * Sign in with Google popup (real signInWithPopup)
 */
export async function signInWithGoogle(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new AuthError('NOT_CONFIGURED', 'Firebase is not configured. Contact the administrator.')
  }
  try {
    const cred = await signInWithPopup(getFirebaseAuth(), googleProvider)
    return cred.user
  } catch (err: unknown) {
    throw mapFirebaseError(err)
  }
}

/**
 * Sign in with Email + Password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new AuthError('NOT_CONFIGURED', 'Firebase is not configured. Contact the administrator.')
  }
  try {
    const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    return cred.user
  } catch (err: unknown) {
    throw mapFirebaseError(err)
  }
}

/**
 * Register a new account with Email + Password + Display Name
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new AuthError('NOT_CONFIGURED', 'Firebase is not configured. Contact the administrator.')
  }
  try {
    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred.user
  } catch (err: unknown) {
    throw mapFirebaseError(err)
  }
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new AuthError('NOT_CONFIGURED', 'Firebase is not configured. Contact the administrator.')
  }
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email)
  } catch (err: unknown) {
    throw mapFirebaseError(err)
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await fbSignOut(getFirebaseAuth())
  } catch {
    // silently ignore
  }
}

/**
 * Subscribe to auth state changes (onAuthStateChanged)
 * Returns the unsubscribe function.
 */
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured()) return () => {}
  try {
    return onAuthStateChanged(getFirebaseAuth(), callback)
  } catch {
    return () => {}
  }
}
