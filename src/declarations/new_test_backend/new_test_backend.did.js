export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'deleteArt' : IDL.Func([IDL.Text], [], []),
    'getArt' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getKeyValuePair' : IDL.Func([], [IDL.Text], []),
    'getKeys' : IDL.Func([], [IDL.Text], []),
    'getSize' : IDL.Func([], [IDL.Nat], []),
    'getValue' : IDL.Func([], [IDL.Text], []),
    'setArt' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
