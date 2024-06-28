import React, {
  ReactNode,
  createContext,
  memo,
  useMemo,
  useReducer,
} from 'react';

import useCallbackRef from '~/hooks/useCallbackRef';

import getImage from '~/libs/getImage';

type GoogleRemoteAds = {
  Banner: boolean;
  Native_Onboarding: boolean;
  Reward: boolean;
  Inter_ads: boolean;
  Native_detail_history: boolean;
  Native_file_page: boolean;
  Native_history: boolean;
  Native_Language: boolean;
};
type languageSelect = {
  countyCode: string;
  name: string;
  image: string;
};
type languageSelectOutput = {
  countyCode: string;
  name: string;
  image: string;
};
type LanguageAvailable = languageSelect[];
type history = {
  title: string;
  description: string;
  time: string;
  id: string;
};
type History = history[];

type ActionProps = {
  countApp: number;
  languageSelect: languageSelect;
  languageSelectOutput: languageSelectOutput;
  adsMobState: GoogleRemoteAds;
  LanguageAvailable: LanguageAvailable;
  LanguageOther: LanguageAvailable;
  History: History;
  Favorite: History;
};

type State = {
  result: ActionProps;
  adsMobState: GoogleRemoteAds;
};

type Action =
  | {
      type: 'COUNT_APP';
      payload: {
        countApp: number;
      };
    }
  | {
      type: 'LANGUAGE_SELECT';
      payload: {
        languageSelect: languageSelect;
      };
    }
  | {
      type: 'LANGUAGE_SELECT_OUTPUT';
      payload: {
        languageSelectOutput: languageSelect;
      };
    }
  | {
      type: 'SET_STATE_ADSMOB';
      payload: {
        adsMobState: GoogleRemoteAds;
      };
    }
  | {
      type: 'SET_STATE_LANGUAGE_AVAILABLE';
      payload: {
        LanguageAvailable: LanguageAvailable;
      };
    }
  | {
      type: 'SET_STATE_LANGUAGE_OTHER';
      payload: {
        LanguageOther: LanguageAvailable;
      };
    }
  | {
      type: 'SET_STATE_HISTORY';
      payload: {
        History: History;
      };
    }
  | {
      type: 'SET_STATE_FAVORITE';
      payload: {
        Favorite: History;
      };
    };

type PreferenceActionsContextProps = {
  getActionStatePref: () => ActionProps;
  setActionCountApp?: (item: number) => void;
  setActionLanguageSelect?: (item: languageSelect) => void;
  setActionLanguageSelectOutPut?: (item: languageSelect) => void;
  setActionLanguageAvailable?: (item: LanguageAvailable) => void;
  setActionLanguageOther?: (item: LanguageAvailable) => void;
  setStateAdsMob?: (item: GoogleRemoteAds) => void;
  setActionHistory?: (item: History) => void;
  setActionFavorite?: (item: History) => void;
  //Base preference action
};

type PreferenceContextProps = State;

const initialState: ActionProps = {
  countApp: 0,
  languageSelect: {
    image: getImage('English'),
    name: 'English',
    countyCode: 'en',
  },
  languageSelectOutput: {
    image: getImage('English'),
    name: 'English',
    countyCode: 'en',
  },
  LanguageAvailable: [
    {
      image: getImage('Vietnam'),
      countyCode: 'vi',
      name: 'Vietnam',
    },
    {
      image: getImage('English'),
      countyCode: 'en',
      name: 'English',
    },
    {
      image: getImage('China'),
      countyCode: 'zh-CN',
      name: 'China',
    },
  ],
  adsMobState: {
    Banner: false,
    Native_Onboarding: false,
    Reward: false,
    Inter_ads: false,
    Native_detail_history: false,
    Native_file_page: false,
    Native_history: false,
    Native_Language: false,
  },
  History: [],
  Favorite: [],
};

