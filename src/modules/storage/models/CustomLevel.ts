import Level from '../../../models/Level';
import { IdentifiableItem } from '../Storage';

export type CustomLevel = Level & IdentifiableItem & { name: string };
