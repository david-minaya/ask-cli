import * as v1 from './migrations/1-settings-1.1.0.ts';
import * as v2 from './migrations/2-add-providers-1.2.0.ts';

await v1.run();
await v2.run();
