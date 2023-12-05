import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(durationInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationInMs));
}

export function getInitialName(name: string) {
  const chunks = name.split(' ');
  const firstName = chunks[0].charAt(0).toUpperCase();
  const lastName = chunks[chunks.length - 1].charAt(0).toUpperCase();
  return firstName + lastName;
}
