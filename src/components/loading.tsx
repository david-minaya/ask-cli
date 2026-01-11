import { Text } from 'ink';
import Spinner from 'ink-spinner';
import spinners, { SpinnerName } from 'cli-spinners';
import { useMemo } from 'react';

const colors = ['gray', 'red', 'green', 'yellow', 'blue', 'cyan', 'magenta', 'white'];
const types = Object.keys(spinners) as SpinnerName[];

export function Loading() {

  const color = useMemo(() => colors[Math.floor(Math.random() * (colors.length - 1))], []);
  const type = useMemo(() => types[Math.floor(Math.random() * (types.length - 1))], []);

  return (
    <Text bold color={color}>
      <Spinner type={type}/>
    </Text>
  );
}
