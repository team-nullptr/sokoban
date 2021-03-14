// | ---------------------------------------- |
// | Title                              Badge |
// | Description            [action] [action] |
// | ---------------------------------------- |

/** Represents list item for ListLayer */
export default interface ListItem {
  title: string;
  description?: string;

  badge?: string;
  actions?: string[];

  /** Called when action button is clicked */
  onactionclick?: (index: number) => void;
}
