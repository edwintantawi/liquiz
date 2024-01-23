import { type ClassValue, clsx } from 'clsx';
import { Document } from 'langchain/document';
import { twMerge } from 'tailwind-merge';
import tailwindCssColors from 'tailwindcss/colors';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

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

export function tailwindCssColorToHex(tailwindCssColorClass: string) {
  const [, colorName, colorShade] = tailwindCssColorClass.split('-') as [
    string,
    keyof DefaultColors,
    keyof DefaultColors['amber'],
  ];

  const hexColor = tailwindCssColors[colorName][colorShade];
  return hexColor;
}

export function splitIntoParts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: [Document<Record<string, any>>, number][]
) {
  const NUMBER_OF_QUESTIONS_PER_PART = 10;

  return Array.from(
    {
      length: Math.ceil(data.length / NUMBER_OF_QUESTIONS_PER_PART),
    },
    (_, partIndex) => {
      return Array.from(
        { length: NUMBER_OF_QUESTIONS_PER_PART },
        (_, itemIndex) => {
          return data[partIndex * NUMBER_OF_QUESTIONS_PER_PART + itemIndex];
        }
      ).filter(Boolean);
    }
  );
}

export function scoreToPercentage({
  score,
  total,
}: {
  score: number;
  total: number;
}) {
  return Math.round((score / total) * 100);
}

export function formatRetrievalTime(durationInMs: number) {
  const min = Math.floor((durationInMs / 1000 / 60) << 0);
  const sec = Math.floor((durationInMs / 1000) % 60);

  return `${String(min).padStart(2, '0')} min ${String(sec).padStart(
    2,
    '0'
  )} sec`;
}

export function formatLongDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
