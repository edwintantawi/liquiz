'use client';

import * as React from 'react';

import { Datum, Point, ResponsiveLine } from '@nivo/line';

import { Skeleton } from '~/components/ui/skeleton';
import { History } from '~/lib/types/history';
import { cn, tailwindCssColorToHex } from '~/lib/utils';

interface HistoryChartProps {
  histories: History[];
  color: string;
}

export function HistoryChart({ histories, color }: HistoryChartProps) {
  const data = histories.map((history) => ({
    x: history.createdAt,
    y: history.score,
  }));

  const chartColor = tailwindCssColorToHex(color);

  const isChartAvailable = data.length > 2;

  return (
    <div className="aspect-video w-full">
      {isChartAvailable ? (
        <Chart color={chartColor} data={data} />
      ) : (
        <div className="h-full pb-3">
          <Skeleton className="grid h-full w-full place-items-center border border-dashed p-8">
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

function Chart({ color, data }: { color: string; data: Datum[] }) {
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
      yFormat={(value) =>
        value === lowScore || value === highScore ? `${value.toString()}%` : ''
      }
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
      xFormat={(value) =>
        new Date(value).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      }
      tooltip={({ point }) => <ChartTooltip point={point} data={data} />}
    />
  );
}

function ChartTooltip({ point, data }: { point: Point; data: Datum[] }) {
  const formatedDate = new Date(point.data.x).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'absolute top-2 w-48 rounded-sm border bg-white px-2 py-1 text-xs',
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
        <span className="font-semibold">Score:</span> {point.data.y.toString()}%
      </p>
    </div>
  );
}
