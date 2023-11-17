import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'deleteArt' : ActorMethod<[string], undefined>,
  'getArt' : ActorMethod<[string], [] | [string]>,
  'getKeyValuePair' : ActorMethod<[], string>,
  'getKeys' : ActorMethod<[], string>,
  'getSize' : ActorMethod<[], bigint>,
  'getValue' : ActorMethod<[], string>,
  'setArt' : ActorMethod<[string, string], bigint>,
}
