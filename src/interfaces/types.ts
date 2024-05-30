// Interface for the m_types model
export interface ITypes {
    id: bigint;
    name: string;
    del_flg: number;
    created_at?: Date | null;
    updated_at?: Date | null;
    m_words?: IWords[];
  }
  
  // Interface for the m_words model
 export interface IWords {
    id: bigint;
    en_word: string;
    jp_word: string;
    fu_word: string;
    search_count: number;
    type_id: bigint;
    examples: string;
    del_flg: number;
    created_at?: Date | null;
    updated_at?: Date | null;
    m_types?: ITypes;
  }

  export interface ICategory {
    id: string;
    name: string;
  }
  
  export interface IMainPlaceWord {
    id: bigint;
    en_word: string;
    jp_word: string;
    m_categories: {
      name: string;
    } | null;
    m_types: {
      name: string;
    };
  }
  
  export interface ISideBarWord {
    id: bigint;
    en_word: string;
    jp_word: string;
    fu_word :string;
  }
  
  