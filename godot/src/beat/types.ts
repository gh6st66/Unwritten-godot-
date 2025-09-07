/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Beat {
  id: string;
  trigger: {
    verbs: string[];
    tags: string[];
  };
  weight: number;
  cooldown: {
    steps: number;
  };
  context_tags: string[];
  compose: {
    requires: string[];
    grants: string[];
    costs: {
      resource: string;
      amount: number;
    }[];
    effects: string[];
    echoTemplateId: string;
  };
}
