'use client';

import * as React from 'react';

import { Datum, Point, ResponsiveLine } from '@nivo/line';

import { Skeleton } from '~/components/ui/skeleton';
import { History } from '~/lib/types/history';
import {
  cn,
  formatLongDate,
  scoreToPercentage,
  tailwindCssColorToHex,
} from '~/lib/utils';

interface HistoryChartProps {
  histories: History[];
  color: string;
  numberOfQuestions: number;
}

export function HistoryChart({
  histories,
  color,
  numberOfQuestions,
}: HistoryChartProps) {
  const data = histories.map((history) => ({
    x: history.createdAt,
    y: history.score,
    scoreInPercentage: history.scoreInPercentage,
  }));

  const chartColor = tailwindCssColorToHex(color);

  const isChartAvailable = data.length >= 2;

  return (
    <div className="aspect-video w-full">
      {isChartAvailable ? (
        <Chart
          color={chartColor}
          data={data}
          numberOfQuestions={numberOfQuestions}
        />
      ) : (
        <div className="h-full pb-3">
          <Skeleton className="grid size-full place-items-center border border-dashed p-8">
            <p className="text-balance text-center text-xs text-muted-foreground">
              Cannot display the graph because the data is not sufficient, to
              display the graph requires 2 or more histories
            </p>
          </Skeleton>
        </div>
      )}
    </div>
  );
}

function Chart({
  color,
  data,
  numberOfQuestions,
}: {
  color: string;
  data: Datum[];
  numberOfQuestions: number;
}) {
  const listOfScore = data.map((value) => Number(value.y));
  const lowScore = Math.min(...listOfScore);
  const highScore = Math.max(...listOfScore);

  return (
    <ResponsiveLine
      animate
      enableArea
      isInteractive
      useMesh
      enablePointLabel
      enableGridX={false}
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      yFormat={(value) => {
        const scoreInPercentage = scoreToPercentage({
          score: Number(value),
          total: numberOfQuestions,
        });
        const isLowestOrHighestScore =
          value === lowScore || value === highScore;
        return isLowestOrHighestScore ? `${scoreInPercentage}%` : '';
      }}
      curve="cardinal"
      colors={[color]}
      data={[{ id: 'History', data }]}
      defs={[
        {
          colors: [
            { color: 'inherit', offset: 0 },
            { color: 'inherit', offset: 100, opacity: 0 },
          ],
          id: 'gradientA',
          type: 'linearGradient',
        },
      ]}
      fill={[{ id: 'gradientA', match: '*' }]}
      margin={{ bottom: 30, left: 16, right: 16, top: 30 }}
      xFormat={(value) => formatLongDate(value)}
      tooltip={({ point }) => (
        <ChartTooltip
          point={point}
          data={data}
          numberOfQuestions={numberOfQuestions}
        />
      )}
    />
  );
}

function ChartTooltip({
  point,
  data,
  numberOfQuestions,
}: {
  point: Point;
  data: Datum[];
  numberOfQuestions: number;
}) {
  const pointData = data.find((d) => d.x === point.data.x);

  if (!pointData) return null;

  const formatedDate = formatLongDate(pointData.x!);

  return (
    <div
      className={cn(
        'absolute top-2 w-52 rounded-sm border bg-white px-2 py-1 text-xs',
        {
          '-left-4': point.index < data.length / 2,
          '-right-4': point.index >= data.length / 2,
        }
      )}
    >
      <p>
        <span className="font-semibold">Date:</span> {formatedDate}
      </p>
      <p>
        <span className="font-semibold">Score:</span>{' '}
        {pointData.scoreInPercentage}%
      </p>
      <p className="text-muted-foreground">
        {Number(pointData.y)} of {numberOfQuestions} questions correct
      </p>
    </div>
  );
}
