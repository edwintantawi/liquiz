import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { colors } from '~/lib/color';

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

export function getRandomColor(seed: string) {
  function hashString(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  function stringToRandomNumber(str: string) {
    const hash = hashString(str);
    const normalized = hash / 0xffffffff; // Normalize to [0, 1]
    return normalized;
  }

  const randomNumber = stringToRandomNumber(seed);

  const index = Math.floor(randomNumber * colors.length);
  return colors[index];
}
