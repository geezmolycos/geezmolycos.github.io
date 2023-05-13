
import re
from itertools import chain

class TokiPonaReplacer:

    def __init__(
            self, word_dictionary, punct_dictionary, phonetic_set=None,
            **kwargs):
        self.word_dictionary = word_dictionary
        self.punct_dictionary = punct_dictionary
        self.phonetic_set = phonetic_set or set()
        for attr in (
                "phonetic_set_handling",
                "unofficial_words_handling",
                "unrecognized_words_handling",
                ):
            setattr(self, attr, kwargs.pop(attr, "none"))
        for attr in (
                "do_replace_words",
                "do_replace_puncts",
                "do_remove_spaces",
                ):
            setattr(self, attr, kwargs.pop(attr, True))

    @staticmethod
    def word_syllable_separator(word):
        return re.findall(r"[ptksmnlwj]?[aiueo](?:n(?![aiueo]))?", word)

    # bopomofo transliteral

    bopomofo_consonants = {k: v for k, v in (l.split(":") for l in
        ":,p:ㄆ,t:ㄊ,k:ㄎ,s:ㄙ,m:ㄇ,n:ㄋ,l:ㄌ,w:ㄨ,j:ㄧ".split(","))}
    bopomofo_vowels = {k: v for k, v in (l.split(":") for l in
        "a:ㄚ,i:ㄧ,u:ㄨ,e:ㄝ,o:ㄛ,an:ㄢ,in:ㄧㄣ,un:ㄨㄣ,en:ㄣ,on:ㄛㄣ".split(","))}

    @classmethod
    def syllable_to_bopomofo(cls, syllable):
        consonant = syllable[0] if syllable[0] in "ptksmnlwj" else ""
        vowel = syllable[len(consonant):]
        return cls.bopomofo_consonants[consonant] + cls.bopomofo_vowels[vowel]

    @classmethod
    def word_to_bopomofo(cls, word):
        return "".join(
            cls.syllable_to_bopomofo(syllable)
                for syllable in cls.word_syllable_separator(word))

    # kana transliteral

    kana_consonants = {k: i for i, k in enumerate(chain(("",), "ptksmnlwj"))}
    kana_vowels = {k: i for i, k in enumerate("aiueo")}

    hiraganas = [ch.strip() for ch in """
    あ,い,う,え,お,
    は,ひ,ふ,へ,ほ,
    た,ち,つ,て,と,
    か,き,く,け,こ,
    さ,し,す,せ,そ,
    ま,み,む,め,も,
    な,に,ぬ,ね,の,
    ら,り,る,れ,ろ,
    わ,うぃ,うぅ,うぇ,を,
    や,いぃ,ゆ,いぇ,よ
    """.split(",")]

    hiragana_n = "ん"

    katakanas = [ch.strip() for ch in """
    ア,イ,ウ,エ,オ,
    ハ,ヒ,フ,ヘ,ホ,
    タ,チ,ツ,テ,ト,
    カ,キ,ク,ケ,コ,
    サ,シ,ス,セ,ソ,
    マ,ミ,ム,メ,モ,
    ナ,ニ,ヌ,ネ,ノ,
    ラ,リ,ル,レ,ロ,
    ワ,ウィ,ウゥ,ウェ,ヲ,
    ヤ,イィ,ユ,イェ,ヨ
    """.split(",")]

    katakana_n = "ン"

    @classmethod
    def syllable_to_kana(cls, syllable, katakana=False):
        consonant = syllable[0] if syllable[0] in "ptksmnlwj" else ""
        vowel = syllable[len(consonant):][0]
        has_n = syllable[-1] == "n"
        kanas = cls.katakanas if katakana else cls.hiraganas
        kana_n = cls.katakana_n if katakana else cls.hiragana_n
        return kanas[
            cls.kana_consonants[consonant]*5
            + cls.kana_vowels[vowel]
            ] + (kana_n if has_n else "")

    @classmethod
    def word_to_kana(cls, word, katakana=False):
        return "".join(
            cls.syllable_to_kana(syllable, katakana=katakana)
                for syllable in cls.word_syllable_separator(word))

    # replacers

    def dictionary_replacer(self, word):
        return self.word_dictionary.get(word, word)

    phonetic_handling_functions = {
        "none": lambda self, word: word,
        "bopomofo": lambda self, word: self.word_to_bopomofo(word.lower()),
        "hiragana": lambda self, word: self.word_to_kana(word.lower(), katakana=False),
        "katakana": lambda self, word: self.word_to_kana(word.lower(), katakana=True)
    }

    def phonetic_replacer(self, word, handling):
        try:
            return self.phonetic_handling_functions[handling](
                self, word)
        except KeyError:
            # the handling key is not in phonetic_handling_functions
            raise NotImplementedError from None

    def word_replacer(self, word):
        if word in self.phonetic_set:
            return self.phonetic_replacer(word, self.phonetic_set_handling)
        elif word in self.word_dictionary: # should replace according to dictionary
            return self.dictionary_replacer(word)
        elif re.match(r"[A-Z][a-z]*", word): # unofficial word
            return self.phonetic_replacer(word, self.unofficial_words_handling)
        else: # unrecognized
            return self.phonetic_replacer(word, self.unrecognized_words_handling)

    def replace_words(self, text):
        return re.sub(
            r"[A-Za-z]+",
            lambda match: self.word_replacer(match.group(0)),
            text)

    def replace_puncts(self, text):
        chs = []
        punct_counter = {}
        for ch in text:
            target = self.punct_dictionary.get(ch, ch)
            if isinstance(target, (list, tuple)): # pair punct
                current_punct_i = punct_counter.get(ch, 0)
                punct_counter[ch] = (current_punct_i + 1) % len(target)
                    # count the counter
                ch = target[current_punct_i]
            else:
                ch = target
            chs.append(ch)
        return "".join(chs)

    def remove_spaces(self, text):
        return text.replace(" ", "")

    def replace_all(self, text):
        if self.do_replace_words:
            text = self.replace_words(text)
        if self.do_replace_puncts:
            text = self.replace_puncts(text)
        if self.do_remove_spaces:
            text = self.remove_spaces(text)
        return text

if __name__ == "__main__":
    import pyperclip as pc
    import tokipona_chinese_dict as tpdict
    """demo = TokiPonaReplacer(
        tpdict.geezmo_chinese_dict,
        tpdict.punct_dict,
        tpdict.structure_word_set,
        phonetic_set_handling="hiragana",
        unofficial_words_handling="katakana",
        do_remove_spaces=True)"""
    demo = TokiPonaReplacer(
        tpdict.geezmo_chinese_dict,
        tpdict.punct_dict,
        unofficial_words_handling="katakana",
        unrecognized_words_handling="hiragana",
        do_remove_spaces=True)
    pc.copy(demo.replace_all(pc.paste()))

