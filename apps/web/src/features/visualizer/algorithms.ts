import { VisualStepEvent } from './engine';

export function generateBinarySearchEvents(array: number[], target: number): VisualStepEvent[] {
  const events: VisualStepEvent[] = [];
  let left = 0;
  let right = array.length - 1;
  let step = 1;

  events.push({
    step: step++,
    type: 'READ',
    targets: [],
    stateSnapshot: { array: [...array], left, right, mid: -1 },
    variables: { left, right, target, found: false },
    codeLine: 1,
    description: `Initialize binary search bounds: left = 0, right = ${right}, searching for target = ${target}.`,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    events.push({
      step: step++,
      type: 'MOVE_POINTER',
      targets: [mid],
      stateSnapshot: { array: [...array], left, right, mid },
      variables: { left, right, mid, 'array[mid]': array[mid], target },
      codeLine: 3,
      description: `Calculate mid pointer: mid = Math.floor((${left} + ${right}) / 2) = ${mid}. Checking array[${mid}] = ${array[mid]}.`,
    });

    events.push({
      step: step++,
      type: 'COMPARE',
      targets: [mid],
      stateSnapshot: { array: [...array], left, right, mid },
      variables: { left, right, mid, 'array[mid]': array[mid], target },
      codeLine: 4,
      description: `Compare array[${mid}] (${array[mid]}) with target (${target}).`,
    });

    if (array[mid] === target) {
      events.push({
        step: step++,
        type: 'VISIT',
        targets: [mid],
        stateSnapshot: { array: [...array], left, right, mid, foundIndex: mid },
        variables: { left, right, mid, target, found: true },
        codeLine: 5,
        description: `Target ${target} found at index ${mid}! Returning index ${mid}.`,
      });
      return events;
    }

    if (array[mid] < target) {
      left = mid + 1;
      events.push({
        step: step++,
        type: 'MOVE_POINTER',
        targets: [mid],
        stateSnapshot: { array: [...array], left, right, mid },
        variables: { left, right, mid, target },
        codeLine: 7,
        description: `array[${mid}] (${array[mid]}) < target (${target}). Shift left pointer to mid + 1 = ${left}.`,
      });
    } else {
      right = mid - 1;
      events.push({
        step: step++,
        type: 'MOVE_POINTER',
        targets: [mid],
        stateSnapshot: { array: [...array], left, right, mid },
        variables: { left, right, mid, target },
        codeLine: 9,
        description: `array[${mid}] (${array[mid]}) > target (${target}). Shift right pointer to mid - 1 = ${right}.`,
      });
    }
  }

  events.push({
    step: step++,
    type: 'READ',
    targets: [],
    stateSnapshot: { array: [...array], left, right, mid: -1 },
    variables: { left, right, target, found: false },
    codeLine: 11,
    description: `Target ${target} not present in array. Search space exhausted.`,
  });

  return events;
}
