const criteria = (text: string) => (text.match(/[0-9A-Za-z]/g)?.length ?? 0) > 4;

/** Prompts for data until it satisfies given criteria */
export default function promptFilled(
  message: string,
  check: (message: string) => boolean = criteria,
  checkMessage: string = 'Type at least 4 characters'
): string | null {
  let input = undefined;

  do {
    input = prompt(`${message}\n💡 ${checkMessage}`);
    if (input === null) return null;
  } while (!check(input));

  return input;
}
