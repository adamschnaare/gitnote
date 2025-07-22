// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgS6GfRiPtzRERQz2VXDH2QbydYngH8-4",
  authDomain: "gitnote-24610.firebaseapp.com",
  projectId: "gitnote-24610",
  storageBucket: "gitnote-24610.firebasestorage.app",
  messagingSenderId: "161886478803",
  appId: "1:161886478803:web:8ba05878066cd35e0e0f26",
  measurementId: "G-PFH1F7QM39",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();

githubProvider.addScope("repo"); // Full control of private repositories
githubProvider.addScope("read:user"); // Read all user profile data
githubProvider.addScope("user:email"); // Access user email addresses
githubProvider.addScope("user:follow"); // Follow and unfollow users
githubProvider.addScope("gist"); // Create gists
githubProvider.addScope("notifications"); // Access notifications
githubProvider.addScope("write:discussion"); // Manage discussions
githubProvider.addScope("read:discussion"); // Read discussions
githubProvider.addScope("admin:org"); // Full control of orgs and teams
githubProvider.addScope("read:org"); // Read org and team membership
githubProvider.addScope("write:org"); // Manage org and team membership
githubProvider.addScope("admin:public_key"); // Full control of user public keys
githubProvider.addScope("write:public_key"); // Write user public keys
githubProvider.addScope("read:public_key"); // Read user public keys
githubProvider.addScope("admin:repo_hook"); // Full control of repository hooks
githubProvider.addScope("write:repo_hook"); // Write repository hooks
githubProvider.addScope("read:repo_hook"); // Read repository hooks
githubProvider.addScope("admin:org_hook"); // Full control of org hooks
githubProvider.addScope("delete_repo"); // Delete repositories
githubProvider.addScope("workflow"); // Update GitHub Actions workflows
githubProvider.addScope("write:packages"); // Upload packages to GitHub Package Registry
githubProvider.addScope("read:packages"); // Download packages from GitHub Package Registry
githubProvider.addScope("delete:packages"); // Delete packages from GitHub Package Registry
githubProvider.addScope("admin:gpg_key"); // Full control of user GPG keys
githubProvider.addScope("write:gpg_key"); // Write user GPG keys
githubProvider.addScope("read:gpg_key"); // Read user GPG keys

export function signInWithGitHub() {
  return signInWithPopup(auth, githubProvider);
}

export function signOutUser() {
  return signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
