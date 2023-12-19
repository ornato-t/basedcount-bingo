import { DateTime, Duration } from 'luxon';

export function getRelativeDate(roundStart: Date) {
    const roundEnd = DateTime.fromJSDate(new Date(roundStart)).plus({ days: 7 });
    const difference = roundEnd.diff(DateTime.local(), ['seconds', 'minutes', 'hours', 'days']);

    return difference;
}

export function isFinished(dateDiff: Duration) {
    const rounded = dateDiff.as('seconds');
    const finished = rounded < 1;

    return finished ?? false;
}