const reducer = (state: State, action: Action): State => {
  const nextState = { ...state };

  switch (action.type) {
    case 'COUNT_APP':
      nextState.result.countApp = action.payload.countApp;
      break;
    case 'LANGUAGE_SELECT':
      nextState.result.languageSelect = action.payload.languageSelect;
      break;
    case 'LANGUAGE_SELECT_OUTPUT':
      nextState.result.languageSelectOutput =
        action.payload.languageSelectOutput;
      break;
    case 'SET_STATE_LANGUAGE_AVAILABLE':
      nextState.result.LanguageAvailable = action.payload.LanguageAvailable;
      break;
    case 'SET_STATE_LANGUAGE_OTHER':
      nextState.result.LanguageOther = action.payload.LanguageOther;
      break;
    case 'SET_STATE_ADSMOB':
      nextState.result.adsMobState = action.payload.adsMobState;
      break;
    case 'SET_STATE_HISTORY':
      nextState.result.History = action.payload.History;
      break;
    case 'SET_STATE_FAVORITE':
      nextState.result.Favorite = action.payload.Favorite;
      break;
  }

  return nextState;
};

export const PreferenceActionsContext =
  createContext<PreferenceActionsContextProps>({
    getActionStatePref: () => initialState,
  });

export const PreferenceContext = createContext<PreferenceContextProps>({
  result: initialState,
});

const ActionPreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [state, setState] = useReducer(reducer, { result: initialState });

  const getActionStatePref = useCallbackRef(() => state.result);

  const setActionCountApp = useCallbackRef((dataPlayer: number) => {
    setState({
      type: 'COUNT_APP',
      payload: {
        countApp: dataPlayer,
      },
    });
  });
  const setActionLanguageSelect = useCallbackRef(
    (languageSelect: languageSelect) => {
      setState({
        type: 'LANGUAGE_SELECT',
        payload: {
          languageSelect: languageSelect,
        },
      });
    },
  );
  const setActionLanguageAvailable = useCallbackRef(
    (LanguageAvailable: LanguageAvailable) => {
      setState({
        type: 'SET_STATE_LANGUAGE_AVAILABLE',
        payload: {
          LanguageAvailable: LanguageAvailable,
        },
      });
    },
  );
  const setActionLanguageOther = useCallbackRef(
    (LanguageOther: LanguageAvailable) => {
      setState({
        type: 'SET_STATE_LANGUAGE_OTHER',
        payload: {
          LanguageOther: LanguageOther,
        },
      });
    },
  );
  const setActionHistory = useCallbackRef((History: History) => {
    setState({
      type: 'SET_STATE_HISTORY',
      payload: {
        History: History,
      },
    });
  });
  const setActionFavorite = useCallbackRef((Favorite: History) => {
    setState({
      type: 'SET_STATE_FAVORITE',
      payload: {
        Favorite: Favorite,
      },
    });
  });
  const setActionLanguageSelectOutPut = useCallbackRef(
    (languageSelectOutPut: languageSelectOutput) => {
      setState({
        type: 'LANGUAGE_SELECT_OUTPUT',
        payload: {
          languageSelectOutput: languageSelectOutPut,
        },
      });
    },
  );
  const setStateAdsMob = useCallbackRef((item: object) => {
    setState({
      type: 'SET_STATE_ADSMOB',
      payload: {
        adsMobState: item,
      },
    });
  });
  const actionValues = useMemo(
    () => ({
      getActionStatePref,
      setActionCountApp,
      setActionLanguageSelect,
      setActionLanguageSelectOutPut,
      setStateAdsMob,
      setActionLanguageAvailable,
      setActionLanguageOther,
      setActionHistory,
      setActionFavorite,
    }),
    [],
  );

  return (
    <PreferenceActionsContext.Provider value={actionValues}>
      <PreferenceContext.Provider value={state}>
        {children}
      </PreferenceContext.Provider>
    </PreferenceActionsContext.Provider>
  );
};

export default memo(ActionPreferenceProvider);
